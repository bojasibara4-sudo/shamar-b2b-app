'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';

export type DocumentType = 'rccm' | 'id_fiscal' | 'registre_commerce' | 'autre';

interface Document {
  id: string;
  type: DocumentType;
  file_url: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
}

interface DocumentUploaderProps {
  documents: Document[];
  onUpload: (file: File, type: DocumentType) => Promise<void>;
  isLoading?: boolean;
}

const DOCUMENT_TYPES: Array<{ value: DocumentType; label: string; required: boolean }> = [
  { value: 'rccm', label: 'RCCM (Registre de Commerce)', required: true },
  { value: 'id_fiscal', label: 'Identifiant Fiscal', required: true },
  { value: 'registre_commerce', label: 'Registre de Commerce', required: false },
  { value: 'autre', label: 'Autre document', required: false },
];

const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function DocumentUploader({
  documents,
  onUpload,
  isLoading = false,
}: DocumentUploaderProps) {
  const [selectedType, setSelectedType] = useState<DocumentType>('rccm');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      setError('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    // Vérifier le type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Type de fichier non autorisé. Formats acceptés: PDF, JPEG, PNG');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setError('');
    try {
      await onUpload(selectedFile, selectedType);
      setSelectedFile(null);
      setSelectedType('rccm');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    }
  };

  const getDocumentByType = (type: DocumentType): Document | undefined => {
    return documents.find((doc) => doc.type === type);
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 size={20} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-600" />;
      case 'pending':
        return <Clock size={20} className="text-amber-600" />;
    }
  };

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      case 'pending':
        return 'En attente';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un document</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
              Type de document <span className="text-red-500">*</span>
            </label>
            <select
              id="documentType"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as DocumentType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} {type.required && '(requis)'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Fichier <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Upload size={18} />
                <span>Sélectionner un fichier</span>
              </button>
              {selectedFile && (
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Formats acceptés: PDF, JPEG, PNG (max 5MB)
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Upload en cours...' : 'Uploader le document'}
          </button>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes documents</h3>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-2 text-gray-300" />
            <p>Aucun document uploadé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {DOCUMENT_TYPES.map((type) => {
              const document = getDocumentByType(type.value);
              return (
                <div
                  key={type.value}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{type.label}</p>
                      {document && (
                        <p className="text-sm text-gray-500">
                          Uploadé le {new Date(document.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                      {document?.rejection_reason && (
                        <p className="text-sm text-red-600 mt-1">
                          Raison: {document.rejection_reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {document ? (
                      <>
                        {getStatusIcon(document.status)}
                        <span className="text-sm text-gray-600">{getStatusLabel(document.status)}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">Non uploadé</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
