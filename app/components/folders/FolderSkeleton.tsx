"use client"

import React from "react"

export default function FolderSkeleton() {
    return (
        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 p-6 rounded-lg bg-custom-500 relative overflow-hidden animate-pulse">
            <div className="w-1 h-full shadow-md absolute top-0 left-0 bg-custom-300" />
            <div className="flex justify-between items-start w-full gap-4">
                <div className="flex flex-col items-start justify-center gap-3 w-full">
                    <div className="flex flex-row items-center gap-2">
                        <div className="w-4 h-4 rounded bg-custom-300" />
                        <div className="h-6 w-32 bg-custom-300 rounded" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="w-4 h-4 rounded-full bg-custom-300 ring-1 ring-background"
                                    />
                                ))}
                            </div>
                            <div className="h-4 w-20 bg-custom-300 rounded" />
                        </div>
                    </div>
                </div>
                <div className="w-8 h-8 rounded bg-custom-400" />
            </div>
        </div>
    )
} 