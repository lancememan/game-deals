'use client'
import { useState } from "react";
import { useSearchParams } from "next/navigation"
import DealsTable from "@/components/ui/dealsTable";
import DealsFilter from "@/components/ui/dealsFilter";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false); // start true
  const searchParams = useSearchParams();

  if (isLoading) return <p className="p-4">Loading deals...</p>;

  const options = {
    title: searchParams.get("title") || undefined,
    pageNumber: searchParams.get("pageNumber") || undefined,
    pageSize: searchParams.get("pageSize") || undefined,
    lowerPrice: searchParams.get("lowerPrice") || undefined,
    upperPrice: searchParams.get("upperPrice") || undefined,
    AAA: searchParams.get("AAA") || undefined,
    steamRating: searchParams.get("steamRating") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
  };


  return (
    <>
      <section className="bg-background text-foreground text-center p-16">
        <h1 className="text-3xl font-bold">
          Cheap Deals For The Thrifty Gamer!
        </h1>
      </section>

      <section className="bg-background text-foreground p-4">
        <div className="container mx-auto px-4 flex flex-row justify-between">
          <div className="text-lg basis-3/4 pr-10">
            <DealsTable {...options} />
          </div>
          <div className="text-lg border-gray-400/30 border-l px-10 basis-1/4">
            <DealsFilter />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;