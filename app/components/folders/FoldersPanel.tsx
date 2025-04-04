"use client"

import React from "react"
import { Button } from "@/app/components/ui/button"
import { Folder, FolderOpen, FolderPlus, SearchIcon, MoreHorizontal, Edit, Trash2, ExternalLink, Copy } from "lucide-react"
import { Input } from "../ui/input"
import Image from "next/image"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { HexColorPicker } from "react-colorful"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogFooter, AlertDialogTitle, AlertDialogContent, AlertDialogHeader, AlertDialogDescription } from "@/app/components/ui/alert-dialog"
import AddFolderDialog from "@/app/components/folders/AddFolderDialog"
import FolderSkeleton from "@/app/components/folders/FolderSkeleton"
import { Folder_Type } from "@/app/types/types"
import { generateRandomColor } from "@/app/lib/utils"

export default function FoldersPanel() {
    const [folders, setFolders] = React.useState<Folder_Type[]>([
        {
            id: "1",
            name: "DeFi Wallets",
            createdAt: "2024-03-15",
            color: "#FF6B6B",
            walletCount: 3,
            chains: ["eth", "bsc", "arbitrum"]
        },
        {
            id: "2",
            name: "NFT Collection",
            createdAt: "2024-03-16",
            color: "#4ECDC4",
            walletCount: 2,
            chains: ["eth", "base"]
        }
    ])
    const [isLoading, setIsLoading] = React.useState(true)
    const [editingFolder, setEditingFolder] = React.useState<Folder_Type | null>(null)
    const [deletingFolder, setDeletingFolder] = React.useState<Folder_Type | null>(null)
    const [openAddDialog, setOpenAddDialog] = React.useState(false)
    const [editName, setEditName] = React.useState("")
    const [editColor, setEditColor] = React.useState("")

    React.useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    const handleAddFolder = (newFolder: Folder_Type) => {
        setFolders([...folders, newFolder])
    }

    const handleDuplicate = (folder: Folder_Type) => {
        const newFolder: Folder_Type = {
            id: String(folders.length + 1),
            name: `${folder.name} (copy)`,
            createdAt: new Date().toISOString().split('T')[0],
            color: generateRandomColor(),
            walletCount: 0,
            chains: [...folder.chains]
        }
        setFolders([...folders, newFolder])
    }

    const handleEdit = (folder: Folder_Type) => {
        setEditingFolder(folder)
        setEditName(folder.name)
        setEditColor(folder.color)
    }

    const handleSaveEdit = () => {
        if (!editingFolder) return
        setFolders(folders.map(folder =>
            folder.id === editingFolder.id
                ? { ...folder, name: editName, color: editColor }
                : folder
        ))
        setEditingFolder(null)
    }

    const handleDelete = (folder: Folder_Type) => {
        setDeletingFolder(folder)
    }

    const confirmDelete = () => {
        if (!deletingFolder) return
        setFolders(folders.filter(folder => folder.id !== deletingFolder.id))
        setDeletingFolder(null)
    }



    return (
        <div
            className="mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 lg:mt-8 h-screen"
        >
            <div className="flex flex-col flex-1 rounded-lg p-6 bg-custom-500/30 space-y-6 overflow-hidden w-full">

                <div className="flex flex-row justify-between items-center flex-wrap gap-2">
                    <h2 className="text-lg font-bold flex flex-row items-center">
                        <FolderOpen className="w-5 h-5 mr-2" />
                        Folders Dashboard
                    </h2>
                    <Button
                        onClick={() => setOpenAddDialog(true)}
                        size="sm"
                        className="text-sm h-9"
                        disabled={isLoading}
                    >
                        <FolderPlus className="w-4 h-4 mr-1" />
                        Create Folder
                    </Button>
                </div>

                <div className="relative w-full flex-shrink-0 md:max-w-80 mr-auto">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Search by folder name..."
                        className="w-full h-12 pl-10"
                        value=""
                    />
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <FolderSkeleton key={i} />
                        ))}
                    </div>
                ) : folders.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No folders created yet
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 p-6 rounded-lg bg-custom-500 hover:bg-custom-400 transition-colors relative overflow-hidden"
                            >
                                <div
                                    className="w-1 h-full shadow-md absolute top-0 left-0"
                                    style={{ backgroundColor: folder.color }}
                                />
                                <div className="flex justify-between items-start w-full gap-4">
                                    <Link href={`/folders/${folder.id}`} className="flex flex-col items-start justify-center gap-2 w-full">
                                        <div className="flex flex-row items-center gap-2">
                                            <Folder className="w-4 h-4" style={{ color: folder.color }} />
                                            <h3 className="font-medium truncate">{folder.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-1">
                                                    {folder.chains.map((chain) => (
                                                        <Image
                                                            key={chain}
                                                            src={`/${chain}.svg`}
                                                            alt={chain}
                                                            width={16}
                                                            height={16}
                                                            className="rounded-full ring-1 ring-background"
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {folder.walletCount} {folder.walletCount === 1 ? 'wallet' : 'wallets'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/folders/${folder.id}`} className="flex items-center gap-2">
                                                    <ExternalLink className="h-4 w-4" />
                                                    Open
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(folder)} className="flex items-center gap-2">
                                                <Copy className="h-4 w-4" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEdit(folder)} className="flex items-center gap-2">
                                                <Edit className="h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(folder)} className="flex items-center gap-2 text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Dialog */}
                <Dialog open={!!editingFolder} onOpenChange={() => setEditingFolder(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Folder</DialogTitle>
                            <DialogDescription>
                                Make changes to your folder. Click save when you are done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Folder Name</Label>
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Enter folder name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Folder Color</Label>
                                <div className="flex flex-col justify-center items-center p-4 bg-custom-500 rounded-lg">
                                    <HexColorPicker color={editColor} onChange={setEditColor} />
                                    <div className="flex items-center gap-2 mt-4">
                                        <div className="w-8 h-8 rounded-md shadow-md" style={{ backgroundColor: editColor }}></div>
                                        <span className="text-sm font-mono">{editColor.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingFolder(null)}>Cancel</Button>
                            <Button onClick={handleSaveEdit}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!deletingFolder} onOpenChange={() => setDeletingFolder(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this folder? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Add Folder Dialog */}
                <AddFolderDialog
                    open={openAddDialog}
                    onOpenChange={setOpenAddDialog}
                    onAddFolder={handleAddFolder}
                    existingFolders={folders}
                />
            </div>
        </div>
    )
} 