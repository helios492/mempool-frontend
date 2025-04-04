"use client"

import React, { useState } from "react"
import { Button } from "@/app/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Input } from "@/app/components/ui/input"
import { HexColorPicker } from "react-colorful"
import { generateRandomColor } from "@/app/lib/utils"
import LoadingSpinner from "@/app/components/ui/loading-spinner"

type Folder = {
    id: string
    name: string
    createdAt: string
    color: string
    walletCount: number
    chains: string[]
}

interface AddFolderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddFolder: (folder: Folder) => void
    existingFolders: Folder[]
}

export default function AddFolderDialog({
    open,
    onOpenChange,
    onAddFolder,
    existingFolders,
}: AddFolderDialogProps) {
    const [name, setName] = useState("")
    const [color, setColor] = useState(generateRandomColor())
    const [isAdding, setIsAdding] = useState(false)

    const handleSave = () => {
        if (!name.trim()) return

        setIsAdding(true)
        setTimeout(() => {
            const newFolder: Folder = {
                id: Math.random().toString(36).substr(2, 9),
                name: name.trim(),
                createdAt: new Date().toISOString(),
                color,
                walletCount: 0,
                chains: []
            }

            onAddFolder(newFolder)
            setIsAdding(false)
            resetForm()
            onOpenChange(false)
        }, 500)
    }

    const resetForm = () => {
        setName("")
        setColor(generateRandomColor())
    }

    const handleOpenChange = (isOpen: boolean) => {
        onOpenChange(isOpen)
        if (!isOpen) resetForm()
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>
                        Create a new folder to organize your wallets.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Folder Name<span className="text-red-500">*</span></Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter folder name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Folder Color</Label>
                        <div className="flex flex-col justify-center items-center p-4 bg-custom-500 rounded-lg">
                            <HexColorPicker color={color} onChange={setColor} />
                            <div className="flex items-center gap-2 mt-4">
                                <div className="w-8 h-8 rounded-md shadow-md" style={{ backgroundColor: color }}></div>
                                <span className="text-sm font-mono">{color.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isAdding || !name.trim()}>
                        {isAdding ? (
                            <div className="flex items-center gap-2">
                                <LoadingSpinner size="sm" />
                                Creating Folder...
                            </div>
                        ) : (
                            "Create Folder"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 