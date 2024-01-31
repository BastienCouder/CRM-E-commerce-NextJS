import { getDictionary } from "@/lang/dictionaries";
import website from "@/lib/data/infosWebsite";
import { Metadata } from "next";

export async function generateMetadata({
  params: { lang },
}: PrivatyPolicyProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.privaty_policy_title} - ${website.name}`,
    description: `${dict.metadata.privaty_policy_metadescription}`,
  };
}

interface PrivatyPolicyProps {
  params: {
    lang: string;
  };
}

export default async function PrivatyPolicy({
  params: { lang },
}: PrivatyPolicyProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Politique de Confidentialité</h1>

          <p>
            Vous pouvez choisir de restreindre la collecte ou l&apos;utilisation
            de vos informations personnelles de la manière suivante :
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold mt-4">
            Collecte d&apos;informations
          </h2>
          <p>Nous pouvons collecter les informations suivantes :</p>
          <ul>
            <li>Nom et prénom</li>
            <li>Coordonnées, y compris adresse e-mail</li>
            <li>
              Autres informations pertinentes pour les enquêtes et/ou les offres
              client
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold mt-4">
            Utilisation des informations collectées
          </h2>
          <p>
            Nous avons besoin de ces informations pour comprendre vos besoins et
            vous fournir un meilleur service, et en particulier pour les raisons
            suivantes :
          </p>
          <ul>
            <li>Améliorer nos produits et services.</li>
            <li>
              Envoyer périodiquement des e-mails promotionnels sur de nouveaux
              produits, des offres spéciales ou d&apos;autres informations que
              nous pensons susceptibles de vous intéresser.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold mt-4">Sécurité</h2>
          <p>
            Nous nous engageons à assurer la sécurité de vos informations. Afin
            d&apos;empêcher tout accès non autorisé ou divulgation, nous avons
            mis en place des procédures physiques, électroniques et de gestion
            appropriées pour sauvegarder et sécuriser les informations que nous
            recueillons en ligne.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold mt-4">
            Contrôle de vos informations personnelles
          </h2>
          <p>
            Vous pouvez choisir de restreindre la collecte ou l&apos;utilisation
            de vos informations personnelles de la manière suivante :
          </p>
          <ul>
            <li>
              Lorsque vous êtes invité à remplir un formulaire sur le site,
              recherchez la case à cocher indiquant que vous ne souhaitez pas
              que vos informations soient utilisées à des fins de marketing
              direct.
            </li>
            <li>
              Si vous avez précédemment accepté que nous utilisions vos
              informations personnelles à des fins de marketing direct, vous
              pouvez changer d&apos;avis à tout moment en nous écrivant ou en
              nous envoyant un e-mail à [Votre Adresse E-mail].
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold mt-4">Cookies</h2>
          <p>
            Un cookie est un petit fichier qui demande la permission d&apos;être
            placé sur le disque dur de votre ordinateur. Une fois que vous êtes
            d&apos;accord, le fichier est ajouté et le cookie aide à analyser le
            trafic web ou vous permet de savoir quand vous visitez un site
            particulier. Les cookies permettent aux applications web de vous
            répondre en tant qu&apos;individu. L&apos;application web peut
            adapter ses opérations à vos besoins, goûts et aversions en
            recueillant et en mémorisant des informations sur vos préférences.
          </p>

          <p>
            Si vous souhaitez en savoir plus sur l&apos;utilisation des cookies
            sur ce site, veuillez consulter notre{" "}
            <a href="/politique-de-cookies">politique de cookies</a>.
          </p>
        </div>
      </div>
    </>
  );
}
