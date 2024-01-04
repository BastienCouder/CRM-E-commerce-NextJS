import { Metadata } from "next";
import StatsCard from "@/components/dashboard/StatsCard";
import { readAnalyticsNewsletterAnalytics } from "@/app/dashboard/analytics/actions/analytics-users";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { z } from "zod";
import { getUsersNewsletter } from "@/lib/db/user";
import { UserSchema } from "@/schemas/DbSchema";
import { Separator } from "@/components/ui/separator";
import { columns } from "./data/Colums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewsletterChart from "@/components/charts/newsletter-chart";
import { SelectCron } from "@/components/dashboard/select-cron";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

async function getfetchUsers() {
  try {
    const data = await getUsersNewsletter();
    if (Array.isArray(data)) {
      return z.array(UserSchema).parse(data);
    } else {
      console.error("Erreur: Les données ne sont pas un tableau.");
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }
}
export default async function NewsletterPage() {
  const analyticsNewsletterData = await readAnalyticsNewsletterAnalytics();

  const users = await getfetchUsers();

  return (
    <>
      <section className="flex-1">
        <div className="flex h-full gap-x-4">
          <div>
            <StatsCard
              title="Utilisateurs inscris à la newsletter"
              data={analyticsNewsletterData}
              value={analyticsNewsletterData.totalNewsletterSubscribersCount}
              secondaryText={`${analyticsNewsletterData.monthlyGrowthPercentage}`}
              type="nbr"
              variant="trening"
            />
          </div>
          <div className="flex flex-col w-full h-[9rem] bg-card rounded-t-lg p-4 gap-y-4">
            <div className="flex gap-x-4">
              <Button variant={"outline"}>
                Acceder au tableau de bord marketing
              </Button>
            </div>
            <Separator />
          </div>
        </div>
        <div className="w-full h-full bg-card rounded-lg rounded-tr-none p-4">
          <SelectCron />
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Gérer les contacts</TabsTrigger>
              <TabsTrigger value="views">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <DataTable
                data={users as any}
                columns={columns}
                variant="newsletter"
              />
            </TabsContent>
            <TabsContent value="views">
              <NewsletterChart />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
