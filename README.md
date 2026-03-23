# NAVS - Sistema de Gestión de Reembolsos Médicos

Aplicación web full-stack para gestionar reembolsos médicos y farmacéuticos. Permite a los usuarios enviar solicitudes con documentos adjuntos y a los administradores revisarlas y aprobarlas.

## Tecnologías

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + Storage)
- **UI**: Lucide React (iconos)

## Funcionalidades

### Módulo de Usuario
- Registro e inicio de sesión
- Dashboard con estadísticas personales
- Crear solicitudes de reembolso con documentos adjuntos (PDF/imágenes)
- Cálculo automático de cobertura según tipo de servicio
- Ver historial y estado de solicitudes

### Módulo de Administrador
- Panel con estadísticas globales
- Listado de todas las solicitudes
- Revisar documentos adjuntos
- Cambiar estado (Pendiente / En Revisión / Aprobado / Rechazado)
- Agregar notas visibles para el usuario

### Porcentajes de Cobertura
| Tipo de Servicio | Cobertura |
|---|---|
| Consulta Médica | 80% |
| Farmacéutico | 70% |
| Exámenes de Laboratorio | 90% |
| Hospitalización | 85% |
| Dental | 60% |
| Otro | 50% |

## Configuración

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo
2. En **Settings > API**, copia el `URL` y la `anon key`

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus valores de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Ejecutar migración de base de datos

En el **SQL Editor** de Supabase, ejecuta el contenido del archivo:

```
supabase/migrations/001_initial_schema.sql
```

Esto crea las tablas, políticas de seguridad y el bucket de almacenamiento.

### 4. Crear un usuario administrador

Después de registrar tu primer usuario, ejecuta en el SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'tu-email@ejemplo.com';
```

### 5. Instalar y ejecutar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
src/
├── app/
│   ├── auth/          # Login y registro
│   ├── dashboard/     # Panel del usuario
│   ├── admin/         # Panel del administrador
│   └── page.tsx       # Landing page
├── components/        # Componentes reutilizables
└── lib/
    ├── supabase/      # Clientes Supabase (browser/server)
    ├── types.ts       # Tipos TypeScript
    └── coverage.ts    # Lógica de cálculo de cobertura
```
