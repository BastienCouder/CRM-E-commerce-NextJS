"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import formatPrice from "@/helpers/format";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  AnalyticsOrdersData,
  readAnalyticsOrders,
  readAnalyticsOrdersProps,
} from "@/app/dashboard/management/orders/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilteredAnalyticsData } from "@/hooks/useFilteredAnalyticsData";
import { DateRangePicker } from "../dashboard/DateRangePicker";

interface SalesChartProps {
  analyticsData: readAnalyticsOrdersProps;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: AnalyticsOrdersData }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const { date, subtotal } = payload[0].payload;

  return (
    <div className="p-3 text-background text-sm bg-foreground rounded-lg">
      <p className="font-bold">{date}</p>
      <p>
        {subtotal ? `Total ${formatPrice(subtotal, "EUR")}` : "Aucune ventes"}
      </p>
    </div>
  );
};

const axisStyle = { fontSize: "0.8rem", fill: "#f5f5f5" };

export default function SalesChart({ analyticsData }: SalesChartProps) {
  const { currentMonthSubtotal, subtotalDifferencePercent } = analyticsData;

  const number = subtotalDifferencePercent;
  const isPositive = !isNaN(number) && number >= 0;
  const formattedsubtotalDifferencePercent = !isNaN(number)
    ? `${isPositive ? "+" : ""}${number.toFixed(2)}%`
    : subtotalDifferencePercent;
  const IconComponent = isPositive ? ArrowUpCircle : ArrowDownCircle;

  const [fetchData, timeRange, setTimeRange, options] =
    useFilteredAnalyticsData<readAnalyticsOrdersProps>(readAnalyticsOrders);
  const chartData = fetchData ? fetchData.data : [];

  return (
    <>
      <section className="w-[50rem] h-[28rem] p-4 rounded-lg bg-card pb-32">
        <div className="w-full flex justify-between mb-2">
          <div className="flex flex-col">
            <h2 className="mb-2">Total des revenus</h2>
            <div>
              <p className="w-24 bg-background py-1 px-2 flex flex-col text-xs justify-end rounded-lg">
                <span
                  className={`flex items-center gap-x-1 font-bold text-chart`}
                >
                  {!isNaN(number) && <IconComponent size={13} />}
                  {formattedsubtotalDifferencePercent}
                </span>
              </p>
              <p className="text-xs text-chart mt-1">
                {isPositive ? "+" : ""}{" "}
                {formatPrice(currentMonthSubtotal, "EUR")} depuis le dernier
                mois
              </p>
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-end">
            {/* <DateRangePicker setDateRange={setTimeRange} /> */}
            <Select onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] rounded-lg border-none">
                <SelectValue placeholder={timeRange} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator className="bg-[rgba(var(--foreground),0.5)]" />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} className="mt-4">
            <XAxis
              dataKey="date"
              style={axisStyle}
              tickLine={false}
              axisLine={{ stroke: "rgb(var(--foreground))" }}
              strokeDasharray="3 3"
            />
            <YAxis
              scale="linear"
              tickLine={false}
              style={axisStyle}
              tickFormatter={(value) => formatPrice(value, "EUR")}
              axisLine={{ stroke: "rgb(var(--foreground))" }}
              strokeDasharray="3 3"
              allowDuplicatedCategory={false}
            />
            <Tooltip
              cursor={{ fill: "rgb(var(--muted))" }}
              formatter={formatPrice}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="subtotal"
              fill="rgb(var(--chart))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </>
  );
}
