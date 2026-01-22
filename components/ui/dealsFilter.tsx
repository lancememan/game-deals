import Form from "next/form"
import { redirect, useSearchParams, useRouter } from 'next/navigation'

const dealsFilter = () => {
  const searchParams = useSearchParams()
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const title = formData.get("title")?.toString() || ""
    const lowerPrice = formData.get("lowerPrice")?.toString() || ""
    const upperPrice = formData.get("upperPrice")?.toString() || ""
    const AAA = formData.get("AAA") ? true : false    
    
    const params = new URLSearchParams();

    if (title) params.set("title", title);
    if (lowerPrice) params.set("lowerPrice", lowerPrice);
    if (upperPrice) params.set("upperPrice", upperPrice);
    if (AAA) params.set("AAA", "1");

    router.push(`/?${params.toString()}`)
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
                defaultChecked={searchParams.get("AAA") == "1"}
                value="1"
                className="appearance-none w-6 h-6 bg-gray-800 rounded-md outline-1 -outline-offset-1 outline-gray-600 checked:bg-blue-950 checked:before:content-['\2714'] checked:text-sm checked:before:flex checked:before:items-center checked:before:justify-center"
            />
        </div>
      </div>
      <button type="submit" className="px-3 py-1 rounded-md border float-end border-gray-300/50 text-white/70 hover:bg-white/50 hover:text-black cursor-pointer block w-full">Submit</button>
    </Form>
  )
}

export default dealsFilter