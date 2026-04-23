import { redirect } from 'next/navigation';

export default function RefundPage() {
  redirect('/return');
  return null;
}
