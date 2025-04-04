"use client";
import { Transaction_Type } from "@/app/types/types";
import React, { useEffect, useState, useCallback } from "react";
import TransactionItem from "@/app/components/transactions/TransactionItem";
import { Button } from "@/app/components/ui/button";
import { Trash2, FileX, SearchIcon } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import LoadingSpinner from "@/app/components/ui/loading-spinner";
import { Pagination } from "@/app/components/ui/pagination";
import { Input } from "@/app/components/ui/input";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";

const PAGE_SIZES = [
  { value: 10, label: "10 per page" },
  { value: 25, label: "25 per page" },
  { value: 50, label: "50 per page" },
  { value: 100, label: "100 per page" },
] as const;


const TransactionsPanel: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction_Type[]>([]);
  const [loading, setLoading] = useState(false);
  const [showClearAlert, setShowClearAlert] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [tempKey, setTempKey] = useState<string>("");
  const token = localStorage.getItem("token");

  const fetchTxCallback = useCallback(() => {
    fetchTransaction(currentPage, pageSize, searchQuery);
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    setLoading(true);
    const interval = setInterval(() => {
      fetchTransaction(currentPage, pageSize, searchQuery);
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchTxCallback]);

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    fetchTransaction(1, pageSize, searchQuery);
  }, [pageSize]);

  useEffect(() => {
    setLoading(true);
    fetchTransaction(currentPage, pageSize, searchQuery);
  }, [currentPage]);

  const fetchTransaction = async (page: number, limit: number, searchQuery: string) => {
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}transactions`, {
      headers: { Authorization: `Bearer ${token}` },
      params:{ page, limit, searchQuery}
    })
      .then(res => {
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
        setPageSize(res.data.limit);
        setTransactions(res.data.transactions);
      })
      .catch(err => {
        console.log('Fetching transaction error : ', err);
      })
    setLoading(false);
  }

  const handleClearAll = async () => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}transactions/deleteAll`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTotal(0);
        setTotalPages(0);
        setTransactions([]);
      })
      .catch(err => {
        console.log('Deleting all transactions error : ', err);
      })
  };

  const handleRemoveTransaction = async (transaction: Transaction_Type) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}transactions/${transaction._id}`)
      .then(res => {
        const updatedTransactions = transactions.filter(tx => tx._id !== transaction._id);
        setTransactions(updatedTransactions);
      })
      .catch(err => {
        console.log('Deleting a transaction error : ', err);
      });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(tempKey)
    fetchTransaction(1, pageSize, tempKey);
  };

  const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempKey(e.target.value);
  };

  return (
    <div
      className="flex flex-col pl-4 sm:pl-6 xl:pl-0 p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8 h-screen"
    >
      <div className="flex flex-col flex-1 rounded-lg p-6 bg-custom-500/30 space-y-6 overflow-hidden w-full">
        {loading ? (
          <div className="flex items-center justify-center h-screen relative">
            <div className="blur-xl h-screen absolute top-0 left-0 w-full"></div>
            <LoadingSpinner size="lg" text="Loading transactions..." />
          </div>
        ) : (
          <>
            <div className="w-full flex flex-row justify-between items-center gap-2 flex-shrink-0">
              <h2 className="text-lg font-bold">Transactions</h2>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {pageSize} per page
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup
                      value={pageSize.toString()}
                      onValueChange={(value) => setPageSize(Number(value))}
                    >
                      {PAGE_SIZES.map((size) => (
                        <DropdownMenuRadioItem key={size.value} value={size.value.toString()}>
                          {size.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {total > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/50"
                    onClick={() => setShowClearAlert(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            <div className="relative w-full flex-shrink-0">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by transaction hash, address, or action..."
                className="w-full h-12 pl-10"
                value={tempKey}
                onChange={onChangeKeyword}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              {transactions.length === 0 ? (
                searchQuery ? "No transactions matching your search" : "No confirmed transactions found"
              ) : (
                <>
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} transactions
                </>
              )}
            </div>

            <div className="flex flex-col gap-3 min-h-0 flex-1">
              <div className="flex-1 overflow-y-auto scrollbar pr-3 space-y-4">
                {transactions.length ? (
                  transactions.map((transaction: Transaction_Type) => (
                    <TransactionItem
                      key={transaction._id}
                      transaction={transaction}
                      wallet={transaction.wallet_id}
                      onRemove={handleRemoveTransaction}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 space-y-6 h-full">
                    <FileX className="w-12 h-12 text-gray-500" />
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-gray-300">No Transactions Found</p>
                      <p className="text-sm text-gray-500 mt-4">
                        {searchQuery
                          ? "Try adjusting your search query"
                          : "Confirmed transactions from your active wallets will appear here"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {total > pageSize && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <AlertDialog open={showClearAlert} onOpenChange={setShowClearAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Transactions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all transactions? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-red-500 hover:bg-red-600"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionsPanel;
