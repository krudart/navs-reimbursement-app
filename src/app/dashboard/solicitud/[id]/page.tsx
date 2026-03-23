import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import {
  REIMBURSEMENT_TYPE_LABELS,
  type RequestStatus,
  type ReimbursementType,
} from '@/lib/types';
import { ArrowLeft, FileText, Calendar, Building, DollarSign } from 'lucide-react';

export default async function RequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: request } = await supabase
    .from('reimbursement_requests')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!request) notFound();

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('request_id', request.id);

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a solicitudes
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Detalle de Solicitud
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Creada el{' '}
            {new Date(request.created_at).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <StatusBadge status={request.status as RequestStatus} />
      </div>

      {/* Request Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Información del Servicio</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Tipo de Servicio</p>
              <p className="text-sm font-medium text-gray-900">
                {REIMBURSEMENT_TYPE_LABELS[request.type as ReimbursementType]}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Fecha del Servicio</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(request.service_date).toLocaleDateString('es-MX')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Proveedor</p>
              <p className="text-sm font-medium text-gray-900">
                {request.provider_name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Monto Total</p>
              <p className="text-sm font-medium text-gray-900">
                ${Number(request.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Descripción</p>
          <p className="text-sm text-gray-700">{request.description}</p>
        </div>
      </div>

      {/* Coverage */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6 mb-6">
        <h2 className="font-semibold text-indigo-900 mb-3">Cobertura</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-indigo-600 mb-1">Monto Total</p>
            <p className="text-lg font-bold text-gray-900">
              ${Number(request.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-indigo-600 mb-1">
              Cubierto ({request.coverage_percentage}%)
            </p>
            <p className="text-lg font-bold text-green-700">
              ${Number(request.covered_amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-indigo-600 mb-1">Tu Pago</p>
            <p className="text-lg font-bold text-gray-700">
              ${(Number(request.amount) - Number(request.covered_amount)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Notes */}
      {request.admin_notes && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 mb-6">
          <h2 className="font-semibold text-amber-900 mb-2">
            Notas del Administrador
          </h2>
          <p className="text-sm text-amber-800">{request.admin_notes}</p>
        </div>
      )}

      {/* Documents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Documentos Adjuntos</h2>
        {documents && documents.length > 0 ? (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {doc.file_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(doc.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No hay documentos adjuntos.</p>
        )}
      </div>
    </div>
  );
}
