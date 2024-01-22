"use client";

import { SelectCron } from "./select-cron";

export default function ConfCron() {
  return (
    <>
      <section className="flex w-full">
        <ul className="w-full gap-x-4 gap-y-2 flex flex-col">
          <h2>Emails</h2>
          <li>
            <SelectCron
              id="email-weekly-user-with-recent-cart"
              title="mail de relance de panier récents"
            />
          </li>
        </ul>
      </section>
    </>
  );
}
