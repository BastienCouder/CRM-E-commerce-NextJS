import { getDictionary } from "@/app/lang/dictionaries";
import website from "@/lib/data/infosWebsite";
import { Metadata } from "next";

export async function generateMetadata({
  params: { lang },
}: RefundPolicyProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.refund_title} - ${website.name}`,
    description: `${dict.metadata.refund_metadescription}`,
  };
}

interface RefundPolicyProps {
  params: {
    lang: string;
  };
}

export default async function RefundPolicy({
  params: { lang },
}: RefundPolicyProps) {
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Politique de Remboursement</h1>
        <p>
          La présente politique de remboursement définit les conditions dans
          lesquelles [Votre Entreprise] accorde des remboursements pour les
          produits ou services achetés sur ce site. Nous nous engageons à
          fournir un service de haute qualité à nos clients, mais comprenons
          qu&apos;il peut y avoir des situations où un remboursement est
          nécessaire.
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold mt-4">
          Conditions générales de remboursement
        </h2>
        <p>
          Pour être admissible à un remboursement, les conditions suivantes
          doivent être remplies :
        </p>
        <ul>
          <li>
            La demande de remboursement doit être faite dans les [Nombre de
            jours] jours suivant l&apos;achat du produit ou du service.
          </li>
          <li>
            Le produit ou le service ne doit pas avoir été utilisé ou consommé.
          </li>
          <li>
            Tous les éléments d&apos;accompagnement, les accessoires et
            l&apos;emballage d&apos;origine doivent être retournés en bon état.
          </li>
          <li>
            Le remboursement n&apos;est généralement pas possible pour les
            produits numériques ou les services personnalisés, sauf en cas de
            défaut ou de non-conformité.
          </li>
        </ul>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold mt-4">
          Procédure de demande de remboursement
        </h2>
        <p>
          Si vous remplissez les conditions de remboursement, veuillez suivre
          ces étapes pour demander un remboursement :
        </p>
        <ol>
          <li>
            Envoyez un e-mail à notre service client à l&apos;adresse [Adresse
            E-mail du Service Client] en précisant la raison de votre demande de
            remboursement.
          </li>
          <li>
            Notre équipe du service client examinera votre demande et vous
            fournira des instructions supplémentaires si nécessaire.
          </li>
          <li>
            Une fois votre demande approuvée, nous vous informerons de la
            procédure de retour ou de remboursement, selon le cas.
          </li>
          <li>
            Le remboursement sera traité dans un délai de [Nombre de jours]
            jours ouvrables à compter de la réception des articles retournés ou
            de la confirmation du remboursement.
          </li>
        </ol>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold mt-4">Contact</h2>
        <p>
          Si vous avez des questions ou des préoccupations concernant notre
          politique de remboursement, veuillez nous contacter à [Adresse E-mail
          du Service Client].
        </p>
      </div>
    </div>
  );
}
