import { redirect } from 'next/navigation';

export default function ShopDetailPage({ params }: { params: { id: string } }) {
  // Rediriger vers la route groupée correspondante
  redirect(`/marketplace/shop/${params.id}`);
}
