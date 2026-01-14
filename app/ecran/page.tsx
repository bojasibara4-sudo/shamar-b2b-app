import { readdir } from 'fs/promises';
import { join } from 'path';
import Image from 'next/image';

async function getEcranImages() {
  const ecranDir = join(process.cwd(), 'public', 'ecran');
  try {
    const files = await readdir(ecranDir);
    return files.filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'));
  } catch {
    return [];
  }
}

export default async function EcranPage() {
  const images = await getEcranImages();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Écrans SHAMAR B2B
          </h1>
          <p className="text-gray-600">
            Maquettes et interfaces générées par iStudio
          </p>
        </div>

        {images.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">Aucun écran disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[9/16] w-full">
                  <Image
                    src={`/ecran/${image}`}
                    alt={`Écran ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.replace(/\.(png|jpg|jpeg)$/i, '').replace(/Screenshot_\d{8}-/, '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

