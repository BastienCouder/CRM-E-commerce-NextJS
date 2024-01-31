"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  PopoverContent,
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import formatPrice, {
  determineFilterType,
  formatDateBasedOnFilter,
} from "../../lib/helpers/format";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilteredAnalyticsData } from "@/hooks/useFilteredAnalyticsData";
import { DateRangePicker } from "../dashboard/date-range-picker";
import { MoreHorizontal } from "lucide-react";
import {
  AnalyticsOrdersData,
  readAnalyticsOrders,
  readAnalyticsOrdersProps,
} from "@/app/dashboard/analytics/actions/analytics-orders";
import Spinner from "../spinner";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: AnalyticsOrdersData }[];
  tickFormatter: any;
}

const defaultAnalyticsData: readAnalyticsOrdersProps = {
  data: [],
  maxSubtotal: 0,
  maxOrder: 0,
  currentMonthSubtotal: 0,
  currentMonthOrderCount: 0,
  subtotalDifferencePercent: 0,
  orderCountDifferencePercent: 0,
};

const CustomTooltip = ({
  active,
  payload,
  tickFormatter,
}: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;
  const { date, subtotal } = payload[0].payload;

  return (
    <div className="p-3 text-background text-sm bg-foreground rounded-lg">
      <p className="font-bold">{tickFormatter(date)}</p>
      <p>
        {subtotal ? `Total ${formatPrice(subtotal, "EUR")}` : "Aucune ventes"}
      </p>
    </div>
  );
};

const axisStyle = { fontSize: "0.8rem", fill: "rgb(var(--foreground))" };

export default function SalesChart() {
  const initialRange = "week";
  const [fetchData, timeRange, setTimeRange, options, isLoading] =
    useFilteredAnalyticsData<readAnalyticsOrdersProps>(
      readAnalyticsOrders,
      initialRange,
      defaultAnalyticsData
    );

  let filterType = determineFilterType(timeRange);
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    filterType = determineFilterType(range);
  };

  const chartData = fetchData ? fetchData.data : [];

  return (
    <>
      <section className="border w-2/3 h-[25rem] p-4 rounded-lg bg-card pb-32">
        <div className="w-full flex justify-between mb-2">
          <div className="flex flex-col justify-between">
            <h2>Total des revenus</h2>
            <Select onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue
                  placeholder={
                    typeof timeRange === "string" && initialRange === "week"
                      ? "Cette semaine"
                      : ""
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, index) => (
                  <SelectItem key={index} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <DateRangePicker
              setDateRange={(range) => setTimeRange(range)}
              onDateChange={handleDateRangeChange}
            />
            <Popover>
              <PopoverTrigger asChild>
                <button className="bg-background border py-px px-1 rounded-lg">
                  <MoreHorizontal />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto py-1.5 px-2 bg-background"
                align="end"
              >
                <p>exporter en pdf</p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Separator className="bg-[rgba(var(--foreground),0.5)]" />
        {!isLoading ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              barCategoryGap="20%"
              className="mt-4"
            >
              <XAxis
                dataKey="date"
                style={axisStyle}
                tickLine={false}
                tickFormatter={(value) =>
                  formatDateBasedOnFilter(value, filterType)
                }
                axisLine={{ stroke: "rgb(var(--foreground))" }}
              />
              <YAxis
                scale="linear"
                tickLine={false}
                style={axisStyle}
                tickFormatter={(value) => formatPrice(value, "EUR")}
                axisLine={{ stroke: "rgb(var(--foreground))" }}
                allowDuplicatedCategory={false}
              />
              <Tooltip
                cursor={{ fill: "rgb(var(--muted))" }}
                formatter={formatPrice}
                content={
                  <CustomTooltip
                    tickFormatter={(value: string) =>
                      formatDateBasedOnFilter(value, filterType)
                    }
                  />
                }
              />
              <Bar
                dataKey="subtotal"
                fill="rgb(var(--chart))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex justify-center items-center">
            <Spinner />
          </div>
        )}
      </section>
    </>
  );
}
