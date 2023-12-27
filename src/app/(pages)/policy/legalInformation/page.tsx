import { getDictionary } from "@/app/lang/dictionaries";
import website from "@/lib/data/infosWebsite";
import { Metadata } from "next";

export async function generateMetadata({
  params: { lang },
}: LegalInformationProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.legal_information_title} - ${website.name}`,
    description: `${dict.metadata.legal_information_metadescription}`,
  };
}

interface LegalInformationProps {
  params: {
    lang: string;
  };
}

export default async function LegalInformation({
  params: { lang },
}: LegalInformationProps) {
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Mentions Légales</h1>
        <p>
          Le présent document a pour objet de définir les modalités et
          conditions dans lesquelles d&apos;une part, la société (ou
          l&apos;individu) ci-après dénommée l&apos;EDITEUR, met à la
          disposition de ses utilisateurs le site, et les services disponibles
          sur le site, et d&apos;autre part, comment l&apos;utilisateur accède
          au site et utilise ses services.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold mt-4">1. Informations légales</h2>
        <p>Raison sociale de l&apos;entreprise : [Votre Raison Sociale]</p>
        <p>Adresse : [Votre Adresse]</p>
        <p>Téléphone : [Votre Numéro de Téléphone]</p>
        <p>Adresse e-mail : [Votre Adresse E-mail]</p>
        <p>Numéro de TVA intracommunautaire : [Votre Numéro de TVA]</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold mt-4">2. Propriété intellectuelle</h2>
        <p>
          Le contenu du site, incluant mais non limité aux textes, images,
          vidéos, logos, marques, icônes et tout autre élément, est la propriété
          exclusive de l&apos;EDITEUR ou de tiers ayant autorisé l&apos;EDITEUR
          à les utiliser.
        </p>
        <p>
          Toute reproduction, distribution, modification, adaptation,
          retransmission ou publication, même partielle, de ces éléments est
          strictement interdite sans le consentement écrit de l&apos;EDITEUR.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold mt-4">3. Responsabilité</h2>
        <p>
          L&apos;EDITEUR ne saurait être tenu pour responsable des erreurs,
          omissions ou indisponibilités des informations et des services
          proposés sur le site. Les informations sont fournies à titre indicatif
          et sont susceptibles d&apos;être modifiées à tout moment.
        </p>
        <p>
          L&apos;EDITEUR ne saurait être tenu pour responsable des dommages
          directs ou indirects résultant de l&apos;accès ou de
          l&apos;utilisation du site et de ses services.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold mt-4">4. Liens hypertextes</h2>
        <p>
          Le site peut contenir des liens hypertextes vers d&apos;autres sites
          internet. L&apos;EDITEUR ne saurait être tenu pour responsable du
          contenu de ces sites et de l&apos;utilisation qui en est faite par les
          utilisateurs.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold mt-4">
          5. Loi applicable et juridiction
        </h2>
        <p>
          Les présentes mentions légales sont régies par la loi [La loi
          applicable dans votre pays]. Tout litige relatif à
          l&apos;interprétation ou à l&apos;exécution des présentes mentions
          légales est soumis à la compétence exclusive des tribunaux de [La
          juridiction compétente dans votre région].
        </p>
      </div>
    </div>
  );
}
