import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { REIMBURSEMENT_TYPE_LABELS, type RequestStatus, type ReimbursementType } from '@/lib/types';
import {
  FilePlus,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: requests } = await supabase
    .from('reimbursement_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const allRequests = requests || [];
  const totalAmount = allRequests.reduce((sum, r) => sum + Number(r.covered_amount), 0);
  const pendingCount = allRequests.filter((r) => r.status === 'pending' || r.status === 'in_review').length;
  const approvedCount = allRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = allRequests.filter((r) => r.status === 'rejected').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Solicitudes</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona tus solicitudes de reembolso
          </p>
        </div>
        <Link
          href="/dashboard/nueva-solicitud"
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition text-sm"
        >
          <FilePlus className="w-4 h-4" />
          Nueva Solicitud
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Cubierto</p>
              <p className="text-lg font-bold text-gray-900">
                ${totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pendientes</p>
              <p className="text-lg font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Aprobados</p>
              <p className="text-lg font-bold text-gray-900">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Rechazados</p>
              <p className="text-lg font-bold text-gray-900">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Historial de Solicitudes</h2>
        </div>

        {allRequests.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No tienes solicitudes aún
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Crea tu primera solicitud de reembolso
            </p>
            <Link
              href="/dashboard/nueva-solicitud"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition text-sm"
            >
              <FilePlus className="w-4 h-4" />
              Nueva Solicitud
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Cubierto
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(req.service_date).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {REIMBURSEMENT_TYPE_LABELS[req.type as ReimbursementType]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {req.provider_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right font-mono">
                      ${Number(req.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700 text-right font-mono font-medium">
                      ${Number(req.covered_amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={req.status as RequestStatus} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/dashboard/solicitud/${req.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Ver Detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
