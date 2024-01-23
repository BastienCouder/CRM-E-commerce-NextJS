import { Separator } from "@/components/ui/separator";
import { AppearanceForm } from "./AppearanceForm";

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Apparence</h3>
        <p className="text-sm text-muted-foreground">
          Personnaliser l&apos;apparence de l&apos;application. Basculer
          automatiquement entre les thèmes et la nuit.
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  );
}
