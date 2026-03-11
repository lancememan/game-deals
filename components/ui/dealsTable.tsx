import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/ui/pagination"
import { useSearchParams, useRouter } from "next/navigation";
import { IconContext } from "react-icons";
import { FaSortAmountUpAlt, FaSortAmountDownAlt } from "react-icons/fa";
import { getNumberParam, getStringParam, getBooleanParam } from "@/lib/utils"

const DealsTable = () => { 
  //get urlParams
  const searchParams = useSearchParams();
  const router = useRouter();

  //get inital data
  const [deals, setDeals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(getNumberParam(searchParams, "pageNumber") ?? 0);
  const [title, setTitle] = useState(getStringParam(searchParams, "title"));
  const [lowerPrice, setLowerPrice] = useState(getNumberParam(searchParams, "lowerPrice"));
  const [upperPrice, setUpperPrice] = useState(getNumberParam(searchParams, "upperPrice"));
  const [AAA, setAAA] = useState(getBooleanParam(searchParams, "AAA"));
  const [steamRating, setSteamRating] = useState(getNumberParam(searchParams, "steamRating"))
  const [sortBy, setSortBy] = useState(getStringParam(searchParams, "sortBy")|| 'DealRating');
  const [desc, setdesc] = useState(getBooleanParam(searchParams, "desc"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //update data if url changes
    setPageNumber(getNumberParam(searchParams, "pageNumber") ?? 0);
    setTitle(getStringParam(searchParams, "title"));
    setLowerPrice(getNumberParam(searchParams, "lowerPrice"));
    setUpperPrice(getNumberParam(searchParams, "upperPrice"));
    setAAA(getBooleanParam(searchParams, "AAA"));
    setSteamRating(getNumberParam(searchParams, "steamRating"))
    setSortBy(getStringParam(searchParams, "sortBy")|| 'DealRating');
    setdesc(getBooleanParam(searchParams, "desc"));

    fetchDeals(searchParams);
    console.log(searchParams.toString());
  }, [searchParams]); 
  
  function fetchDeals(params:URLSearchParams) {
      const fetchDeals = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/dealList/?" + params.toString());
          if (!res.ok) throw new Error("Failed to fetch deals");
          const data = await res.json();
          setDeals([...data.deals]);   
          setLoading(false);       
          setTotalPages(data.totalPages);
          console.log(data.totalPages);
        } catch (err: any) {
          setError(err.message);
        }
      }
      fetchDeals();
  }

  function pageChange(page:number) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("pageNumber", page.toString());
      router.push(`/?${params.toString()}`)
  }

  function sortTableBy(sortByName:string) {    
    const changeSort = new URLSearchParams(searchParams.toString());
    
    // flip desc if sorting the same column, otherwise reset to ascending
    const newDesc = (sortByName == sortBy) ? !desc : true;

    //add to params
    changeSort.set("sortBy", sortByName)
    changeSort.set("desc", newDesc ? "true" : "false");
    changeSort.delete("pageNumber")
    router.push(`/?${changeSort.toString()}`)
  }
  
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Pagination page={pageNumber} totalPages={totalPages} onPageChange={(newPage) => pageChange(newPage)}/>    
      <table>
        <thead className="bg-gray-900">
          <tr>
            <th scope="col">
              
            </th>      
            <th scope="col" className="p-2.5">
              <div className="flex items-center justify-start cursor-pointer" onClick={()=> {sortTableBy('title')}}>
                {sortBy == 'title' && desc == true ? 
                  <FaSortAmountDownAlt className="text-sm mx-2"/> : <FaSortAmountUpAlt className="text-sm mx-2"/>
                }
                Title
              </div>        
            </th>
            <th scope="col" className="p-2.5">
              <div className="flex items-center justify-start cursor-pointer" onClick={()=> {sortTableBy('reviews')}}>
                {sortBy == 'reviews' && desc == true ? 
                  <FaSortAmountDownAlt className="text-sm mx-2"/> : <FaSortAmountUpAlt className="text-sm mx-2"/>
                }
                Rating
              </div>        
            </th>
            <th scope="col" className="p-2.5">
              <div className="flex items-center justify-start cursor-pointer" onClick={()=> {sortTableBy('savings')}}>
                {sortBy == 'savings' && desc == true ? 
                  <FaSortAmountDownAlt className="text-sm mx-2"/> : <FaSortAmountUpAlt className="text-sm mx-2"/>
                }
                Savings
              </div>        
            </th>      
            <th scope="col">
              <div className="flex items-center justify-start cursor-pointer" onClick={()=> {sortTableBy('price')}}>
                {sortBy == 'price' && desc == true ? 
                  <FaSortAmountDownAlt className="text-sm mx-2"/> : <FaSortAmountUpAlt className="text-sm mx-2"/>
                }
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
                const steamIcon = "/steam.webp";

            return(
              <tr key={deal.dealID} className="">
                <td className="w-[10%]">
                  <Image
                    src={deal.thumb}
                    alt={`${deal.title}-thumb`}
                    width={200}
                    height={75}
                    style={{ width: "100px", maxWidth: "100%" , height: "auto" }}
                  />
                </td>
                <td className="w-[55%] p-3.5">
                  {deal.title}
                </td>
                <td className="w-[15%] p-3.5 text-center">
                  <p className={`rating text-[12px] font-bold p-1 pl-2 pr-2 rounded ` + getRatingClass(deal.steamRatingText)}
                        >
                    {deal.steamRatingText || "N/A"}
                  </p>
                </td>
                <td className="w-[10%] p-3.5 text-center">
                  <span className={`p-1.5 rounded font-bold whitespace-nowrap 
                    ${Number(percentageSaved) >= 80 ? "bg-green-400 text-emerald-950" : 
                    Number(percentageSaved) >= 60 ? "bg-orange-400 text-orange-950" : 
                    "bg-yellow-300 text-yellow-900"}`}>
                      - {percentageSaved}%
                  </span>
                </td>
                <td className="w-[10%]">
                  <Link target="_blank" href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`} className="text-center flex gap-2.5 justify-center items-center" title='steam'>
                    <img src={steamIcon} 
                            alt='steam'
                            width={16} 
                            height={16} 
                            className="inline-block ml-1 mr-1 flex-none"
                            crossOrigin='anonymous' />
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
    </>    
  );
}


export default DealsTable;