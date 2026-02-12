# Admin : rewrites et pages redondantes

## Rewrites (next.config.mjs)

Les URLs `/admin/*` suivantes sont **réécrites** vers `/dashboard/admin/*` avant résolution des routes. Next.js sert donc la page sous `(protected)/dashboard/admin/...`, pas celles sous `(admin)/admin/(dashboard)/...`.

| URL demandée        | Destination réelle      |
|---------------------|--------------------------|
| `/admin/overview`   | `/dashboard/admin`       |
| `/admin/validation` | `/dashboard/admin`       |
| `/admin/users`      | `/dashboard/admin/users`  |
| `/admin/orders`     | `/dashboard/admin/orders` |
| `/admin/sellers`    | `/dashboard/admin/sellers` |
| `/admin/buyers`     | `/dashboard/admin/buyers`  |
| `/admin/products`   | `/dashboard/admin/products` |

## Pages sous (admin)/admin/(dashboard)/

Les pages suivantes ne sont **jamais rendues** pour les URLs ci‑dessus (rewrite prioritaire) :

- `overview/page.tsx` → redirect vers `/dashboard/admin`
- `users/page.tsx` → redirect vers `/dashboard/admin/users`
- `users/[id]/page.tsx` → redirect vers `/dashboard/admin/security/users/[id]`
- `kyc/page.tsx`, `kyc/[sellerId]/page.tsx` → redirect vers documents
- `finance/page.tsx`, `finance/transactions`, `refunds`, `escrows` → redirect vers dashboard admin finance
- `security/*`, `logs/page.tsx`, `disputes/*` → redirect vers dashboard admin

Elles sont conservées pour :

- Cohérence si les rewrites sont un jour supprimés.
- Accès direct à des URLs comme `/admin/china/dashboard`, `/admin/logistics`, `/admin/login` (non réécrites), qui utilisent le layout `(admin)`.

## URLs admin non réécrites (servies par ce dossier)

- `/admin` → `(admin)/admin/(dashboard)/page.tsx` (redirect `/admin/overview`)
- `/admin/login` → `(admin)/admin/login/page.tsx`
- `/admin/validation` → `(admin)/admin/validation/page.tsx` (redirect)
- `/admin/china/*`, `/admin/logistics/*` → pages sous `(admin)/admin/(dashboard)/`
