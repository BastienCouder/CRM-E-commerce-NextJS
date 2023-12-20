import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from "../../app/dashboard/Analytics";
import Overview from "../../app/dashboard/Overview";
import Newsletter from "../../app/dashboard/Newsletter";

interface AnalyticsNavProps {
  analyticsProductsData: any;
  analyticsOrdersData: any;
  analyticsWishlistCartOrderData: any;
  analyticsUsersData: any;
}

export default function AnalyticsNav({
  analyticsProductsData,
  analyticsOrdersData,
  analyticsUsersData,
  analyticsWishlistCartOrderData,
}: AnalyticsNavProps) {
  return (
    <>
      <div className="flex space-y-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="views">Views</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="views">
            <Overview
              {...{
                analyticsProductsData,
                analyticsOrdersData,
                analyticsWishlistCartOrderData,
                analyticsUsersData,
              }}
            />
          </TabsContent>
          <TabsContent value="products">
            <Analytics
              {...{
                analyticsProductsData,
                analyticsOrdersData,
                analyticsWishlistCartOrderData,
              }}
            />
          </TabsContent>
          <TabsContent value="users">
            <Newsletter analyticsUsersData={analyticsUsersData} />
          </TabsContent>
          <TabsContent value="orders">
            <div>Notifications Content</div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
