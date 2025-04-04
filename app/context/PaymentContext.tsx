"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

interface PaymentContextType {
    balance: number;
    setBalance: (balance: number) => void;
    createDeposit: (amount: number) => Promise<DepositResponse>;
    getBalance: () => Promise<number>;
    checkPaymentStatus: (orderId: string) => Promise<string>;
    getPaymentHistory: () => Promise<PaymentHistoryItem[]>;
}

const initialPaymentContext: PaymentContextType = {
    balance: 0,
    setBalance: () => { },
    createDeposit: async () => ({ invoiceUrl: '', orderId: '' }),
    getBalance: async () => 0,
    checkPaymentStatus: async () => '',
    getPaymentHistory: async () => [],
};

export const PaymentContext = createContext<PaymentContextType>(initialPaymentContext);

interface PaymentProviderProps {
    children: ReactNode;
}

interface DepositResponse {
    invoiceUrl: string;
    orderId: string;
}

interface BalanceResponse {
    balance: number;
}

interface PaymentStatusResponse {
    status: string;
}

interface PaymentHistoryItem {
    amount: number;
    createdAt: string;
    status: string;
    type: string;
}

interface PaymentHistoryResponse {
    message: string;
    history: PaymentHistoryItem[];
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
    const [balance, setBalance] = useState<number>(0); // Correct use of number
    const [token, setToken] = useState<string | null>(null)

    useEffect(()=>{
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    },[])

    const createDeposit = async (amount: number): Promise<DepositResponse> => {
        try {
            console.log("token", token);
            if (!token) {
                throw new Error("No token found");
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}payment/deposit`;
            const response: AxiosResponse<DepositResponse> = await axios.post(
                url,
                { amount },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error: unknown) {
            console.error("Deposit creation error:", error instanceof Error ? error.message : "Unknown error");
            throw new Error("Failed to create deposit");
        }
    };

    const getBalance = async (): Promise<number> => {
        try {
            if (!token) {
                throw new Error("No token found");
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}payment/getBalance`;

            const result: AxiosResponse<BalanceResponse> = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return result.data.balance
        } catch (error: unknown) {
            console.error("Balance fetch error:", error instanceof Error ? error.message : "Unknown error");
            throw new Error("Failed to fetch balance");
        }
    };

    const checkPaymentStatus = async (orderId: string): Promise<string> => {
        try {
            if (!token) {
                throw new Error("No token found");
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}payment/status/${orderId}`;

            const response: AxiosResponse<PaymentStatusResponse> = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return response.data.status;
        } catch (error: unknown) {
            console.error("Payment status check error:", error instanceof Error ? error.message : "Unknown error");
            throw new Error("Failed to fetch payment status");
        }
    };

    const getPaymentHistory = async (): Promise<PaymentHistoryItem[]> => {
        try {
            if (!token) {
                throw new Error("No token found");
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}payment/history`;

            const response: AxiosResponse<PaymentHistoryResponse> = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return response.data.history;
        } catch (error: unknown) {
            console.error("Payment history fetch error:", error instanceof Error ? error.message : "Unknown error");
            throw new Error("Failed to fetch payment history");
        }
    };

    return (
        <PaymentContext.Provider value={{ balance, setBalance, createDeposit, getBalance, checkPaymentStatus, getPaymentHistory }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);
