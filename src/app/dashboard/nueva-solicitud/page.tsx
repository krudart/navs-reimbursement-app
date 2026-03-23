'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import FileUpload from '@/components/FileUpload';
import { REIMBURSEMENT_TYPE_LABELS, type ReimbursementType } from '@/lib/types';
import { calculateCoverage, COVERAGE_RATES } from '@/lib/coverage';
import { ArrowLeft, Send, Calculator } from 'lucide-react';
import Link from 'next/link';

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const [type, setType] = useState<ReimbursementType>('medical_consultation');
  const [description, setDescription] = useState('');
  const [providerName, setProviderName] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [amount, setAmount] = useState('');

  const numericAmount = parseFloat(amount) || 0;
  const coverage = calculateCoverage(type, numericAmount);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (files.length === 0) {
      setError('Debes adjuntar al menos un documento (factura o receta).');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('No autenticado');

      // Create the request
      const { data: request, error: requestError } = await supabase
        .from('reimbursement_requests')
        .insert({
          user_id: user.id,
          type,
          description,
          provider_name: providerName,
          service_date: serviceDate,
          amount: numericAmount,
          coverage_percentage: coverage.percentage,
          covered_amount: coverage.coveredAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Upload files
      for (const file of files) {
        const filePath = `${user.id}/${request.id}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save document reference
        await supabase.from('documents').insert({
          request_id: request.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
        });
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear la solicitud';
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a solicitudes
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Nueva Solicitud de Reembolso</h1>
      <p className="text-gray-500 text-sm mb-8">
        Completa el formulario y adjunta los documentos necesarios.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Información del Servicio</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Servicio
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ReimbursementType)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 bg-white"
              >
                {Object.entries(REIMBURSEMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Cobertura: {COVERAGE_RATES[type]}%
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha del Servicio
              </label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proveedor / Centro Médico
              </label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                required
                placeholder="Ej: Hospital San José"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Total (MXN)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción / Motivo
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Describe brevemente el servicio recibido..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none text-gray-900"
            />
          </div>
        </div>

        {/* Coverage Preview */}
        {numericAmount > 0 && (
          <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-indigo-900">Cálculo de Cobertura</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-indigo-600 mb-1">Monto Total</p>
                <p className="text-lg font-bold text-gray-900">
                  ${numericAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-indigo-600 mb-1">
                  Cobertura ({coverage.percentage}%)
                </p>
                <p className="text-lg font-bold text-green-700">
                  ${coverage.coveredAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-indigo-600 mb-1">Tu Pago</p>
                <p className="text-lg font-bold text-gray-700">
                  ${coverage.outOfPocket.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Documentos Adjuntos
          </h2>
          <FileUpload files={files} onChange={setFiles} />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          {loading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
        </button>
      </form>
    </div>
  );
}
