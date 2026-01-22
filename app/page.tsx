'use client'
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation"
import DealsTable from "@/components/ui/dealsTableNew";
import DealsFilter from "@/components/ui/dealsFilter";
import { getNumberParam, getStringParam, getBooleanParam } from "@/lib/utils"

const Page = () => {// start true

  return (
    <>
      <section className="bg-background text-foreground text-center p-7 md:p-16">
        <h1 className="text-2xl md:text-3xl font-bold">
          Cheap Deals For The Thrifty Gamer!
        </h1>
      </section>

      <section className="bg-background text-foreground p-4">
        <div className="container mx-auto md:flex flex-row justify-between">
          <div className="text-lg md:basis-3/4 md:pr-10">          
            <DealsTable />          
          </div>
          <div className="text-lg border-gray-400/30 border-l px-10 md:basis-1/4">
            <DealsFilter />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;