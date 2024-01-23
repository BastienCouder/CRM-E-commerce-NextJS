"use client";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SoftDelete from "@/components/dashboard/soft-delete";
import DangerDelete from "@/components/dashboard/danger-delete";
import { statuses as statusesOrder } from "@/app/dashboard/(management)/orders/data/data";
import { statuses as statusesProduct } from "@/app/dashboard/(management)/products/data/data";
import { restoreItem } from "@/app/dashboard/(management)/action/restore";
import { softDeleteItem } from "@/app/dashboard/(management)/action/soft-delete";
import { DeleteItem } from "@/app/dashboard/(management)/action/delete";
import Restore from "./Restore";

interface SettingsFormProps<T> {
  itemId: string;
  item: T;
  updateStatus: (itemId: string, newStatus: string) => Promise<T>;
  type: "product" | "order";
  statusLabelFunction?: (status: string) => string;
}

function SettingsForm<
  T extends { id: string; status: string; deleteAt: Date | null }
>({
  itemId,
  item,
  updateStatus,
  type,
  statusLabelFunction,
}: SettingsFormProps<T>) {
  return (
    <>
      <Separator />
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-medium">
            {type === "product" ? "Disponibilité" : "Status"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {`Mettez à jour le status de ${
              type === "product" ? "votre produit" : "la commande"
            }.`}
          </p>
        </div>
        <Select
          onValueChange={async (newStatus) => {
            await updateStatus(item.id, newStatus);
          }}
          disabled={item.deleteAt !== null}
        >
          <SelectTrigger
            className="w-[180px]"
            disabled={item.status === "delete"}
          >
            <SelectValue
              placeholder={
                statusLabelFunction
                  ? statusLabelFunction(item.status)
                  : item.status
              }
            />
          </SelectTrigger>
          <SelectContent>
            {statusesOrder &&
              type === "order" &&
              statusesOrder
                .filter((status) => status.value !== "delete")
                .map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
            {statusesProduct &&
              type === "product" &&
              statusesProduct
                .filter((status) => status.value !== "delete")
                .map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>
      {item && item.deleteAt && (
        <>
          <Separator />
          <Restore itemId={item.id} RestoreItem={restoreItem} type="settings" />
        </>
      )}
      {item && !item.deleteAt && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-medium">
              {` Supprimez  ${
                type === "product" ? "votre produit" : "la commande"
              }`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {` Supprimez  ${
                type === "product" ? "votre produit" : "la commande"
              } en la gardant dans votre base de donnée.`}
            </p>
          </div>
          <SoftDelete
            itemId={itemId}
            SoftDelete={softDeleteItem}
            type="settings"
          />
        </>
      )}
      <Separator />
      <div>
        <h3 className="text-lg font-medium">
          {` Supprimez  ${
            type === "product" ? "votre produit" : "la commande"
          } de la base de donnée`}
        </h3>
        <p className="text-sm text-muted-foreground">
          {` Supprimez  ${
            type === "product" ? "votre produit" : "la commande"
          } de votre base de donnée. Attention cette
          action est irréversible.`}
        </p>
      </div>

      <DangerDelete itemId={itemId} Delete={DeleteItem} />
    </>
  );
}

export default SettingsForm;
