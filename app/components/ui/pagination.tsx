import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];

        // If 5 or fewer pages, show all
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page
        pages.push(1);

        // Handle different cases
        if (currentPage <= 3) {
            // Near the start: show 1, 2, 3, ..., last
            pages.push(2, 3, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            // Near the end: show 1, ..., last-2, last-1, last
            pages.push('...', totalPages - 2, totalPages - 1, totalPages);
        } else {
            // In the middle: show 1, ..., current-1, current, current+1, ..., last
            pages.push(
                '...',
                currentPage - 1,
                currentPage,
                currentPage + 1,
                '...',
                totalPages
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="size-8"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                    <Button
                        key={index}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                ) : (
                    <span key={index} className="px-1 text-gray-500">
                        •••
                    </span>
                )
            ))}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="size-8"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
} 