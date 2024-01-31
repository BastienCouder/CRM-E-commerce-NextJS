"use client";

import {
  readAnalyticsNewsletter,
  readAnalyticsNewsletterProps,
} from "@/app/dashboard/analytics/actions/analytics-newsletter";
import { Separator } from "@/components/ui/separator";
import { useFilteredAnalyticsData } from "@/hooks/useFilteredAnalyticsData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  ComposedChart,
  Area,
} from "recharts";
import {
  determineFilterType,
  formatDateBasedOnFilter,
} from "@/lib/helpers/format";
import { useState } from "react";
import Spinner from "../spinner";

const defaultAnalyticsData: readAnalyticsNewsletterProps = {
  data: [],
  totalUsers: 0,
  totalNewsletterSubscribersCount: 0,
  thisMonthUsersCount: 0,
  lastMonthUsersCount: 0,
  monthlyGrowthPercentage: 0,
};

const axisStyle = { fontSize: "0.8rem", fill: "rgb(var(--foreground))" };

export default function NewsletterChart() {
  const initialRange = "week";
  const [fetchData, timeRange, setTimeRange, options, isLoading] =
    useFilteredAnalyticsData<readAnalyticsNewsletterProps>(
      readAnalyticsNewsletter,
      initialRange,
      defaultAnalyticsData
    );

  let filterType = determineFilterType(timeRange);

  const chartData = fetchData ? fetchData.data : [];

  return (
    <>
      <section className="border w-3/5 h-[25rem] p-4 rounded-lg bg-card pb-14">
        <div className="w-full flex justify-between mb-2">
          <div className="flex flex-col justify-between">
            <h2>
              {fetchData.totalUsers > 1
                ? "Nombre d'abonnés"
                : "Nombre d'abonné"}
            </h2>
          </div>
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
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator className="bg-[rgba(var(--foreground),0.5)]" />
        {!isLoading ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} className="mt-2">
              <XAxis
                dataKey="date"
                scale="band"
                tickLine={false}
                tickFormatter={(value) =>
                  formatDateBasedOnFilter(value, filterType)
                }
                axisLine={{ stroke: "rgb(var(--foreground))" }}
                style={axisStyle}
              />
              <YAxis
                scale="linear"
                tickLine={false}
                style={axisStyle}
                axisLine={{ stroke: "rgb(var(--foreground))" }}
              />
              <Area
                type="monotone"
                name="Nombres de nouveau abonnées"
                dataKey="newsletterSubscribersCount"
                fill="rgb(var(--chart))"
                stroke="none"
              />
            </ComposedChart>
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
