'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import SellerOnboardingStepper from '@/components/seller/SellerOnboardingStepper';
import ShopForm from '@/components/seller/ShopForm';
import DocumentUploader from '@/components/seller/DocumentUploader';
import SellerStatusBadge from '@/components/seller/SellerStatusBadge';
import { getVendorStatusDetails } from '@/services/vendorStatus.service';

export default function SellerOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'shop' | 'documents' | 'validation'>('shop');
  const [shop, setShop] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [statusDetails, setStatusDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Récupérer la boutique
      const shopRes = await fetch('/api/seller/shop');
      if (shopRes.ok) {
        const shopData = await shopRes.json();
        setShop(shopData.shop);
        if (shopData.shop) {
          setCurrentStep(shopData.shop.status === 'verified' ? 'validation' : 'documents');
        }
      }

      // Récupérer les documents
      const docsRes = await fetch('/api/seller/documents');
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.documents || []);
      }

      // Récupérer le statut
      // Note: getVendorStatusDetails nécessite un user_id côté serveur
      // Pour l'instant, on récupère le statut via l'API shop

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleShopSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      setError('');

      const url = shop ? '/api/seller/shop/update' : '/api/seller/shop/create';
      const method = shop ? 'PUT' : 'POST';
      const body = shop ? { id: shop.id, ...data } : data;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      setShop(result.shop);
      setCurrentStep('documents');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentUpload = async (file: File, type: string) => {
    try {
      setSubmitting(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/seller/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }

      await loadData();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitForVerification = async () => {
    try {
      setSubmitting(true);
      setError('');

      if (!shop) {
        throw new Error('Boutique non trouvée');
      }

      const response = await fetch('/api/seller/shop/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: shop.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la soumission');
      }

      await loadData();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: 'shop' as const, label: 'Boutique', description: 'Créez votre boutique' },
    { id: 'documents' as const, label: 'Documents', description: 'Uploadez vos documents' },
    { id: 'validation' as const, label: 'Validation', description: 'En attente de validation' },
  ];

  const completedSteps: ('shop' | 'documents' | 'validation')[] = [];
  if (shop && shop.status !== 'draft') completedSteps.push('shop');
  if (documents.length > 0) completedSteps.push('documents');
  if (shop && shop.status === 'verified') completedSteps.push('validation');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Onboarding Vendeur</h1>
            <p className="mt-2 text-gray-600">Complétez votre profil pour commencer à vendre</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <SellerOnboardingStepper
          currentStep={currentStep}
          steps={steps}
          completedSteps={completedSteps}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {currentStep === 'shop' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de la boutique</h2>
            <ShopForm
              initialData={shop ? { name: shop.name, description: shop.description || '', category: shop.category || '', country: shop.country || '' } : undefined}
              onSubmit={handleShopSubmit}
              isLoading={submitting}
              error={error}
            />
          </div>
        )}

        {currentStep === 'documents' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents KYC</h2>
            <DocumentUploader
              documents={documents}
              onUpload={handleDocumentUpload}
              isLoading={submitting}
            />
            {shop && shop.status === 'draft' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmitForVerification}
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {submitting ? 'Soumission...' : 'Soumettre pour validation'}
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'validation' && (
          <div className="text-center py-8">
            <div className="mb-4">
              {shop?.status === 'verified' ? (
                <SellerStatusBadge status="verified" size="lg" />
              ) : (
                <SellerStatusBadge status="pending" size="lg" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {shop?.status === 'verified' ? 'Boutique vérifiée !' : 'En attente de validation'}
            </h2>
            <p className="text-gray-600">
              {shop?.status === 'verified'
                ? 'Votre boutique est vérifiée. Vous pouvez maintenant publier des produits.'
                : 'Votre demande est en cours d\'examen par notre équipe.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
