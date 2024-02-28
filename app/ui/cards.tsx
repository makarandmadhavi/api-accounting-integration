import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { BalanceSheet, Connection, IncomeStatement } from '@/app/lib/definitions';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export const CardWrapper = async function CardWrapper({
  connection,
}: {
  connection: Connection | null;
}) {

  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}
      {connection != null ?
        <><Card title="Accounting System" value={connection.platform} type="collected" />
          <Card
            title="Status"
            value={connection.is_ready ? 'Ready' : 'Not Ready'}
            type="customers" /></> : null}
    </>
  );
}

export const AggregateIncomeCard = async function AggregateIncomeCard({
  income_statements,
}: {
  income_statements: IncomeStatement[];
}) {
  const average_monthly_income = (income_statements.reduce(
    (acc, statement) => acc + Number(statement.total_income),
    0
  ) / income_statements.length).toFixed(2);
  const average_monthly_expenses = (income_statements.reduce(
    (acc, statement) => acc + Number(statement.total_expenses),
    0
  ) / income_statements.length).toFixed(2);
  const average_monthly_cost_of_sales = (income_statements.reduce(
    (acc, statement) => acc + Number(statement.total_cost_of_sales),
    0
  ) / income_statements.length).toFixed(2);
  const average_monthly_sales = (income_statements.reduce(
    (acc, statement) => acc + Number(statement.net_sales),
    0
  ) / income_statements.length).toFixed(2);
  const average_monthly_profit = (income_statements.reduce(
    (acc, statement) => acc + Number(statement.net_profit),
    0
  ) / income_statements.length).toFixed(2);

  return (
    <>
      <Card title="Income" value={'$ ' + average_monthly_income} type="collected" />
      <Card title="Expenses" value={'$ ' + average_monthly_expenses} type="customers" />
      <Card title="Cost of Sales" value={'$ ' + average_monthly_cost_of_sales} type="pending" />
      <Card title="Sales" value={'$ ' + average_monthly_sales} type="invoices" />
      <Card title="Profit" value={'$ ' + average_monthly_profit} type="collected" />
    </>);
}

export function AggregateBalanceCard({
  balance_sheets,
}: {
  balance_sheets: BalanceSheet[];
}) {
  const average_monthly_assets = (balance_sheets.reduce(
    (acc, statement) => acc + Number(statement.total_assets),
    0
  ) / balance_sheets.length).toFixed(2);
  const average_monthly_liabilities = (balance_sheets.reduce(
    (acc, statement) => acc + Number(statement.total_liabilities),
    0
  ) / balance_sheets.length).toFixed(2);
  const average_monthly_equity = (balance_sheets.reduce(
    (acc, statement) => acc + Number(statement.total_equity),
    0
  ) / balance_sheets.length).toFixed(2);

  return (
    <>
      <Card title="Assets" value={'$ ' + average_monthly_assets} type="collected" />
      <Card title="Liabilities" value={'$ ' + average_monthly_liabilities} type="customers" />
      <Card title="Equity" value={'$ ' + average_monthly_equity} type="pending" />
    </>);
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
