type Props = {
  page?: number; // zero-based index
  onPageChange: (newPage: number) => void;
  totalPages?: number;
};

const Pagination = ({ page = 0, onPageChange = () => {}, totalPages = 0 }: Props) => {
  if (totalPages === 0) return null;
  
  const activeClass = "bg-red-600 text-white";
  const baseClass =
    "px-3 py-1 rounded-md border border-gray-300 text-white cursor-pointer hover:bg-red-600 hover:text-white";

  const isFirstPage = page === 0;
  const isLastPage = page === totalPages - 1;

  // Calculate window range
  const start = Math.max(page - 2, 0);
  const end = Math.min(page + 2, totalPages - 1);
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center space-x-2 mt-6">
      {/* First */}
      <button
        className={`${baseClass} ${isFirstPage ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isFirstPage}
        onClick={() => onPageChange(0)}
      >
        First
      </button>

      {/* Prev */}
      <button
        className={`${baseClass} ${isFirstPage ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((p) => (
        <button
          key={p}
          className={`${baseClass} ${page === p ? activeClass : ""}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}

      {/* Next */}
      <button
        className={`${baseClass} ${isLastPage ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>

      {/* Last */}
      <button
        className={`${baseClass} ${isLastPage ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLastPage}
        onClick={() => onPageChange(totalPages - 1)}
      >
        Last
      </button>
    </nav>
  );
};

export default Pagination;