"use client";

import WalletsPanel from "@/app/components/wallets/WalletsPanel";
import TransactionsPanel from "@/app/components/transactions/TransactionsPanel";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/app/components/ui/loading-spinner";
import Header from "@/app/components/global/Header";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show a loading spinner while loading state is true
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Triggered only after `loading` is false and `user` is null
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (!user) {
    return null; // Prevent rendering if no user is available and `loading` is false
  }

  return (
    <div>
      <Header />
      <div className="grid grid-cols-12 gap-0 w-full h-screen">
        <div className="col-span-12 xl:col-span-5 w-full h-full">
          <WalletsPanel />
        </div>
        <div className="col-span-12 xl:col-span-7 w-full h-full">
          <TransactionsPanel />
        </div>
      </div>
    </div>
  );
}
