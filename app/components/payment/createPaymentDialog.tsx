"use client";

import React, { useEffect, useState } from "react";
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
import LoadingSpinner from "@/app/components/ui/loading-spinner";
import { useAuth } from "@/app/context/AuthContext";
import { usePayment } from "@/app/context/PaymentContext";
import AlertToast from "../ui/alertToast";

interface CreatePaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CreatePaymentDialog: React.FC<CreatePaymentDialogProps> = ({
    open,
    onOpenChange,
}) => {
    // Form state
    const { user } = useAuth();
    const { setBalance, createDeposit, getBalance } = usePayment()
    const [isCreatingPayment, setIsCreatingPayment] = useState<boolean>(false);
    const [credit, setCredit] = useState<number>(0);
    const [showToast, setShowToast] = useState({ type: "", message: "" })
    const minimumCredit = process.env.NEXT_PUBLIC_MINIMUM_CREDIT

    useEffect(() => {
        if (showToast.message) {
            const timer = setTimeout(() => {
                setShowToast({ type: "", message: "" });
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleCreatePayment = async () => {
        try {
            if (credit < Number(minimumCredit)) {
                setShowToast({ type: "error", message: `You should pay at least ${minimumCredit}` })
            }
            setIsCreatingPayment(true)
            const { invoiceUrl } = await createDeposit(credit)
            
            // After successful deposit, update the balance
            // const updatedBalance = await getBalance()
            // setBalance(updatedBalance)
            setCredit(0)
            setShowToast({ type: "info", message: "Deposit initiated successfully" })
            window.open(invoiceUrl, '_blank')
        } catch (err) {
            console.error('Deposit error:', err)
            setShowToast({ type: "error", message: "Deposit failed. Please try again later." })
        } finally {
            setIsCreatingPayment(false)
        }
    }

    const handleCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredit(Number(e.target.value));
    }
    // Handle dialog open/close
    const handleOpenChange = (isOpen: boolean) => {
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-screen-sm max-h-[70vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Pay for Our Service</DialogTitle>
                    <DialogDescription>
                        You have to pay at least ${minimumCredit} to use our service
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label>Amount to Charge<span className="text-red-500">*</span></Label>
                        <Input
                            name="credit"
                            type="number"
                            value={credit}
                            onChange={handleCreditChange}
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button
                            onClick={handleCreatePayment}
                            disabled={isCreatingPayment}
                        >
                            {isCreatingPayment ? (
                                <div className="flex items-center gap-2">
                                    <LoadingSpinner size="sm" />
                                    Creating Payment...
                                </div>
                            ) : (
                                "Pay Now"
                            )}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
            {showToast.message && (
                <AlertToast message={showToast.message} type={showToast.type as 'success' | 'error' | 'info'} />
            )}
        </Dialog>
    );
};

export default CreatePaymentDialog; 