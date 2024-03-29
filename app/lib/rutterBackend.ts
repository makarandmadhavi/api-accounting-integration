"use server";
import prisma from "@/app/lib/prisma";
import { auth } from '@/auth';
import {
    CustomerField,
    CustomersTableType,
    InvoiceForm,
    InvoicesTable,
    LatestInvoiceRaw,
    User,
    Revenue,
    Connection,
    IncomeStatement,
    BalanceSheet,
} from './definitions';
import { formatCurrency, getCurrentDateISO, getDateThreeYearsAgoISO } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from "zod";
import { stat } from "fs";

const ENV_URL = process.env.RUTTER_URL || "sandbox.rutterapi.com";
const CLIENT_ID = process.env.RUTTER_CLIENT_ID || "RUTTER_CLIENT_ID";
const SECRET = process.env.RUTTER_SECRET || "RUTTER_SECRET";

export async function fetchSessionUser() {
    const session = await auth();

    return session?.user as User ?? {} as User;
}

export async function rutterExchange(public_token: String) {
    noStore();
    try {
        const response = await axios.post(
            `https://${ENV_URL}/item/public_token/exchange`,
            {
                client_id: CLIENT_ID,
                public_token: public_token,
                secret: SECRET,
            }
        );
        const {
            data: { access_token, platform, is_ready},
        } = response;
        // Respond with the access-token
        return { access_token, platform, is_ready };
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function createConnection(public_token: String) {
    noStore();
    const user = await fetchSessionUser();
    const rutterData = await rutterExchange(public_token);
    if(!rutterData) {
        return null;
    }
    try {
        const connection = await prisma.connection.create({
            data: {
                platform: rutterData.platform,
                access_token: rutterData.access_token,
                is_ready: rutterData.is_ready,
                email: user.EmailAddress, // Fix: Access the EmailAddress property using optional chaining
            },
        });
        revalidatePath('/dashboard');
        redirect('/dashboard');
        return connection;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function fetchConnection() {
    noStore();
    const user = await fetchSessionUser();
    const connection = await prisma.connection.findFirst({
        where: {
            email: user.EmailAddress, // Fix: Access the EmailAddress property using optional chaining
        },
    });
    return connection? connection as Connection : null;
}

export async function getConnectionStatusFromRutter() {
    const connection = await fetchConnection();
    const access_token = connection?.access_token;
    try {
        const response = await axios.get(
            `https://${ENV_URL}/versioned/connections/status`,
            {
                headers: {
                    "x-rutter-version": '2023-03-14'
                },
                params: {
                    access_token: access_token,
                },
                auth: {
                    username: CLIENT_ID,
                    password: SECRET,
                },
            }
        );
        const { status } = response.data;
        updateConnectionStatus(access_token!, status.is_ready); // Fix: Use optional chaining to ensure access_token is defined
        return status;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function updateConnectionStatus(access_token: string, is_ready: boolean) {
    try{
        await prisma.connection.update({
            where: { access_token: access_token },
            data: { is_ready: is_ready },
        });
        console.log('Connection status updated');
    } catch (e) {
        console.error(e);
    }
}

export async function getIncomeStatementsFromRutter() {
    noStore();
    const connection = await fetchConnection();
    if(!connection) return null;
    const { access_token } = connection;
    try {
        const response = await axios.get(
            `https://${ENV_URL}/versioned/accounting/income_statements`,
            {
                headers: {
                    "x-rutter-version": '2023-03-14',
                },
                params: {
                    access_token: access_token,
                    "start_date": getDateThreeYearsAgoISO(),
                    "end_date": getCurrentDateISO(),
                },
                auth: {
                    username: CLIENT_ID,
                    password: SECRET,
                },
            }
        );
        const { income_statements } = response.data;
        return income_statements as IncomeStatement[];
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function fetchIncomeStatements() {
    noStore();
    const connection = await fetchConnection();
    if(!connection) return null;
    const { access_token } = connection;
    try {
        const statements: IncomeStatement[] = await prisma.IncomeStatement.findMany({
            where: {
                access_token: access_token,
            },
        });
        console.log(statements.length);
        if (statements.length === 0) {
            const income_statements = await getIncomeStatementsFromRutter();
            if (income_statements) {
                for (const statement of income_statements) {
                    console.log("Creating income statement");
                    const {
                        start_date,
                        end_date,
                        currency_code: currency_code,
                        net_income,
                        net_sales,
                        net_profit,
                        total_income,
                        total_expenses,
                        total_cost_of_sales
                    } = statement;

                    const parsedNetIncome = net_income ? parseFloat(net_income) : 0;
                    const parsedNetSales = net_sales ? parseFloat(net_sales) : 0;
                    const parsedNetProfit = net_profit ? parseFloat(net_profit) : 0;
                    const parsedTotalIncome = total_income ? parseFloat(total_income) : 0;
                    const parsedTotalExpenses = total_expenses ? parseFloat(total_expenses) : 0;
                    const parsedTotalCostOfSales = total_cost_of_sales ? parseFloat(total_cost_of_sales) : 0;

                    await prisma.IncomeStatement.create({
                        data: {
                            start_date,
                            end_date,
                            currency_code: currency_code,
                            net_income: parsedNetIncome,
                            net_sales: parsedNetSales,
                            net_profit: parsedNetProfit,
                            total_income: parsedTotalIncome,
                            total_expenses: parsedTotalExpenses,
                            total_cost_of_sales: parsedTotalCostOfSales,
                            access_token,
                        },
                    });
                    revalidatePath('/dashboard/income-statements');
                }
            }
        } else {
            console.log("Income statements already exist");
            return statements as IncomeStatement[];
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}


export async function getBalanceSheetsFromRutter() {
    noStore();
    const connection = await fetchConnection();
    if(!connection) return null;
    const { access_token } = connection;
    try {
        const response = await axios.get(
            `https://${ENV_URL}/versioned/accounting/balance_sheets`,
            {
                headers: {
                    "x-rutter-version": '2023-03-14',
                },
                params: {
                    access_token: access_token,
                    "start_date": getDateThreeYearsAgoISO(),
                    "end_date": getCurrentDateISO(),
                },
                auth: {
                    username: CLIENT_ID,
                    password: SECRET,
                },
            }
        );
        const { balance_sheets } = response.data;
        return balance_sheets as BalanceSheet[];
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function fetchBalanceSheets() {
    noStore();
    const connection = await fetchConnection();
    if (!connection) return null;
    const { access_token } = connection;
    try {
        const balance_sheets = await prisma.BalanceSheet.findMany({
            where: {
                access_token: access_token,
            },
        });
        console.log(balance_sheets.length);
        if (balance_sheets.length === 0) {
            const balance_sheets = await getBalanceSheetsFromRutter();
            if (balance_sheets) {
                for (const sheet of balance_sheets) {
                    console.log("Creating balance sheet");
                    const {
                        currency_code: currency_code,
                        total_assets,
                        total_liabilities,
                        total_equity,
                        start_date,
                        end_date,
                    } = sheet;

                    const parsedTotalAssets = total_assets ? parseFloat(total_assets) : null;
                    const parsedTotalLiabilities = total_liabilities ? parseFloat(total_liabilities) : null;
                    const parsedTotalEquity = total_equity ? parseFloat(total_equity) : null;

                    await prisma.BalanceSheet.create({
                        data: {
                            start_date,
                            end_date,
                            currency_code: currency_code,
                            total_assets: parsedTotalAssets,
                            total_liabilities: parsedTotalLiabilities,
                            total_equity: parsedTotalEquity,
                            access_token,
                        },
                    });
                    revalidatePath('/dashboard/balance-sheets');
                }
            }
        } else {
            console.log("Balance sheets already exist");
            return balance_sheets;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}