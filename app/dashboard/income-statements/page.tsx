import IncomeTable from '@/app/ui/invoices/incometable';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchIncomeStatements, getIncomeStatementsFromRutter } from '@/app/lib/rutterBackend';

export const metadata: Metadata = {
  title: 'Income Statements',
};


export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const statements = await fetchIncomeStatements();
  return (
    <div className="w-full">
      {statements==null?
        <p className='text-red-500'>Connection Not Ready, please check back later to see Statements</p>:null
      }

      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Income Statements</h1>
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <IncomeTable query={query} currentPage={currentPage} statements={statements} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}