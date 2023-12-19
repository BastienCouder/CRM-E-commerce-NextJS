"use client";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Restore from "@/components/dashboard/Restore";
import {
  useServerDelete,
  useServerRestore,
  useServerSoftDelete,
} from "@/app/dashboard/actions";
import SoftDelete from "../../../components/SoftDelete";
import DangerDelete from "@/components/dashboard/DangerDelete";
import { Order } from "@/app/dashboard/lib/zod";
import { statuses } from "../../data/data";
import { handleStatusChange } from "@/lib/utils";

interface OrderSettingsFormProps {
  orderId: string;
  order: Order;
  UpdateStatus: (itemId: string, newStatus: string) => Promise<Order | null>;
}

export default function OrderSettingsForm({
  orderId,
  order,
  UpdateStatus,
}: OrderSettingsFormProps) {
  return (
    <>
      <Separator />
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-medium">Status</h3>
          <p className="text-sm text-muted-foreground">
            Mettez à jour le status de la commande.
          </p>
        </div>
        <Select
          onValueChange={async (newStatus) => {
            await UpdateStatus(order.id, newStatus);
          }}
          disabled={order.status === "delete"}
        >
          <SelectTrigger
            className="w-[180px]"
            disabled={order.status === "delete"}
          >
            <SelectValue placeholder={handleStatusChange(order.status!)} />
          </SelectTrigger>
          <SelectContent>
            {statuses &&
              statuses
                .filter((status) => status.value !== "delete")
                .map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>
      {order && order.deleteAt && (
        <>
          <Separator />
          <div className="space-y-2">
            <div>
              <h3 className="text-lg font-medium">Restorez la commande</h3>
              <p className="text-sm text-muted-foreground">
                Restorez la commande.
              </p>
            </div>
            <Restore
              itemId={order.id}
              RestoreItem={useServerRestore}
              type="settings"
            />
          </div>
        </>
      )}
      {order && !order.deleteAt && (
        <>
          <Separator />
          <div className="space-y-2">
            <div>
              <h3 className="text-lg font-medium">Supprimer la commande</h3>
              <p className="text-sm text-muted-foreground">
                Supprimez la commande en la gardant dans votre base de donnée.
              </p>
            </div>
            <SoftDelete
              itemId={orderId}
              SoftDelete={useServerSoftDelete}
              type="settings"
            />
          </div>
        </>
      )}
      <Separator />
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-medium">
            Supprimer la commande de la base de donnée
          </h3>
          <p className="text-sm text-muted-foreground">
            Supprimez la commande et de votre base de donnée. Attention cette
            action est irréversible.
          </p>
        </div>
        <DangerDelete itemId={orderId} Delete={useServerDelete} />
      </div>
    </>
  );
}
