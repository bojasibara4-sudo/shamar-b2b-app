import Link from 'next/link';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-50">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
        SHAMAR B2B
      </h1>

      <p className="text-gray-600 max-w-xl mb-8 text-lg">
        Plateforme B2B africaine conçue pour connecter, structurer
        et accélérer les échanges commerciaux.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/auth/login"
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition font-medium"
        >
          Commencer
        </Link>

        <Link
          href="/auth/register"
          className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 transition font-medium"
        >
          En savoir plus
        </Link>
      </div>
    </section>
  );
}

