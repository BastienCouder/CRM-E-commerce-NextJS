"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from "./Analytics";

interface OverviewProps {
  analyticsProductsData: any;
  analyticsOrdersData: any;
}

export default function Overview({
  analyticsProductsData,
  analyticsOrdersData,
}: OverviewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex space-y-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger
              onClick={() => handleTabChange("overview")}
              value="overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              onClick={() => handleTabChange("analytics")}
              value="analytics"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              onClick={() => handleTabChange("reports")}
              value="reports"
            >
              Newsletter
            </TabsTrigger>
            <TabsTrigger
              onClick={() => handleTabChange("notifications")}
              value="notifications"
            >
              other
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div>Overview Content</div>
          </TabsContent>
          <TabsContent value="analytics">
            <Analytics
              analyticsProductsData={analyticsProductsData}
              analyticsOrdersData={analyticsOrdersData}
            />
          </TabsContent>
          <TabsContent value="reports">
            <div>Reports Content</div>
          </TabsContent>
          <TabsContent value="notifications">
            <div>Notifications Content</div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
