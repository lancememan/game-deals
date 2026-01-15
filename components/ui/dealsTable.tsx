import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/ui/pagination"

type filterOptions = {
  title?: string;
  pageNumber?: string;
  pageSize?: string;
  lowerPrice?: string;
  upperPrice?: string;
  AAA?: string;
  steamRating?: string;
  sortBy?: string;
}

const DealsTable = (options: filterOptions) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deals, setDeals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(options.pageNumber ?? '0');
  const [title, setTitle] = useState(options.title ?? '');
  const [pageSize, setPageSize] = useState(options.pageSize ?? '10');
  const [lowerPrice, setLowerPrice] = useState(options.lowerPrice ?? '5');
  const [upperPrice, setUpperPrice] = useState(options.upperPrice ?? '50');
  const [AAA, setAAA] = useState(options.AAA ?? '1');
  const [steamRating, setSteamRating] = useState(options.steamRating ?? '0');
  const [sortBy, setSortBy] = useState(options.sortBy ?? 'Metacritic');

  //only add params when not empty
  const params = new URLSearchParams();  
  params.append("storeID", "1");
  params.append("pageNumber", pageNumber.toString());
  params.append("pageSize", pageSize);
  if (title) params.append("title", title);
  if (lowerPrice) params.append("lowerPrice", lowerPrice);
  if (upperPrice) params.append("upperPrice", upperPrice);
  if (AAA) params.append("AAA", AAA);
  if (steamRating) params.append("steamRating", steamRating);
  if (sortBy) params.append("sortBy", sortBy);
  
  useEffect(() => {
      const fetchDeals = async () => {
        try {
          const res = await fetch("/api/dealList/?" + params.toString());
          if (!res.ok) throw new Error("Failed to fetch deals");
          const data = await res.json();
          setDeals([...data.deals]);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchDeals();
  }, [pageNumber, pageSize, title, lowerPrice, upperPrice, AAA, steamRating, sortBy]);

  if (isLoading) return <p>Loading deals...</p>;
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

  // return (
  //   <></>
  // )
  
  return (
    <>
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2"></th>          
          <th className="border border-gray-300 px-4 py-2">Name</th>          
          <th className="border border-gray-300 px-4 py-2">%</th>
          <th className="border border-gray-300 px-4 py-2">Price</th>
          <th className="border border-gray-300 px-4 py-2">Rating</th>
          <th className="border border-gray-300 px-4 py-2">Cheapest Store</th>
        </tr>
      </thead>
      <tbody>
        {deals.map((deal) => {

          const percentageSaved = (
            ((deal.normalPrice - deal.salePrice) / deal.normalPrice) * 100
          ).toFixed(0);
          const steamIcon = "https://www.cheapshark.com/img/stores/icons/0.png";
          const cheaperStoreName = deal.cheapestStore?.storeName || "null";
          const cheaperStoreIconId = deal.cheapestStore?.icon || "null";

          // console.log(deal);
          return (
            <tr key={deal.dealID} className="deal-entry">
              <td className="border border-gray-300 px-4 py-2">
                <div className="relative">
                  <span
                    className={`rating absolute text-[12px] font-bold p-1 pl-2 pr-2 rounded ` + getRatingClass(deal.steamRatingText)}
                  >
                    {deal.steamRatingText || "N/A"}
                  </span>
                <Image
                  src={deal.thumb}
                  alt={`${deal.title}-thumb`}
                  width={130}
                  height={45}
                  style={{ width: "150px", maxWidth: "100%" , height: "auto" }}
                />
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">{deal.title}</td>
              <td className="border border-gray-300 px-4 py-2">
                <span className={`p-1.5 rounded font-bold whitespace-nowrap 
                ${Number(percentageSaved) >= 80 ? "bg-green-400 text-emerald-950" : 
                  Number(percentageSaved) >= 60 ? "bg-orange-400 text-orange-950" : 
                  "bg-yellow-300 text-yellow-900"}`}>
                    - {percentageSaved}%
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <p className="text-gray-500 text-[12px] text-center">${deal.normalPrice}</p>
                <Link target="_blank" href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`} className="text-center block">
                  <img src={steamIcon}
                          alt='steam'
                          width={16} 
                          height={16} 
                          className="inline-block ml-1 mr-1"/> ${deal.salePrice}
                </Link>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <Link target="_blank" href={`https://www.metacritic.com` + deal.metacriticLink}>{deal.metacriticScore || "N/A"}</Link>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {deal.cheapestStore ? (
                  <Link target="_blank" href={`https://www.cheapshark.com/redirect?dealID=${deal.cheapestStore.dealID}`} className="text-center block" title={cheaperStoreName}>
                    <img src={`https://www.cheapshark.com/${cheaperStoreIconId}`}
                          alt={cheaperStoreName} 
                          width={16} 
                          height={16} 
                          className="inline-block ml-1 mr-1"/>
                     <p className="text-[12px] text-green-600">${deal.cheapestStore.salePrice}</p>
                  </Link>
                ) : (
                  <Link target="_blank" href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`} className="text-center block" title='steam'>
                    <img src={steamIcon} 
                            alt='steam'
                            width={16} 
                            height={16} 
                            className="inline-block ml-1 mr-1"/>
                    <p className="text-[12px] text-green-600">${deal.salePrice}</p>
                  </Link>
                )}            
              </td>
            </tr>
          );
        })}

      </tbody>
    </table>
      {/* <Pagination page={pageNumber} onPageChange={(newPage) => setPageNumber(newPage)} />     */}
    </>
  );
};

export default DealsTable;