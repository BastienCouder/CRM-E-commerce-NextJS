import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from "../../app/dashboard/Analytics";
import Overview from "../../app/dashboard/Overview";
import Newsletter from "../../app/dashboard/Newsletter";

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
  return (
    <>
      <div className="flex space-y-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Newsletter</TabsTrigger>
            <TabsTrigger value="notifications">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Overview
              {...{
                analyticsProductsData,
                analyticsOrdersData,
                analyticsWishlistCartOrderData,
                analyticsUsersData,
              }}
            />
          </TabsContent>
          <TabsContent value="analytics">
            <Analytics
              {...{
                analyticsProductsData,
                analyticsOrdersData,
                analyticsWishlistCartOrderData,
              }}
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
