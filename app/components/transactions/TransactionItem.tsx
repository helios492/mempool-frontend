"use client";
import { Transaction_Type, Wallet_Type, getExplorerUrl } from "@/app/types/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Copy, Trash2, ExternalLink, CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import LoadingSpinner from "@/app/components/ui/loading-spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { formatAddress, useCopyToClipboard } from "@/app/lib/utils";

type TransactionProps = {
  transaction: Transaction_Type;
  wallet: Wallet_Type;
  onRemove?: (transaction: Transaction_Type) => void;
};

const TransactionItem: React.FC<TransactionProps> = ({ transaction, wallet, onRemove }) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { copied, copyToClipboard } = useCopyToClipboard();

  // Determine the counterparty address
  const friend = transaction.from === wallet.address ? transaction.to : transaction.from;

  const handleRemoveTransaction = () => {
    setIsDeleting(true);
    setTimeout(() => {
      if (onRemove) {
        onRemove(transaction);
      }
      setShowDeleteAlert(false);
      setIsDeleting(false);
    }, 300);
  };

  // Get the explorer URL from the centralized function
  const explorerBaseUrl = getExplorerUrl(wallet.chain);

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    if (diffInSeconds < 1) return `Just now`
    if (diffInSeconds === 1) return `1 sec ago`
    if (diffInSeconds < 60) return `${diffInSeconds} secs ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes === 1) return "1 min ago";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
  
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  useEffect(() => {
    if (Math.floor((Date.now() - transaction.track_point) / 1000) < 1 || Math.floor((Date.now() - transaction.track_point) / 1000) === 1 && wallet.audio) {
      const audio = new Audio(`${wallet.audio}`);
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  }, []);

  return (
    <div
      className="flex flex-col rounded-lg p-4 w-full bg-custom-500 shadow-lg hover:shadow-xl transition-all duration-150"
      style={{ border: `1px solid ${wallet.color}` }}
    >
      <div className="flex flex-row justify-start items-center gap-3 w-full flex-wrap">
        {/* Wallet indicator */}
        <div
          className="size-4 lg:size-6 rounded-full shrink-0 shadow-[0_6px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-primary/30 hover:bg-primary/90 transition-all duration-150"
          style={{ backgroundColor: wallet.color }}
        ></div>

        {/* Chain */}
        <div className="p-2 rounded-lg text-sm text-foreground/50 bg-custom-900/50 flex flex-row gap-2 items-center whitespace-nowrap truncate shrink-0 uppercase">
          <Image src={`/${wallet.chain}.svg`} alt={wallet.chain} width={16} height={16} />
          {wallet.chain}
        </div>

        {/* Transaction hash */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-row gap-3 items-center">
                {/* <Link
                  href={`${explorerBaseUrl}/tx/${transaction.txHash}`}
                  className="hover:underline truncate text-sm flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </Link> */}
                  <span className="text-sm">{formatAddress(transaction.txHash)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => copyToClipboard(transaction.txHash)}
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <span className="text-sm" style={{color: wallet.color}}>{getTimeAgo(transaction.track_point)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{transaction.txHash}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Status and actions */}
        <div className="flex justify-end items-center gap-2 ml-auto">
          <p
            className={`inline-flex rounded-md bg-opacity-10 py-1 px-4 text-sm font-medium capitalize ${transaction.status === "confirmed"
              ? "bg-[#3E5A16]/50 border border-[#3E5A16]"
              : "bg-amber-700 text-amber-500 border border-amber-700"
              }`}
          >
            {transaction.status}
          </p>
          <Button
            variant="outline"
            size="icon"
            className="size-7 text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/50"
            onClick={() => setShowDeleteAlert(true)}
            title="Remove transaction"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Transaction details */}
      {transaction.status === "confirmed" && (
        <div className="flex flex-row justify-start items-center gap-3 grow flex-wrap w-full bg-custom-900/50 rounded-lg p-4 text-xs mt-2 text-foreground/50">
          {/* Wallet name with link */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`${explorerBaseUrl}/address/${wallet.address}`}
                  className="hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: wallet.color }}
                >
                  {wallet.name}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{wallet.address}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span>called</span>

          {/* Action */}
          <Link
            href={`${explorerBaseUrl}/tx/${transaction.txHash}`}
            className="hover:underline truncate text-xs flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-green-400 font-bold">{transaction.action}</span>
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </Link>

          <span>with</span>

          {/* Counterparty address */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`${explorerBaseUrl}/address/${friend}`}
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatAddress(friend || '')}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{friend}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveTransaction}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Removing...
                </div>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionItem;
