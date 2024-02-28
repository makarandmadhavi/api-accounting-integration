import IncomeTable from '@/app/ui/invoices/incometable';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchBalanceSheets, getBalanceSheetsFromRutter } from '@/app/lib/rutterBackend';
import BalanceTable from '@/app/ui/invoices/balancetable';
import { AggregateBalanceCard } from '@/app/ui/cards';

export const metadata: Metadata = {
  title: 'Balance Sheets',
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
  const statements = await fetchBalanceSheets();
  return (
    <div className="w-full">
      {statements==null?
        <p className='text-red-500'>Connection Not Ready, please check back later to see Statements</p>:null
      }

      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Balance Sheets</h1>
      </div>
      <p className='text-center'>Monthly Averages</p>
      <div className="mt-5 gap-6 flex w-full justify-center">
        
        {statements && <AggregateBalanceCard balance_sheets={statements} />}
      </div>
      <br></br>
      <p className='text-center'>Actuals</p>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <BalanceTable query={query} currentPage={currentPage} statements={statements} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}