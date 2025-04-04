"use client";

import React, { useEffect, useState } from "react";
import { AudioLinesIcon, VolumeX, VolumeOffIcon, Settings2, X, Copy, CheckCircle2, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";

import { Wallet_Type, Chain_Type, CHAINS, AUDIO_OPTIONS, getExplorerUrl } from "@/app/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import AudioCp from "@/app/components/ui/AudioCp";
import { HexColorPicker } from "react-colorful";

import { SubscriptionToggle } from "@/app/components/ui/subscription-toggle";
import Image from "next/image";
import LoadingSpinner from "@/app/components/ui/loading-spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { formatAddress, useCopyToClipboard } from "@/app/lib/utils";

type WalletItemProps = {
  wallet: Wallet_Type;
  onEdit: (updatedWallet: Wallet_Type) => void;
  onDelete: (deletedWallet: Wallet_Type) => void;
};

const WalletItem: React.FC<WalletItemProps> = ({ wallet, onEdit, onDelete }) => {
  // State for wallet properties
  const [name, setName] = useState<string>(wallet.name);
  const [color, setColor] = useState<string>(wallet.color || "#000000");
  const [audio, setAudio] = useState<string>(wallet.audio);
  const [chain, setChain] = useState<string>(wallet.chain);

  // UI state
  const [chainName, setChainName] = useState<string | undefined>("");
  const [checked, setChecked] = useState<boolean>(wallet.status);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState<boolean>(false);
  const { copied, copyToClipboard } = useCopyToClipboard();

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(wallet);
      setIsDeleting(false);
    }, 300);
  };

  const handleEdit = () => {
    setIsEditing(true);
    const editedWallet: Wallet_Type = {
      ...wallet,
      name,
      color,
      audio,
      chain
    };

    setTimeout(() => {
      onEdit(editedWallet);
      setIsEditing(false);
    }, 300);
  };

  const handleChecked = () => {
    setIsTogglingStatus(true);
    setChecked(!checked);

    const editedWallet: Wallet_Type = {
      ...wallet,
      status: !wallet.status
    };

    setTimeout(() => {
      onEdit(editedWallet);
      setIsTogglingStatus(false);
    }, 300);
  };

  const saveColor = () => {
    const editedWallet: Wallet_Type = {
      ...wallet,
      color
    };
    onEdit(editedWallet);
  };

  const handleAudio = (value: string) => {
    setAudio(value);
    const editedWallet: Wallet_Type = {
      ...wallet,
      audio: value
    };
    onEdit(editedWallet);
  };

  const handleChain = (value: string) => {
    const selectedChain = CHAINS.find((item) => item.value === value);
    setChain(value);
    setChainName(selectedChain?.name);
  };

  // Get the explorer URL from the centralized function
  const explorerBaseUrl = getExplorerUrl(wallet.chain);

  useEffect(() => {
    setColor(wallet.color || "#000000");
    setChain(wallet.chain);
    setName(wallet.name);
    const selectedChain = CHAINS.find((item) => item.value === wallet.chain);
    setChainName(selectedChain?.name);
    setAudio(wallet.audio);
  }, [wallet]);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-150">
      <CardHeader>
        <CardTitle className="flex flex-row items-center flex-wrap gap-4 justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Dialog>
              <DialogTrigger asChild className="cursor-pointer">
                <Button
                  className="size-6 rounded-full shadow-md hover:shadow-lg transition-all duration-150"
                  size="icon"
                  style={{ backgroundColor: wallet.color }}
                ></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select your Custom Color</DialogTitle>
                  <DialogDescription>
                    This color will change the outline color of all transactions
                    for this wallet!
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center">
                  <HexColorPicker color={color} onChange={setColor} />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button onClick={saveColor}>Save</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <p className="font-bold">{wallet.name}</p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-6">
                  {!wallet.audio || wallet.audio === "" ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <AudioLinesIcon className="w-4 h-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel>Alert Sound</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={audio || wallet.audio}
                  onValueChange={(value) => handleAudio(value)}
                >
                  {AUDIO_OPTIONS.map((audioOption, index) => (
                    <DropdownMenuRadioItem
                      key={index}
                      value={audioOption.value}
                      className={`${audioOption.value ? "cursor-pointer" : "flex flex-row justify-center cursor-pointer"}`}
                    >
                      {audioOption.value ? (
                        <AudioCp source={audioOption.value} />
                      ) : (
                        audioOption.label
                      )}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex justify-center gap-2 items-center">
            <SubscriptionToggle
              checked={checked}
              onCheckedChange={handleChecked}
              disabled={isTogglingStatus}
            />
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex flex-row gap-5">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-sm h-9"
                    disabled={isEditing}
                  >
                    {isEditing ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Settings2 className="w-4 h-4 mr-1" />
                    )}
                    Edit
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-screen-sm max-h-[70vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Monitoring Wallet</DialogTitle>
                  <DialogDescription>
                    Make changes to your monitoring wallet. Click save when you are done.
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label>Wallet Address</Label>
                    <div className="flex items-center">
                      <Input
                        name="address"
                        readOnly
                        value={wallet.address}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => copyToClipboard(wallet.address)}
                        title="Copy address"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="space-y-2">
                      <Label>Custom Name</Label>
                      <Input
                        name="name"
                        value={name}
                        placeholder="Name"
                        onChange={(event) => setName(event?.target?.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Chain</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between bg-custom-500 h-12">
                            <div className="flex items-center gap-2">
                              <Image src={`/${chain}.svg`} alt={chain} width={16} height={16} />
                              {chainName}
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuLabel>Chain List</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={chain}
                            onValueChange={handleChain}
                          >
                            {CHAINS.map((chain: Chain_Type, index: number) => (
                              <DropdownMenuRadioItem
                                value={chain.value}
                                key={index}
                                className="flex flex-row justify-start cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <Image src={`/${chain.value}.svg`} alt={chain.value} width={16} height={16} />
                                  {chain.name}
                                </div>
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <Label>Alert Sound</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between bg-custom-500 h-12">
                            {audio === "" ? (
                              <span className="flex items-center gap-2">
                                <VolumeOffIcon className="w-4 h-4" />
                                None
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <AudioLinesIcon className="w-4 h-4" />
                                {audio.slice(7)}
                              </span>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                          <DropdownMenuLabel>Alert List</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={audio || wallet.audio}
                            onValueChange={(value) => setAudio(value)}
                          >
                            {AUDIO_OPTIONS.map((audioOption, index) => (
                              <DropdownMenuRadioItem
                                key={index}
                                value={audioOption.value}
                                className={`${audioOption.value ? "cursor-pointer" : "flex flex-row justify-center cursor-pointer"}`}
                              >
                                {audioOption.value ? (
                                  <AudioCp source={audioOption.value} />
                                ) : (
                                  audioOption.label
                                )}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Wallet Color</Label>
                    <div className="flex flex-col justify-center items-center p-4 bg-custom-500 rounded-lg">
                      <HexColorPicker color={color} onChange={setColor} />
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-8 h-8 rounded-md shadow-md" style={{ backgroundColor: color }}></div>
                        <span className="text-sm font-mono">{color.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button type="submit" onClick={handleEdit} disabled={isEditing}>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-sm h-9"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your monitoring wallet and remove your data from your
                    server.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    Delete Wallet
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="flex-row flex items-center justify-start gap-4">
          <div className="p-2 rounded-lg font-bold text-sm bg-custom-900/50 flex flex-row gap-2 items-center shrink-0">
            <Image src={`/${chain}.svg`} alt={chain} width={16} height={16} />
            {chainName}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-row gap-3 items-center">
                  <Link
                    href={`${explorerBaseUrl}/address/${wallet.address}`}
                    className="hover:underline truncate text-sm flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatAddress(wallet.address)}
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => copyToClipboard(wallet.address)}
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{wallet.address}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default WalletItem;
