'use client';

import Link from 'next/link';
import { HelpCircle, MessageCircle, BookOpen, ArrowLeft } from 'lucide-react';

export default function AidePage() {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 py-shamar-24 lg:py-shamar-40">
        <div className="flex items-center gap-shamar-16 mb-shamar-32">
          <Link
            href="/"
            className="p-2 rounded-shamar-md hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Retour"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
              Centre d&apos;aide <span className="text-primary-600">SHAMAR</span>
            </h1>
            <p className="text-shamar-body text-gray-500 mt-1">
              FAQ, guides et support client
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-shamar-24">
          <Link
            href="/profile"
            className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium transition-all flex items-start gap-shamar-16 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            <div className="p-shamar-12 bg-primary-50 rounded-shamar-md">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-shamar-h4 text-gray-900">Guides & Documentation</h3>
              <p className="text-gray-500 text-shamar-small mt-1">Tutoriels et bonnes pratiques pour utiliser la plateforme</p>
            </div>
          </Link>

          <Link
            href="/messages"
            className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium transition-all flex items-start gap-shamar-16 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            <div className="p-shamar-12 bg-primary-50 rounded-shamar-md">
              <MessageCircle className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-shamar-h4 text-gray-900">Support client</h3>
              <p className="text-gray-500 text-shamar-small mt-1">Contactez notre équipe via Messages</p>
            </div>
          </Link>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft mt-shamar-24">
          <div className="flex items-center gap-shamar-12 mb-shamar-16">
            <HelpCircle className="w-8 h-8 text-primary-600" />
            <h2 className="text-shamar-h3 text-gray-900">FAQ en cours de construction</h2>
          </div>
          <p className="text-shamar-body text-gray-600">
            Notre centre d&apos;aide est en cours d&apos;enrichissement. En attendant, vous pouvez nous contacter via la section Messages ou consulter votre espace Pour moi pour gérer votre compte.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 mt-shamar-16 text-primary-600 font-medium hover:underline text-shamar-body"
          >
            Accéder à Pour moi <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
