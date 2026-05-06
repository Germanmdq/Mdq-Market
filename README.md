# MDP Market & Services

## Descripción del Producto
**MDP Market & Services** es una plataforma marketplace hiperlocal diseñada específicamente para la ciudad de Mar del Plata. Combina la compra-venta de productos físicos con la contratación de servicios técnicos y profesionales certificados, todo bajo un sistema de **Pago Protegido**.

No es una landing explicativa ni un pitch; es un producto funcional listo para operar con usuarios reales.

## Stack Tecnológico
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn UI](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Gráficos**: [Recharts](https://recharts.org/) (en panel admin)
- **Backend Ready**: Estructura preparada para integración con [Supabase](https://supabase.com/) y [Mercado Pago](https://www.mercadopago.com.ar/developers).

## Funcionalidades Implementadas
- **Marketplace de Productos**: Navegación, filtros avanzados por zona (MDP) y detalle de producto.
- **Directorio de Servicios**: Contratación de técnicos (plomeros, electricistas, etc.) con reserva protegida.
- **Directorio de Profesionales**: Perfiles certificados (abogados, contadores, salud) con validación de matrícula.
- **Pago Protegido**: Simulación completa de checkout donde el dinero se retiene hasta la confirmación de entrega.
- **Chat con Anti-Bypass**: Sistema de mensajería interna que bloquea intentos de intercambio de datos de contacto antes de la operación.
- **Seguimiento de Operación**: Línea de tiempo visual para el seguimiento de compras y turnos.
- **Gestión de Reclamos**: Centro de disputas para mediación en caso de problemas.
- **Dashboards Multi-Rol**:
  - **Usuario**: Compras, favoritos y mensajes.
  - **Vendedor**: Gestión de stock, ventas y métricas.
  - **Profesional**: Agenda, servicios y reputación.
  - **Admin**: Control total de operaciones, métricas financieras y alertas de fraude.

## Estructura de Rutas
- `/`: Home Comercial
- `/productos`: Listado de productos
- `/servicios`: Listado de servicios
- `/profesionales`: Listado de profesionales
- `/categorias`: Directorio de categorías
- `/chat`: Mensajería protegida
- `/checkout`: Flujo de pago simulado
- `/operaciones/[id]`: Seguimiento de pedido
- `/dashboard/[rol]`: Paneles de gestión
- `/admin`: Panel administrativo financiero y de seguridad

## Instalación y Ejecución

```bash
# Clonar o descargar el proyecto
# Instalar dependencias
npm install

# Correr en modo desarrollo
npm run dev
```

## Datos Mockeados
La plataforma incluye más de 200 items de datos mockeados en `src/data/mockData.ts` que simulan una plataforma viva en Mar del Plata, incluyendo 20 categorías principales y todas las zonas de la ciudad (Güemes, Centro, Constitución, etc.).

## Próximos Pasos para Producción
1. **Supabase**: Reemplazar los arrays de `mockData.ts` por llamadas a la API de Supabase.
2. **Mercado Pago**: Configurar los webhooks en el flujo de `/checkout` para procesar pagos reales.
3. **Storage**: Conectar la subida de imágenes en `/publicar` con Supabase Storage.
4. **Auth**: Implementar Supabase Auth para la persistencia de perfiles de usuario.

---
Desarrollado para la comunidad de Mar del Plata.
