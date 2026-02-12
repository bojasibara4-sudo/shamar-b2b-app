import Link from 'next/link';
import { FileText, MessageSquare, Shield, Package, Truck, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Comment ça marche — Sourcing Chine',
  description: 'Étapes : Demande devis, Négociation, Escrow, Production, Livraison Afrique.',
};

const STEPS = [
  {
    icon: FileText,
    title: '1. Demande de devis',
    desc: 'Décrivez votre produit, quantité, budget et pays de destination. Vous pouvez cibler un fournisseur ou lancer une demande ouverte. Les fournisseurs vérifiés vous répondent avec des offres (FOB, CIF, EXW).',
  },
  {
    icon: MessageSquare,
    title: '2. Négociation',
    desc: 'Comparez les offres, posez des questions et négociez prix et conditions. Échangez des fichiers (spécifications, échantillons). Une fois l\'offre acceptée, vous passez à la commande.',
  },
  {
    icon: Shield,
    title: '3. Escrow',
    desc: 'Le paiement est déposé sur un compte sécurisé (escrow). Les fonds ne sont débloqués qu\'après réception et confirmation de la marchandise. En cas de litige, notre équipe arbitre.',
  },
  {
    icon: Package,
    title: '4. Production',
    desc: 'Le fournisseur lance la production. Vous pouvez suivre l\'avancement et les documents (contrat, facture proforma). Les délais sont définis dans l\'offre.',
  },
  {
    icon: Truck,
    title: '5. Livraison Afrique',
    desc: 'Expédition maritime ou aérienne jusqu\'à votre port ou entrepôt. Suivi du transporteur, numéro de conteneur, ETA. À réception, vous confirmez et l\'escrow libère les fonds au fournisseur.',
  },
];

export default function ChinaHowItWorksPage() {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div>
            <Link href="/china" className="text-shamar-small text-gray-500 hover:text-primary-600 font-medium mb-shamar-16 inline-block">
              ← Retour Sourcing Chine
            </Link>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Comment ça marche</h1>
            <p className="text-shamar-body text-gray-500 mt-1">De la demande de devis à la livraison en Afrique : les étapes du sourcing Chine.</p>
          </div>

          <div className="space-y-shamar-32">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft flex flex-col sm:flex-row gap-shamar-24"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-shamar-md bg-primary-100 text-primary-600 flex items-center justify-center">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-shamar-h3 text-gray-900 mb-2">{step.title}</h2>
                    <p className="text-shamar-body text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft text-center">
            <CheckCircle className="h-12 w-12 text-primary-600 mx-auto mb-shamar-16" />
            <h2 className="text-shamar-h2 text-gray-900 mb-2">Prêt à démarrer ?</h2>
            <p className="text-shamar-body text-gray-500 mb-shamar-24">Créez un compte et déposez votre première demande de devis.</p>
            <div className="flex flex-wrap justify-center gap-shamar-16">
              <Link href="/auth/register" className="px-shamar-32 py-shamar-12 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700">
                Créer un compte
              </Link>
              <Link href="/china/suppliers" className="px-shamar-32 py-shamar-12 border border-gray-200 text-gray-700 font-semibold rounded-shamar-md hover:bg-gray-50">
                Voir les fournisseurs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
