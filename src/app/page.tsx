import Link from 'next/link';
import { Shield, FileText, CheckCircle, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">NAVS Reembolsos</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Gestión de Reembolsos<br />
            <span className="text-indigo-600">Médicos y Farmacéuticos</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10">
            Solicita, rastrea y gestiona tus reembolsos de salud de forma rápida y sencilla.
            Cobertura automática según tipo de servicio.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Comenzar Ahora
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sube tus Documentos</h3>
            <p className="text-gray-500 text-sm">
              Adjunta facturas, recetas y comprobantes en PDF o imagen. Todo queda guardado de forma segura.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cobertura Automática</h3>
            <p className="text-gray-500 text-sm">
              El sistema calcula automáticamente el monto cubierto según el tipo de servicio médico.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seguimiento en Tiempo Real</h3>
            <p className="text-gray-500 text-sm">
              Conoce el estado de tus solicitudes en todo momento: pendiente, en revisión, aprobado o rechazado.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
