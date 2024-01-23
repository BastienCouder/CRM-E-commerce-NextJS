import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WhislistCartOrderLength from "../charts/WishlistCartOrderLength";
import TopProductsChart from "../charts/top-products-chart";

interface AnalyticsNavProps {
  analyticsProductsData: any;
  analyticsOrdersData: any;
  analyticsWishlistCartOrderData: any;
}

export default function AnalyticsNav({
  analyticsProductsData,
  analyticsWishlistCartOrderData,
}: AnalyticsNavProps) {
  return (
    <>
      <div className="flex space-y-4">
        <Tabs defaultValue="views" className="space-y-4">
          <TabsList>
            <TabsTrigger value="views">Views</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="views">hello</TabsContent>
          <TabsContent value="products">
            <WhislistCartOrderLength
              analyticsData={analyticsWishlistCartOrderData}
            />
            <TopProductsChart analyticsData={analyticsProductsData} />
          </TabsContent>
          <TabsContent value="users"></TabsContent>
          <TabsContent value="orders">
            <div>Notifications Content</div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
