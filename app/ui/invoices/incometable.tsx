import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchIncomeStatements, getIncomeStatementsFromRutter } from '@/app/lib/rutterBackend';

export default async function IncomeTable({
  query,
  currentPage,
  statements,
}: {
  query: string;
  currentPage: number;
  statements: any;
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Currency
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Net Income
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Net Sales
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Net Profit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {statements?.map((statement: any) => (
                <tr
                  key={statement.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{formatDateToLocal(statement.start_date)} - {formatDateToLocal(statement.end_date)}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {statement.currency_code || 'USD'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {statement.net_income? statement.net_income: '0'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {statement.net_sales? statement.net_sales: '0'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {statement.net_profit? statement.net_profit: '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
