import { redirect } from 'next/navigation';

// Redirect /industrias to the first industry page
// Individual industry pages: /industrias/cervecera, /industrias/logistica, etc.
export default function IndustriasPage() {
    redirect('/industrias/cervecera');
}
