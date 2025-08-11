import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export function Dashboard03() {
    return (
        <div className="p-6">
            {/* Portfolio summary */}
            <section className="mb-6">
                <h1 className="text-2xl font-bold">Cryptocurrency Dashboard</h1>
                <div>Portfolio Value: --</div>
                <div>Profit/Loss: --</div>
            </section>

            {/* Chart */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold">Price History</h2>
                <div style={{ height: 300 }}>
                    {/* Recharts chart goes here*/}
                </div>
            </section>

            {/* Coin Table */}
            <section>
                <h2 className="text-xl font-semibold">Market Data</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Coin</th>
                            <th>Price</th>
                            <th>24h Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Rows from API will render here */}
                    </tbody>
                </table>
            </section>
        </div>
    );
}