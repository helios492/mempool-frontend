"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/app/components/ui/loading-spinner";
import Header from "@/app/components/global/Header";
import FoldersPanel from "@/app/components/folders/FoldersPanel";

type FolderPageProps = {
  params: {
    "folder-name": string;
  };
};

export default function FolderPage({ params }: FolderPageProps) {
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
      <FoldersPanel />
    </div>
  );
}
