import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight} from "react-icons/fa";

type Props = {
  page?: number; // zero-based index
  onPageChange: (newPage: number) => void;
  totalPages?: number;
};

const Pagination = ({ page = 0, onPageChange = () => {}, totalPages = 0 }: Props) => {
  if (totalPages === 0) return null;
  
  const baseClass =
    "text-white/80 cursor-pointer px-1.5";

  const isFirstPage = page === 0;
  const isLastPage = page === totalPages;

  // Calculate window range
  const start = Math.max(page - 2, 0);
  const end = Math.min(page + 2, totalPages);
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-end space-x-2 mb-2 mr-2">
      {/* First */}
      <button
        className={`${baseClass} ${isFirstPage ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isFirstPage}
        onClick={() => onPageChange(0)}
      >
        <FaAngleDoubleLeft />
      </button>

      {/* Prev */}
      <button
        className={`${baseClass} ${isFirstPage ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
      >
        <FaAngleLeft/>
      </button>

      <input 
        type="number" 
        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-0 border-b border-white/40 w-10 text-center h-4 text-[12px]"
        value={page} 
        max={totalPages}
        onChange={(e) => {
          const newPage = Number(e.target.value);
          if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages) {
            onPageChange(newPage);
          }
        }}

      />

      {/* Next */}
      <button
        className={`${baseClass} ${isLastPage ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        <FaAngleRight/>
      </button>

      {/* Last */}
      <button
        className={`${baseClass} ${isLastPage ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLastPage}
        onClick={() => onPageChange(totalPages)}
      >
        <FaAngleDoubleRight />
      </button>
    </nav>
  );
};

export default Pagination;