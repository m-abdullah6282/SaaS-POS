import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import axiosInstance from '../api/axios';
import { formatPkr } from '../utils/currency';

const RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 days' },
  { value: '30days', label: 'Last 30 days' },
];

function ChangeBadge({ value }) {
  const isPositive = value >= 0;
  const prefix = value > 0 ? '+' : '';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
      isPositive
        ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300'
        : 'bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300'
    }`}>
      {prefix}{value}%
    </span>
  );
}

function KpiCard({ label, value, change, detail, accent }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-bold tracking-normal text-slate-900 dark:text-white sm:text-3xl">{value}</p>
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} aria-hidden="true" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <ChangeBadge value={change} />
        <span className="text-xs text-slate-500 dark:text-slate-400">{detail}</span>
      </div>
    </section>
  );
}

function SalesTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-xl dark:border-slate-700 dark:bg-slate-950">
      <p className="max-w-44 truncate text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-300">{payload[0].value} units sold</p>
    </div>
  );
}

function TopProducts({ products }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Top products</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Best performers in this period</p>
        </div>
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">Top 5</span>
      </div>
      <div className="mt-5 space-y-3">
        {products.length ? products.map((product, index) => (
          <div key={product.product_id || product.product_name} className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {index + 1}
            </span>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">{product.product_name}</p>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{product.units_sold}</span>
          </div>
        )) : (
          <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">No sales recorded for this period.</p>
        )}
      </div>
    </section>
  );
}

function LowStockWidget({ products }) {
  return (
    <aside className="rounded-xl border border-amber-400/20 bg-white p-5 shadow-sm shadow-slate-200/60 dark:border-amber-400/20 dark:bg-slate-900/80 dark:shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Low stock warning</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Products below 10 units</p>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">{products.length}</span>
      </div>
      <div className="mt-5 space-y-3">
        {products.length ? products.map((product) => (
          <div key={product.product_id} className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{product.product_name}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{formatPkr(product.price)}</p>
            </div>
            <span className="shrink-0 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">{product.stock} left</span>
          </div>
        )) : (
          <p className="py-8 text-center text-sm text-emerald-600 dark:text-emerald-300">Inventory levels look healthy.</p>
        )}
      </div>
      <Link to="/products" className="mt-5 inline-flex text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
        Review inventory
      </Link>
    </aside>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [range, setRange] = useState('today');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    axiosInstance
      .get('/orders/analytics/dashboard/', { params: { range } })
      .then((res) => {
        if (!active) return;
        setData(res.data);
        setError('');
      })
      .catch(() => active && setError('Unable to load analytics right now. Please try again.'))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [range]);

  const handleRangeChange = (event) => {
    setLoading(true);
    setError('');
    setRange(event.target.value);
  };

  const exportData = () => {
    if (!data) return;
    const rows = [
      ['Product', 'Units sold'],
      ...data.product_comparison.map((item) => [item.product_name, item.units_sold]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-analytics-${data.date_from}-to-${data.date_to}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-[#faf9f6] px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-slate-800 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Analytics overview</p>
            <h1 className="mt-1 text-3xl font-bold tracking-normal text-slate-900 dark:text-white">Sales dashboard</h1>
            {data && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{data.date_from} to {data.date_to}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Date range"
              value={range}
              onChange={handleRangeChange}
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {RANGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <Link to="/orders/new" className="inline-flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              + New Sale
            </Link>
            <button type="button" onClick={exportData} disabled={!data} className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              Export Data
            </button>
          </div>
        </header>

        {loading && !data && <div className="py-24 text-center text-sm text-slate-500 dark:text-slate-400">Loading analytics...</div>}
        {error && <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200">{error}</div>}

        {data && (
          <div className={`space-y-6 pt-6 ${loading ? 'opacity-60' : ''}`}>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard label="Total revenue" value={formatPkr(data.summary.total_revenue)} change={data.summary.revenue_change_percent} detail="vs previous period" accent="bg-indigo-400" />
              <KpiCard label="Total orders" value={data.summary.total_orders} change={data.summary.orders_change_percent} detail="vs previous period" accent="bg-indigo-500" />
              <KpiCard label="Units sold" value={data.summary.units_sold} change={data.summary.units_change_percent} detail="vs previous period" accent="bg-emerald-400" />
              <KpiCard label="Average order" value={formatPkr(data.summary.average_order_value)} change={data.summary.revenue_change_percent} detail="current period" accent="bg-fuchsia-400" />
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/20">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">Product sales comparison</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Units sold by product</p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Top 8 products</span>
                </div>
                <div className="mt-6 h-80 text-slate-500 dark:text-slate-400">
                  {data.product_comparison.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.product_comparison} margin={{ top: 8, right: 4, left: -20, bottom: 8 }}>
                        <defs>
                          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity={0.78} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.18} strokeDasharray="3 3" />
                        <XAxis dataKey="product_name" tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} interval={0} angle={-18} textAnchor="end" height={56} />
                        <YAxis allowDecimals={false} tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<SalesTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
                        <Bar dataKey="units_sold" radius={[6, 6, 0, 0]} fill="url(#salesGradient)" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">No product sales data for this period.</div>}
                </div>
              </div>
              <LowStockWidget products={data.low_stock_products} />
            </section>

            <TopProducts products={data.top_products} />
          </div>
        )}
      </div>
    </div>
  );
}
