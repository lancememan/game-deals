'use client'
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation"
import DealsTable from "@/components/ui/dealsTable";
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
        <div className="container mx-auto max-w-full w-[1020]">
          <Suspense fallback={<div>Loading...</div>}>
            <DealsTable />
          </Suspense>
        </div>
      </section>
      <Suspense fallback={<div>Loading...</div>}>
        <DealsFilter />
      </Suspense>
    </>
  );
};

export default Page;