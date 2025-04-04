"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import WalletItem from "@/app/components/wallets/WalletItem";
import { Input } from "@/app/components/ui/input";
import { Wallet_Type } from "@/app/types/types";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import LoadingSpinner from "@/app/components/ui/loading-spinner";
import AddWalletDialog from "./AddWalletDialog";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import CreatePaymentDialog from "../payment/createPaymentDialog";

const WalletManagerCp: React.FC = () => {
  // Wallet state
  const [wallets, setWallets] = useState<Wallet_Type[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // UI state
  const [openWalletDialog, setOpenWalletDialog] = useState<boolean>(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const token = localStorage.getItem("token");
  
  // Load hardcoded wallet
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}wallets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          console.log(res.data);
          setWallets(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log('Fetching wallet list error: ', err);
          setLoading(false);
        })
    }, 1000);
  }, []);

  const handleAddWallet = async (newWallet: Wallet_Type) => {
    const { _id, ...walletData } = newWallet;
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}wallets`, { wallet: walletData }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setWallets([...wallets, res.data]);
      })
      .catch(error => {
        console.log('Add wallet error : ', error);
      });
  };

  const handleEditWallet = async (updatedWallet: Wallet_Type) => {
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}wallets`, { ...updatedWallet, id: updatedWallet._id })
      .then(res => {
        setWallets(wallets.map(wallet =>
          wallet._id === updatedWallet._id ? updatedWallet : wallet
        ));
      })
      .catch(error => {
        console.log('Updating wallet error : ', error);
      });
  };

  const handleDeleteWallet = async (deletedWallet: Wallet_Type) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}wallets/${deletedWallet._id}`)
      .then(res => {
        setWallets(wallets.filter(wallet => wallet._id !== deletedWallet._id));
      })
      .catch(error => {
        console.log('Deleting wallet error : ', error);
      })
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredWallets = wallets.filter((wallet: Wallet_Type) => {
    const matchesSearch =
      wallet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && wallet.status;
    if (activeTab === "disabled") return matchesSearch && !wallet.status;

    return matchesSearch;
  });

  const walletCounts = {
    all: wallets.length,
    active: wallets.filter(w => w.status).length,
    disabled: wallets.filter(w => !w.status).length
  };

  return (
    <div className="flex flex-col p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8 h-screen">
      <div className="flex flex-col flex-1 rounded-lg p-6 bg-custom-500/30 space-y-6 overflow-hidden">
        <div className="w-full flex flex-row justify-between items-center gap-2 flex-shrink-0">
          <h2 className="text-lg font-bold">Tracked Wallets</h2>
          <Button
            variant="default"
            onClick={() => setOpenWalletDialog(true)}
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:block md:hidden lg:block">Add New Subscription</span>
          </Button>
        </div>

        <div className="relative w-full flex-shrink-0 shadow-lg">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for wallet address or name"
            className="w-full h-12 pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex-1 flex flex-col min-h-0"
        >
          <TabsList className="grid grid-cols-3 w-full mb-4 flex-shrink-0 shadow-lg">
            <TabsTrigger value="all" className="data-[state=active]:bg-custom-200">
              All ({walletCounts.all})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-[#3E5A16]">
              Subscribed ({walletCounts.active})
            </TabsTrigger>
            <TabsTrigger value="disabled" className="data-[state=active]:bg-red-800">
              Disabled ({walletCounts.disabled})
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading wallets..." />
              </div>
            ) : (
              <>
                <TabsContent value="all" className="absolute inset-0 overflow-y-auto scrollbar-hide space-y-4">
                  {filteredWallets.length > 0 ? (
                    filteredWallets.map((item: Wallet_Type) => (
                      <WalletItem
                        key={item._id}
                        wallet={item}
                        onEdit={handleEditWallet}
                        onDelete={handleDeleteWallet}
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <div className="text-gray-500 text-sm">
                        {searchQuery ? "No wallets match your search." : "No wallets found."}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="active" className="absolute inset-0 overflow-y-auto scrollbar-hide space-y-4">
                  {filteredWallets.length > 0 ? (
                    filteredWallets.map((item: Wallet_Type) => (
                      <WalletItem
                        key={item._id}
                        wallet={item}
                        onEdit={handleEditWallet}
                        onDelete={handleDeleteWallet}
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <div className="text-gray-500 text-sm">
                        {searchQuery ? "No subscribed wallets match your search." : "No subscribed wallets found."}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="disabled" className="absolute inset-0 overflow-y-auto scrollbar-hide space-y-4">
                  {filteredWallets.length > 0 ? (
                    filteredWallets.map((item: Wallet_Type) => (
                      <WalletItem
                        key={item._id}
                        wallet={item}
                        onEdit={handleEditWallet}
                        onDelete={handleDeleteWallet}
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <div className="text-gray-500 text-sm">
                        {searchQuery ? "No disabled wallets match your search." : "No disabled wallets found."}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </div>

      {/* Add Wallet Dialog */}
      <AddWalletDialog
        open={openWalletDialog}
        onOpenChange={setOpenWalletDialog}
        onAddWallet={handleAddWallet}
        existingWallets={wallets}
      />
      {/* Add Payment Dialog */}
      <CreatePaymentDialog
        open={openPaymentDialog}
        onOpenChange={setOpenPaymentDialog}
      />
    </div>
  );
};

export default WalletManagerCp;
