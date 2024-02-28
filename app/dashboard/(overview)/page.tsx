import { CardWrapper } from '@/app/ui/cards';
import { lusitana } from '@/app/ui/fonts';
import { fetchSessionUser } from '@/app/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import { Connection, User } from '@/app/lib/definitions';
import ConnectRutter from '@/app/ui/dashboard/rutter';
import { fetchConnection, getConnectionStatusFromRutter } from '@/app/lib/rutterBackend';

export default async function Page() {
  const user = await fetchSessionUser();
  const connection = await fetchConnection();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="flex gap-6 mb-6">
        
        <div className="flex-1 rounded-lg bg-gray-50 p-4">
        <p>Welcome {(user as User).FirstName} { (user as User).LastName }</p>
        <br></br>
          {connection==null?<ConnectRutter/>: <p className='text-green-500'>Accounting System Connected</p>}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {connection!=null?
          <Suspense fallback={<CardsSkeleton/>}>
          <CardWrapper connection={connection as Connection}/>
        </Suspense>:<></>
        }
      </div>
      {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div> */}
    </main>
  );
}