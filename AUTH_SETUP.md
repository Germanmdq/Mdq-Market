# Configuración del Sistema de Autenticación

## 1. Configurar Variables de Entorno

Asegúrate de tener estas variables en tu `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## 2. Ejecutar Migración de Base de Datos

Ve a tu proyecto en Supabase Dashboard:
1. Abre el **SQL Editor**
2. Copia y pega el contenido de `supabase/migrations/001_auth_and_user_tables.sql`
3. Ejecuta el script

Esto creará:
- Tabla `profiles` (perfiles de usuario)
- Tabla `favorites` (favoritos del usuario)
- Tabla `orders` (compras)
- Tabla `service_bookings` (reservas de servicios)
- Políticas RLS (Row Level Security)
- Trigger automático para crear perfil al registrarse

## 3. Habilitar Autenticación por Email

En Supabase Dashboard:
1. Ve a **Authentication** > **Providers**
2. Habilita **Email**
3. Configura las URLs de redirección si es necesario

## 4. Funcionalidades Implementadas

### Registro de Usuario
- Email + Contraseña
- Se crea automáticamente un perfil en la tabla `profiles`
- Nombre completo guardado en metadata

### Inicio de Sesión
- Email + Contraseña
- Sesión persistente en localStorage

### Cerrar Sesión
- Disponible en el menú de usuario (desktop)
- Disponible en el menú móvil

### Protección de Rutas
Las siguientes páginas requieren autenticación:
- `/mi-cuenta`
- `/favoritos`
- `/mis-publicaciones`
- `/publicar`

### UI/UX
- Modal de auth limpio y profesional
- Botón "Ingresar" cuando no hay sesión
- Menú de usuario con opciones cuando hay sesión activa
- Integración completa en Header (desktop + mobile)

## 5. Próximos Pasos

Ejecutar el build para verificar que no hay errores:
```bash
npm run build
```

Una vez que el Auth funcione, continuar con:
1. Crear páginas funcionales de cuenta
2. Implementar favoritos reales
3. Implementar sistema de compras
4. Proteger rutas con middleware
