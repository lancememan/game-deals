type Props = { 
  page?: number,
  onPageChange: (newPage: number) => void;
};

const Pagination = ({ page = 0 , onPageChange }: Props) => {
  const previousPage = page - 1;
  const nextPage = page + 1;
  const active = 'bg-red-600 text-white';
  console.log(page);
  return (
    <nav className="flex items-center justify-center space-x-2 mt-6">
      
      <button
        className={`px-3 py-1 rounded-md border hover:bg-red-600 hover:text-white cursor-pointer ${previousPage < 0 ? 'text-gray-600 border-gray-600' : 'text-white border-gray-300'}`}
        disabled={previousPage < 0}
        onClick={() => onPageChange(0)}
      >
        First
      </button>

      <button className={`px-3 py-1 rounded-md border border-gray-300 text-white cursor-pointer hover:bg-red-600 hover:text-white ${previousPage < 0 ? active : ''}`} 
        onClick={() => onPageChange(previousPage < 0 ? 0 : previousPage )}>
        {previousPage < 0 ? 1 : previousPage + 1}
      </button>
      <button className={`px-3 py-1 rounded-md border border-gray-300 text-white cursor-pointer hover:bg-red-600 hover:text-white ${previousPage >= 0 ? active : ''}`} 
        onClick={() => onPageChange(previousPage < 0 ? 2 : page)}>
        {previousPage < 0 ? 2 : page + 1}
      </button>
      <button className="px-3 py-1 rounded-md border border-gray-300 text-white cursor-pointer hover:bg-red-600 hover:text-white"
        onClick={() => onPageChange(previousPage < 0 ? 3 : nextPage)}>
        {previousPage < 0 ? 3 : nextPage + 1}        
      </button>

      <button className="px-3 py-1 rounded-md border border-gray-300 text-white hover:bg-red-600 hover:text-white cursor-pointer"
        onClick={() => onPageChange(nextPage)}>
        Next
      </button>
    </nav>
  );
}

export default Pagination;