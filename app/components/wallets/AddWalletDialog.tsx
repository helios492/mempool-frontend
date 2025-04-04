"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Wallet_Type, Chain_Type, CHAINS, AUDIO_OPTIONS } from "@/app/types/types";
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
import { AlertTriangle, VolumeOffIcon, AudioLinesIcon } from "lucide-react";
import LoadingSpinner from "@/app/components/ui/loading-spinner";
import Image from "next/image";
import { isValidAddress } from "@/app/lib/validation";
import { generateRandomColor, hexToRgba } from "@/app/lib/utils";
import { useAuth } from "@/app/context/AuthContext";

interface AddWalletDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddWallet: (wallet: Wallet_Type) => void;
    existingWallets: Wallet_Type[];
}

const AddWalletDialog: React.FC<AddWalletDialogProps> = ({
    open,
    onOpenChange,
    onAddWallet,
    existingWallets,
}) => {
    // Form state
    const { user } = useAuth();
    const [address, setAddress] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [audio, setAudio] = useState<string>("");
    const [chain, setChain] = useState<string>("eth");
    const [chainName, setChainName] = useState<string | undefined>("Eth-Mainnet");
    const [randomColor, setRandomColor] = useState<string>(generateRandomColor());
    const [addressError, setAddressError] = useState<string>("");
    const [isAdding, setIsAdding] = useState<boolean>(false);

    // Form handling
    const validateForm = (): boolean => {
        if (!address) {
            setAddressError("Wallet address is required");
            return false;
        }

        if (!isValidAddress(address, chain)) {
            setAddressError(`Please enter a valid ${chainName} address`);
            return false;
        }

        // Check if wallet address already exists
        if (existingWallets.some(w => w.address.toLowerCase() === address.toLowerCase())) {
            setAddressError("This wallet address is already being tracked");
            return false;
        }

        setAddressError("");
        return true;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        setIsAdding(true);
        if (user) {
            setTimeout(() => {
                const newWallet: Wallet_Type = {
                    _id: "",
                    address,
                    name: name || `Wallet ${existingWallets.length + 1}`,
                    status: true,
                    color: randomColor,
                    audio,
                    chain,
                    userId: user.id
                };

                onAddWallet(newWallet);
                setIsAdding(false);
                resetForm();
                onOpenChange(false);
            }, 500);
        }
    };

    const handleChain = (value: string) => {
        const selectedChain = CHAINS.find((item) => item.value === value);
        setChain(value);
        setChainName(selectedChain?.name);

        // Clear any previous address error when chain changes
        if (addressError && address) {
            // Re-validate address for the new chain
            const isValid = isValidAddress(address, value);
            if (!isValid) {
                setAddressError(`Please enter a valid ${selectedChain?.name} address`);
            } else {
                setAddressError("");
            }
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
        // Clear error when user starts typing again
        if (addressError) setAddressError("");
    };

    // Reset form to initial state
    const resetForm = () => {
        setAddress("");
        setName("");
        setAudio("");
        setChain("eth");
        setChainName("Eth-Mainnet");
        setAddressError("");
        setRandomColor(generateRandomColor());
    };

    // Handle dialog open/close
    const handleOpenChange = (isOpen: boolean) => {
        onOpenChange(isOpen);
        if (!isOpen) resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-screen-sm max-h-[70vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Monitoring Wallet</DialogTitle>
                    <DialogDescription>
                        Add a new wallet to monitor transactions.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label>Wallet Address<span className="text-red-500">*</span></Label>
                        <Input
                            name="address"
                            value={address}
                            onChange={handleAddressChange}
                            placeholder="0x...."
                            className={addressError ? "border-red-500" : ""}
                        />
                        {addressError && (
                            <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                                <AlertTriangle className="w-4 h-4" />
                                {addressError}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="space-y-2">
                            <Label>Custom Name</Label>
                            <Input
                                name="name"
                                value={name}
                                onChange={(event) => setName(event?.target.value)}
                                placeholder="My Wallet"
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
                                        value={audio}
                                        onValueChange={setAudio}
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
                        <div className="flex flex-col justify-center items-center p-4 bg-custom-500 rounded-lg h-[250px]">
                            <div className="w-32 h-32 rounded-md" style={{
                                backgroundColor: randomColor,
                                boxShadow: `0 0 50px ${hexToRgba(randomColor, 0.2)}`
                            }}></div>
                            <div className="mt-4 text-center">
                                <p className="text-sm font-medium font-mono">{randomColor.toUpperCase()}</p>
                                <p className="text-xs text-muted-foreground mt-1">This color will be assigned to your wallet</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3 transition-all duration-300 hover:shadow-md"
                                    onClick={() => {
                                        const newColor = generateRandomColor();
                                        setRandomColor(newColor);
                                    }}
                                >
                                    Generate New Color
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button
                            onClick={handleSave}
                            disabled={isAdding}
                        >
                            {isAdding ? (
                                <div className="flex items-center gap-2">
                                    <LoadingSpinner size="sm" />
                                    Adding Wallet...
                                </div>
                            ) : (
                                "Add Wallet"
                            )}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddWalletDialog; 