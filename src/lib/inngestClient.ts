import website from "@/lib/data/infosWebsite";
import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngestClient = new Inngest({
  id: `${website.name}`,
  eventKey: process.env.INNGEST_EVENT_KEY,
});
