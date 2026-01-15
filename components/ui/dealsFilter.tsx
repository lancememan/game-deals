import Form from "next/form"
import { redirect, useSearchParams } from 'next/navigation'

const dealsFilter = () => {
  const searchParams = useSearchParams()

  async function handleSubmit(formData: FormData) {
    const title = formData.get("title")?.toString() || ""
    const pageSize = formData.get("pageSize")?.toString() || "10"
    const lowerPrice = formData.get("lowerPrice")?.toString() || ""
    const upperPrice = formData.get("upperPrice")?.toString() || ""
    const AAA = formData.get("AAA") ? "true" : "false"
    const steamRating = formData.get("steamRating")?.toString() || "0"
    const sortBy = formData.get("sortBy")?.toString() || "DealRating"
    
    const params = new URLSearchParams();

    if (title) params.set("title", title);
    if (pageSize) params.set("pageSize", pageSize);
    if (lowerPrice) params.set("lowerPrice", lowerPrice);
    if (upperPrice) params.set("upperPrice", upperPrice);
    if (AAA === "true") params.set("AAA", "true");
    if (steamRating !== "0") params.set("steamRating", steamRating);
    if (sortBy) params.set("sortBy", sortBy);

    redirect(`/?${params.toString()}`)
  }


  return (
    <Form action={handleSubmit}>
      {/* On submission, the input value will be appended to
          the URL, e.g. /search?query=abc */}
      <div className="mb-4">
        <label htmlFor="title" className="block font-medium sr-only">Search</label>
        <input 
        name="title" 
        defaultValue={searchParams.get("title") || ""}
        className="bg-gray-800 px-4 py-1 text-base text-white w-full rounded-md focus:outline-none" 
        placeholder="Search..."/>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center">
            <label htmlFor="pageSize" className="pr-5 whitespace-nowrap">Item Per Page:</label>
            <select
                name="pageSize"
                id="pageSize"
                defaultValue={searchParams.get("pageSize") || "10"}
                className="bg-gray-800 py-1.5 pr-3 pl-1 text-base rounded-md outline-1 -outline-offset-1 outline-gray-600 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-500"
            >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
            </select>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center">
            <label htmlFor="lowerPrice" className="pr-5 whitespace-nowrap">Lowest Price:</label>
            <div className="flex items-center rounded-md bg-white/5 outline-1 -outline-offset-1 outline-gray-600 w-20">
            <div className="text-base text-gray-400 select-none sm:text-sm/6 px-2">$</div>
            <input
                    id="lowerPrice"
                    name="lowerPrice"
                    type="number"
                    placeholder="5"
                    defaultValue={searchParams.get("lowerPrice") || ""}
                    step="1"
                    className="no-spinner bg-gray-800 py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6 w-full"
                />
            </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center">
            <label htmlFor="upperPrice" className="pr-5 whitespace-nowrap">Highest Price:</label>
            <div className="flex items-center rounded-md bg-white/5 outline-1 -outline-offset-1 outline-gray-600 w-20">
            <div className="text-base text-gray-400 select-none sm:text-sm/6 px-2">$</div>
            <input
                    id="upperPrice"
                    name="upperPrice"
                    type="number"
                    placeholder="50"
                    defaultValue={searchParams.get("upperPrice") || ""}
                    step="1"
                    className="no-spinner bg-gray-800 py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6 w-full"
                />
            </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center">
            <label htmlFor="AAA" className="pr-5 whitespace-nowrap">Is AAA:</label>
            <input
                id="AAA"
                name="AAA"
                type="checkbox"
                defaultChecked={searchParams.get("AAA") === "1"}
                value="true"
                className="appearance-none w-6 h-6 bg-gray-800 rounded-md outline-1 -outline-offset-1 outline-gray-600 checked:bg-blue-950 checked:before:content-['\2714'] checked:text-sm checked:before:flex checked:before:items-center checked:before:justify-center"
            />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center">
            <label htmlFor="steamRating" className="pr-5 whitespace-nowrap">Steam Rating:</label>
            <select 
                name="steamRating"
                id="steamRating"
                defaultValue={searchParams.get("steamRating") || "0"}
                className="bg-gray-800 py-1.5 pr-3 pl-1 text-base rounded-md outline-1 -outline-offset-1 outline-gray-600 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-500">
                <option value="0">All</option>                                
                <option value="25">&gt; 20</option>                             
                <option value="50">&gt; 50</option>
                <option value="75">&gt; 75</option>
                <option value="80">&gt; 80</option>
                <option value="90">&gt; 90</option>                
            </select>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center">
            <label htmlFor="sortBy" className="pr-5 whitespace-nowrap">Sort By:</label>
            <select 
                name="sortBy"
                id="sortBy"
                defaultValue={searchParams.get("sortBy") || "DealRating"}
                className="bg-gray-800 py-1.5 pr-3 pl-1 text-base rounded-md outline-1 -outline-offset-1 outline-gray-600 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-500">
                <option value="DealRating">DealRating</option>                
                <option value="Savings">Savings</option>
                <option value="Price">Price</option>
                <option value="Metacritic">Metacritic</option>                
                <option value="Release">Release</option>
                <option value="Recent">Recent</option>                
            </select>
        </div>
      </div>
      <button type="submit" className="px-3 py-1 rounded-md border float-end border-gray-300/50 text-white/70 hover:bg-white/50 hover:text-black cursor-pointer block w-full">Submit</button>
    </Form>
  )
}

export default dealsFilter