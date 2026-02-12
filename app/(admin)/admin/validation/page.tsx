import { redirect } from 'next/navigation';

export default function AdminValidationRedirect() {
  redirect('/dashboard/admin');
}
