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
  const [test, setTest] = useState('');

  //get inital data
  const [deals, setDeals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setpageNumber] = useState(getNumberParam(searchParams, "pageNumber"));
  const [title, setTitle] = useState(getStringParam(searchParams, "title"));
  const [lowerPrice, setLowerPrice] = useState(getNumberParam(searchParams, "lowerPrice"));
  const [upperPrice, setUpperPrice] = useState(getNumberParam(searchParams, "upperPrice"));
  const [AAA, setAAA] = useState(getBooleanParam(searchParams, "AAA"));
  const [steamRating, setSteamRating] = useState(getNumberParam(searchParams, "steamRating"))
  const [sortBy, setSortBy] = useState(getStringParam(searchParams, "sortBy")|| 'DealRating');
  const [desc, setdesc] = useState(getBooleanParam(searchParams, "desc"));

  useEffect(() => {
    //update data if url changes
    setpageNumber(getNumberParam(searchParams, "pageNumber"));
    setTitle(getStringParam(searchParams, "title"));
    setLowerPrice(getNumberParam(searchParams, "lowerPrice"));
    setUpperPrice(getNumberParam(searchParams, "upperPrice"));
    setAAA(getBooleanParam(searchParams, "AAA"));
    setSteamRating(getNumberParam(searchParams, "steamRating"))
    setSortBy(getStringParam(searchParams, "sortBy")|| 'DealRating');
    setdesc(getBooleanParam(searchParams, "desc"));
    
    setTest(searchParams.toString());
    fetchDeals(searchParams);
  }, [searchParams]); 

  function fetchDeals(params:URLSearchParams) {
      const fetchDeals = async () => {
        try {
          const res = await fetch("/api/dealList/?" + params.toString());
          if (!res.ok) throw new Error("Failed to fetch deals");
          const data = await res.json();
          setDeals([...data.deals]);          
          setTotalPages(data.totalPages);
          console.log(params.toString());
        } catch (err: any) {
          setError(err.message);
        }
      }
      fetchDeals();
  }

  function sortTableBy(sortByName:string) {    
    const changeSort = new URLSearchParams(searchParams.toString());
    
    // flip desc if sorting the same column, otherwise reset to ascending
    const newDesc = (sortByName == sortBy) ? !desc : true;

    //add to params
    changeSort.set("sortBy", sortByName)
    changeSort.set("desc", newDesc ? "true" : "false");
    router.push(`/?${changeSort.toString()}`)
  }
  
  return (
    <>     
     {test}
        <div className="flex items-center justify-start cursor-pointer" onClick={()=> {sortTableBy('title')}}>
          {sortBy == 'title' && desc == true ? 
            <FaSortAmountDownAlt className="text-sm mx-2"/> : <FaSortAmountUpAlt className="text-sm mx-2"/>
          }
          Title
        </div>


        <div className="flex items-center justify-start cursor-pointer" onClick={()=> {sortTableBy('price')}}>
          {sortBy == 'price' && desc == true ? 
            <FaSortAmountDownAlt className="text-sm mx-2"/> : <FaSortAmountUpAlt className="text-sm mx-2"/>
          }
          Price
        </div>        
        
        {deals.map((deal) => (
          <div key={deal.dealID}>{deal.title}</div>
        ))}

    </>    
  );
}


export default DealsTable;