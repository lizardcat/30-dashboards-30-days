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

    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(
                    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
                );
                const data = await res.json();
                setCoins(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

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
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="text-center py-4">Loading. . .</td>
                            </tr>
                        ) : (
                            coins.map((coin) => (
                                <tr key={coin.id} className="border-b">
                                    <td className="py-2 flex items-center gap-2">
                                        <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                                        {coin.name}
                                    </td>
                                    <td>${coin.current_price.toLocaleString()}</td>
                                    <td className={coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}>
                                        {coin.price_change_percentage_24h.toFixed(2)}%
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}