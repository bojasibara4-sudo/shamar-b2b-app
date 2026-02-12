'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import SellerOnboardingStepper from '@/components/seller/SellerOnboardingStepper';
import ShopForm from '@/components/seller/ShopForm';
import DocumentUploader from '@/components/seller/DocumentUploader';
import SellerStatusBadge from '@/components/seller/SellerStatusBadge';

export default function SellerOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<'shop' | 'documents' | 'validation'>('shop');
  const [shop, setShop] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const step = searchParams?.get('step');
    if (step === 'documents' || step === 'validation') setCurrentStep(step);
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const shopRes = await fetch('/api/seller/shop');
      if (shopRes.ok) {
        const shopData = await shopRes.json();
        setShop(shopData.shop);
        if (shopData.shop) {
          setCurrentStep(shopData.shop.status === 'verified' ? 'validation' : 'documents');
        }
      }

      const docsRes = await fetch('/api/seller/documents');
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.documents || []);
      }

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
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <div className="text-center py-shamar-48 text-gray-500 text-shamar-body">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Onboarding <span className="text-primary-600">Vendeur</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">Complétez votre profil pour commencer à vendre</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
          <SellerOnboardingStepper
            currentStep={currentStep}
            steps={steps}
            completedSteps={completedSteps}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-shamar-md p-shamar-24 text-red-700">
            <p className="font-semibold text-shamar-body mb-1">Erreur</p>
            <p className="font-medium text-shamar-body">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
          {currentStep === 'shop' && (
            <div>
              <h2 className="text-shamar-h2 font-semibold text-gray-900 mb-shamar-24">Informations de la boutique</h2>
              <ShopForm
                initialData={shop ? { name: shop.name, description: shop.description || '', category: shop.category || '', country: shop.country || '', city: shop.city || '', region: shop.region || '' } : undefined}
                onSubmit={handleShopSubmit}
                isLoading={submitting}
                error={error}
              />
            </div>
          )}

          {currentStep === 'documents' && (
            <div>
              <h2 className="text-shamar-h2 font-semibold text-gray-900 mb-shamar-24">Documents KYC</h2>
              <DocumentUploader
                documents={documents}
                onUpload={handleDocumentUpload}
                isLoading={submitting}
              />
              {shop && shop.status === 'draft' && (
                <div className="mt-shamar-24 pt-shamar-24 border-t border-gray-200">
                  <button
                    onClick={handleSubmitForVerification}
                    disabled={submitting}
                    className="w-full px-shamar-24 py-shamar-16 bg-primary-600 text-gray-0 rounded-shamar-md hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {submitting ? 'Soumission...' : 'Soumettre pour validation'}
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'validation' && (
            <div className="text-center py-shamar-48">
              <div className="mb-shamar-24">
                {shop?.status === 'verified' ? (
                  <SellerStatusBadge status="verified" size="lg" />
                ) : (
                  <SellerStatusBadge status="pending" size="lg" />
                )}
              </div>
              <h2 className="text-shamar-h2 font-semibold text-gray-900 mb-3">
                {shop?.status === 'verified' ? 'Boutique vérifiée !' : 'En attente de validation'}
              </h2>
              <p className="text-shamar-body text-gray-500 font-medium max-w-md mx-auto">
                {shop?.status === 'verified'
                  ? 'Votre boutique est vérifiée. Vous pouvez maintenant publier des produits.'
                  : 'Votre demande est en cours d\'examen par notre équipe.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
