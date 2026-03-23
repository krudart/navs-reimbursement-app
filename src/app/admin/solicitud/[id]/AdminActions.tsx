'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type RequestStatus } from '@/lib/types';
import { CheckCircle, XCircle, Clock, Save } from 'lucide-react';

interface AdminActionsProps {
  requestId: string;
  currentStatus: RequestStatus;
  currentNotes: string;
}

export default function AdminActions({
  requestId,
  currentStatus,
  currentNotes,
}: AdminActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<RequestStatus>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    setSuccess(false);

    const supabase = createClient();
    const { error } = await supabase
      .from('reimbursement_requests')
      .update({
        status,
        admin_notes: notes,
      })
      .eq('id', requestId);

    setLoading(false);

    if (!error) {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  const statusOptions: { value: RequestStatus; label: string; icon: typeof CheckCircle; color: string }[] = [
    { value: 'pending', label: 'Pendiente', icon: Clock, color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
    { value: 'in_review', label: 'En Revisión', icon: Clock, color: 'border-blue-300 bg-blue-50 text-blue-700' },
    { value: 'approved', label: 'Aprobado', icon: CheckCircle, color: 'border-green-300 bg-green-50 text-green-700' },
    { value: 'rejected', label: 'Rechazado', icon: XCircle, color: 'border-red-300 bg-red-50 text-red-700' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Acciones de Administrador</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cambiar Estado
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {statusOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition ${
                  isSelected
                    ? opt.color
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas del Administrador
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Agrega notas sobre esta solicitud (visibles para el usuario)..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none text-gray-900"
        />
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
          Solicitud actualizada correctamente.
        </div>
      )}

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </div>
  );
}
