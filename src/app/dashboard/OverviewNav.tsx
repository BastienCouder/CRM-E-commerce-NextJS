"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from "./Analytics";
import Overview from "./Overview";
import Newsletter from "./Newsletter";

interface OverviewNavProps {
  analyticsProductsData: any;
  analyticsOrdersData: any;
  analyticsWishlistCartOrderData: any;
  analyticsUsersData: any;
}

export default function OverviewNav({
  analyticsProductsData,
  analyticsOrdersData,
  analyticsUsersData,
  analyticsWishlistCartOrderData,
}: OverviewNavProps) {
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
            <Overview
              analyticsProductsData={analyticsProductsData}
              analyticsOrdersData={analyticsOrdersData}
              analyticsWishlistCartOrderData={analyticsWishlistCartOrderData}
              analyticsUsersData={analyticsUsersData}
            />
          </TabsContent>
          <TabsContent value="analytics">
            <Analytics
              analyticsProductsData={analyticsProductsData}
              analyticsOrdersData={analyticsOrdersData}
              analyticsWishlistCartOrderData={analyticsWishlistCartOrderData}
            />
          </TabsContent>
          <TabsContent value="reports">
            <Newsletter analyticsUsersData={analyticsUsersData} />
          </TabsContent>
          <TabsContent value="notifications">
            <div>Notifications Content</div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
