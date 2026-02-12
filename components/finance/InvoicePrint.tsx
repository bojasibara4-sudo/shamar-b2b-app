'use client';

export default function InvoicePrint({ order }: { order: any }) {
  const items = order.order_items || [];
  const total = Number(order.total_amount || 0);
  const currency = order.currency || 'FCFA';
  const buyer = order.buyer || {};
  const seller = order.seller || {};

  return (
    <div>
      <div className="flex justify-between items-start mb-8 print:mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Facture / Reçu</h1>
          <p className="text-slate-500 text-sm">Commande #{order.id?.slice(0, 8)}</p>
          <p className="text-slate-500 text-sm mt-1">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="print:hidden px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm"
        >
          Imprimer / PDF
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
        <div>
          <p className="font-bold text-slate-500 uppercase text-xs mb-1">Vendeur</p>
          <p className="font-bold text-slate-900">{seller.company_name || seller.full_name || seller.email}</p>
          <p className="text-slate-600">{seller.email}</p>
        </div>
        <div>
          <p className="font-bold text-slate-500 uppercase text-xs mb-1">Acheteur</p>
          <p className="font-bold text-slate-900">{buyer.company_name || buyer.full_name || buyer.email}</p>
          <p className="text-slate-600">{buyer.email}</p>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="py-3 text-slate-500 font-bold text-xs uppercase">Désignation</th>
            <th className="py-3 text-slate-500 font-bold text-xs uppercase text-right">Qté</th>
            <th className="py-3 text-slate-500 font-bold text-xs uppercase text-right">Prix unit.</th>
            <th className="py-3 text-slate-500 font-bold text-xs uppercase text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.id} className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">{item.product?.name || 'Produit'}</td>
              <td className="py-3 text-right text-slate-600">{item.quantity}</td>
              <td className="py-3 text-right text-slate-600">{Number(item.price || 0).toLocaleString()} {currency}</td>
              <td className="py-3 text-right font-bold text-slate-900">
                {(Number(item.price || 0) * (item.quantity || 0)).toLocaleString()} {currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 pt-4 border-t-2 border-slate-200 flex justify-between items-center">
        <p className="text-slate-500 text-sm">Paiement : {order.payment_status === 'paid' ? 'Payé' : order.payment_status || 'En attente'}</p>
        <p className="text-xl font-black text-slate-900">Total TTC : {total.toLocaleString()} {currency}</p>
      </div>
    </div>
  );
}
