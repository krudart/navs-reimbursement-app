import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const userName = profile?.full_name || user.email || 'Usuario';
  const role = profile?.role || 'user';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} userName={userName} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
