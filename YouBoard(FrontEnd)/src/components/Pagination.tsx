import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PaginationProps } from "../types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const maxVisiblePages = 3;

  const getPageRange = () => {
    let start = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let end = start + maxVisiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPageRange();

  return (
    <div className="flex flex-wrap justify-center items-center z-10 mt-8">
      {/* Jump to Start */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 bg-gray-800 text-white hover:text-blue-600 transition-all rounded-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer disabled:hover:text-white"
      >
        <ChevronFirst className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2 p-2 bg-gray-800 text-white hover:text-blue-600 transition-all rounded-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer disabled:hover:text-white"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-sm font-medium ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-white cursor-pointer hover:bg-blue-600 hover:text-white transition-all"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-2 p-2 bg-gray-800 text-white hover:text-blue-600 transition-all rounded-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer disabled:hover:text-white"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Jump to End */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 bg-gray-800 text-white hover:text-blue-600 transition-all rounded-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer disabled:hover:text-white"
      >
        <ChevronLast className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default Pagination;
