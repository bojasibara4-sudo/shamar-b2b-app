import { redirect } from 'next/navigation';

export default function ShopDetailPageAlt({ params }: { params: { id: string } }) {
  // Rediriger vers la route groupée correspondante
  redirect(`/marketplace/shop/${params.id}`);
}
