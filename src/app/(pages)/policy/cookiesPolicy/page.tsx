"use client";
export default function PrivatyPolicy() {
  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Politique de Cookies</h1>
          <p>
            Ce site web utilise des cookies pour améliorer l&apos;expérience de
            l&apos;utilisateur. En continuant à utiliser ce site, vous acceptez
            notre utilisation des cookies conformément à la présente politique.
          </p>

          <h2 className="text-xl font-bold mt-4">
            Qu&apos;est-ce qu&apos;un cookie ?
          </h2>
          <p>
            Un cookie est un petit fichier texte placé sur votre ordinateur ou
            appareil mobile lorsque vous visitez un site web. Les cookies sont
            largement utilisés pour faire fonctionner les sites web, ou les
            rendre plus efficaces, ainsi que pour fournir des informations aux
            propriétaires du site.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold mt-4">
            Comment utilisons-nous les cookies ?
          </h2>
          <p>Nous utilisons des cookies pour :</p>
          <ul>
            <li>Faciliter la navigation sur notre site.</li>
            <li>
              Recueillir des informations sur l&apos;utilisation de notre site
              pour améliorer l&apos;expérience de l&apos;utilisateur.
            </li>
            <li>
              Personnaliser le contenu et la publicité en fonction de vos
              intérêts.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold mt-4">
            Quels types de cookies utilisons-nous ?
          </h2>
          <p>Nous utilisons les types de cookies suivants :</p>
          <ul>
            <li>
              Cookies essentiels : Ils sont nécessaires au bon fonctionnement du
              site et ne peuvent pas être désactivés.
            </li>
            <li>
              Cookies de performance : Ils nous aident à analyser comment les
              visiteurs utilisent notre site, ce qui nous permet
              d&apos;améliorer la performance de nos pages.
            </li>
            <li>
              Cookies de ciblage : Ils sont utilisés pour afficher des
              publicités pertinentes pour les visiteurs en fonction de leurs
              intérêts.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold mt-4">
            Comment gérer les cookies ?
          </h2>
          <p>
            Vous pouvez gérer les cookies en ajustant les paramètres de votre
            navigateur. Vous pouvez généralement les configurer pour accepter,
            rejeter ou vous avertir lorsque des cookies sont utilisés. Chaque
            navigateur est différent, veuillez consulter le menu d&apos;aide de
            votre navigateur pour en savoir plus sur la manière de modifier vos
            préférences en matière de cookies.
          </p>

          <p>
            Si vous désactivez les cookies, cela peut affecter certaines
            fonctionnalités de notre site et de nombreux autres sites web que
            vous visitez.
          </p>
        </div>
      </div>
    </div>
  );
}
