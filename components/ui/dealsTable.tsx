import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/ui/pagination"
import { FaSortAmountUpAlt, FaSortAmountDownAlt } from "react-icons/fa";

type filterOptions = {
  title?: string;
  pageNumber?: string;
  pageSize?: string;
  lowerPrice?: string;
  upperPrice?: string;
  AAA?: string;
  steamRating?: string;
  sortBy?: string;
  desc?: string;
}

const DealsTable = (options: filterOptions) => {

  //get initial states from options props
  const [deals, setDeals] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(options.pageNumber ?? 0);
  const [title, setTitle] = useState(options.title ?? '');
  const [lowerPrice, setLowerPrice] = useState(options.lowerPrice ?? '5');
  const [upperPrice, setUpperPrice] = useState(options.upperPrice ?? '50');
  const [AAA, setAAA] = useState(options.AAA ?? '0');
  const [sortBy, setSortBy] = useState(options.sortBy ?? 'DealRating');
  const [desc, setDesc] = useState(options.desc ?? '0');

  
  useEffect(() => {

      //when url changes, fetch new data
      const params = new URLSearchParams();  
      params.append("pageNumber", pageNumber.toString());
      if (title) params.append("title", title);
      if (lowerPrice) params.append("lowerPrice", lowerPrice);
      if (upperPrice) params.append("upperPrice", upperPrice);
      if (AAA) params.append("AAA", AAA);
      if (sortBy) params.append("sortBy", sortBy);
      if (desc) params.append("desc", desc);

      const fetchDeals = async () => {
        try {
          const res = await fetch("/api/dealList/?" + params.toString());
          if (!res.ok) throw new Error("Failed to fetch deals");
          const data = await res.json();
          setDeals([...data.deals]);
          setTotalPages(data.totalPages);
        } catch (err: any) {
          setError(err.message);
        }
      }
      fetchDeals();
  }, [pageNumber, title, lowerPrice, upperPrice, AAA, sortBy, desc]);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  function getRatingClass(rating: string) {
  switch (rating) {
    case "Overwhelmingly Positive":
      return "bg-green-400 text-emerald-950";
    case "Very Positive":
      return "bg-green-400 text-emerald-950";
    case "Positive":
    case "Mostly Positive":
      return "bg-lime-400 text-emerald-950";
    case "Mixed":
      return "bg-orange-400 text-orange-950";
    case "Mostly Negative":
    case "Negative":
      return "bg-orange-400 text-orange-950";
    case "Very Negative":
    case "Overwhelmingly Negative":
      return "bg-red-500 text-red-950";
    default:
      return "bg-gray-300 text-gray-900";
  }
}

  return (
    <>
    <table className="table-auto border-collapse w-full">
      <thead>
        <tr>
          <th className="px-4 py-2"></th>          
          <th className="px-4 py-2">
            <div className="text-sm flex gap-2">
              { sortBy === 'Title' && desc === '0' ? <FaSortAmountUpAlt /> : <FaSortAmountDownAlt /> }
              Title
            </div>            
          </th>
          <th className="px-4 py-2">                      
            <div className="text-sm flex gap-2">
              <FaSortAmountUpAlt />
              %
            </div>            
          </th>
          <th className="px-4 py-2">
            <div className="text-sm flex gap-2">
              <FaSortAmountUpAlt />
              Review Count
            </div>
          </th>
          <th className="px-4 py-2">
            <div className="text-sm flex gap-2">
              <FaSortAmountUpAlt />
              Steam Rating
            </div>
          </th>
          <th className="px-4 py-2">
            <div className="text-sm flex gap-2">
              <FaSortAmountUpAlt />
              Price
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {deals.map((deal) => {

          const percentageSaved = (
            ((deal.normalPrice - deal.salePrice) / deal.normalPrice) * 100
          ).toFixed(0);
          const steamIcon = "https://www.cheapshark.com/img/stores/icons/0.png";

          return (
            <tr key={deal.dealID} className="deal-entry bg-gray-900 rounded-sm">
              <td className="px-4 py-2">
                <Image
                  src={deal.thumb}
                  alt={`${deal.title}-thumb`}
                  width={130}
                  height={45}
                  style={{ width: "150px", maxWidth: "100%" , height: "auto" }}
                />
              </td>
              <td className="px-4 py-2">{deal.title}</td>
              <td className="px-4 py-2">
                <span className={`p-1.5 rounded font-bold whitespace-nowrap 
                ${Number(percentageSaved) >= 80 ? "bg-green-400 text-emerald-950" : 
                  Number(percentageSaved) >= 60 ? "bg-orange-400 text-orange-950" : 
                  "bg-yellow-300 text-yellow-900"}`}>
                    - {percentageSaved}%
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                { deal.steamRatingCount ? deal.steamRatingCount.toLocaleString() : 'N/A' }
              </td>
              <td className="px-4 py-2 text-center">
                  <p className={`rating text-[12px] font-bold p-1 pl-2 pr-2 rounded ` + getRatingClass(deal.steamRatingText)}
                  >
                    {deal.steamRatingText || "N/A"}
                  </p>
              </td>
              <td className="px-4 py-2">                  
                  <Link target="_blank" href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`} className="text-center flex gap-2.5 justify-center items-center" title='steam'>
                    <img src={steamIcon} 
                            alt='steam'
                            width={16} 
                            height={16} 
                            className="inline-block ml-1 mr-1 flex-none"/>
                    <div>
                      <p className="text-gray-500 text-[12px] text-left">${deal.normalPrice}</p>
                      <p className="text-[18px] text-green-600">${deal.salePrice}</p>
                    </div>
                    
                  </Link>
              </td>
            </tr>
          );
        })}

      </tbody>
    </table>
      <Pagination page={pageNumber} totalPages={totalPages} onPageChange={(newPage) => setPageNumber(newPage)} />
    </>
  );

};

export default DealsTable;