# Sistema de Gestión de Clientes y Cotizaciones

## 📋 Descripción

Se ha implementado un sistema completo de gestión de clientes y cotizaciones en el panel de administración de DATA_OR. Este sistema permite a los administradores crear, editar, eliminar y visualizar clientes y cotizaciones de manera eficiente.

## 🎯 Características Implementadas

### 1. **Gestión de Clientes** (`/admin/clientes`)

- ✅ Crear nuevos clientes con información completa
- ✅ Editar clientes existentes
- ✅ Eliminar clientes
- ✅ Vista de lista con información detallada
- ✅ Estadísticas de clientes (total, frecuentes, nuevos del mes)
- ✅ Soporte para fotos de clientes

**Campos del Cliente:**
- Nombre del contacto
- Nombre de la empresa
- Documento de la empresa
- RUT
- Teléfono
- Dirección
- Cliente frecuente (Sí/No)

### 2. **Gestión de Cotizaciones** (`/admin/cotizaciones`)

- ✅ Crear nuevas cotizaciones
- ✅ Editar cotizaciones existentes
- ✅ Eliminar cotizaciones
- ✅ Vista de lista con información detallada
- ✅ Estadísticas de cotizaciones (total, aceptadas, enviadas, borradores)
- ✅ Sistema de ítems múltiples
- ✅ Cálculo automático de subtotales, impuestos, descuentos y total
- ✅ Gestión de estados (Borrador, Enviada, Aceptada, Rechazada, Expirada)

**Campos de la Cotización:**
- Cliente asociado
- Número de cotización
- Fecha de creación
- Fecha de expiración
- Estado
- Items (descripción, cantidad, precio unitario)
- Subtotal
- Impuesto (%)
- Descuento
- Total
- Notas adicionales

### 3. **Navegación Mejorada**

#### Desktop:
- **Dropdown con Hover**: Al pasar el cursor sobre "Panel Admin", se despliega un menú con las opciones:
  - 📊 Proyectos
  - 👥 Clientes
  - 📋 Cotizaciones

#### Mobile:
- Menú expandido con enlaces directos a cada sección del panel admin

#### Dentro de las vistas admin:
- Botones de navegación persistentes en la parte superior de cada vista para cambiar fácilmente entre secciones

## 🗂️ Estructura de Archivos Creados

```
src/
├── types/
│   └── QuotationType.ts                  # Tipos de datos para cotizaciones
├── services/api/
│   ├── clientService.ts                  # Servicio API para clientes
│   └── quotationService.ts               # Servicio API para cotizaciones
├── composables/
│   ├── useClients.ts                     # Composable para gestión de clientes
│   └── useQuotations.ts                  # Composable para gestión de cotizaciones
├── views/
│   ├── AdminClients.vue                  # Vista de gestión de clientes
│   └── AdminQuotations.vue               # Vista de gestión de cotizaciones
├── components/
│   └── AdminDropdown.vue                 # Componente dropdown de navegación admin
└── router/
    └── index.ts                          # Rutas actualizadas
```

## 🔐 Seguridad

- Todas las rutas admin están protegidas con guards de autenticación
- Solo usuarios con rol `admin` pueden acceder
- Verificación de autenticación en cada vista
- Redirección automática si no está autenticado o no tiene permisos

## 🎨 Diseño

- Interfaz consistente con el diseño existente de AdminDashboard
- Tarjetas con gradientes y efectos visuales modernos
- Responsive design para todos los dispositivos
- Animaciones suaves en transiciones y hover
- Modo oscuro integrado

## 🔄 Flujo de Trabajo

### Crear Cliente:
1. Navegar a `/admin/clientes`
2. Completar el formulario de nuevo cliente
3. Hacer clic en "Agregar"
4. El cliente aparece en la lista

### Crear Cotización:
1. Navegar a `/admin/cotizaciones`
2. Seleccionar un cliente
3. Agregar número de cotización y fechas
4. Agregar items (pueden ser múltiples)
5. Los totales se calculan automáticamente
6. Seleccionar estado
7. Agregar notas opcionales
8. Hacer clic en "Crear Cotización"

### Editar:
1. Hacer clic en el botón "✏️" en cualquier tarjeta
2. Modificar los campos necesarios
3. Hacer clic en "Actualizar"

### Eliminar:
1. Hacer clic en el botón "🗑️" en cualquier tarjeta
2. Confirmar la eliminación

## 🌐 Endpoints de API (Backend)

### Clientes:
- `GET /api/v1/clients` - Obtener todos los clientes
- `GET /api/v1/clients/:id` - Obtener un cliente
- `POST /api/v1/clients` - Crear cliente
- `PUT /api/v1/clients/:id` - Actualizar cliente
- `DELETE /api/v1/clients/:id` - Eliminar cliente
- `POST /api/v1/clients/:id/photo` - Subir foto
- `DELETE /api/v1/clients/:id/photo` - Eliminar foto

### Cotizaciones:
- `GET /api/v1/quotations` - Obtener todas las cotizaciones
- `GET /api/v1/quotations/:id` - Obtener una cotización
- `GET /api/v1/clients/:id/quotations` - Obtener cotizaciones de un cliente
- `POST /api/v1/quotations` - Crear cotización
- `PUT /api/v1/quotations/:id` - Actualizar cotización
- `DELETE /api/v1/quotations/:id` - Eliminar cotización
- `GET /api/v1/quotations/:id/pdf` - Generar PDF
- `POST /api/v1/quotations/:id/send` - Enviar por email

## 📱 Responsive Design

- Desktop (>768px): Menú dropdown con hover
- Tablet/Mobile (<768px): Menú expandido con enlaces directos
- Formularios adaptables a diferentes tamaños de pantalla
- Grids responsivos para las tarjetas

## 🚀 Próximas Mejoras Sugeridas

1. **Exportar cotizaciones a PDF** (endpoint ya contemplado)
2. **Enviar cotizaciones por email** (endpoint ya contemplado)
3. **Dashboard con métricas de ventas**
4. **Filtros y búsqueda en las listas**
5. **Historial de cambios en cotizaciones**
6. **Plantillas de cotizaciones**
7. **Recordatorios de cotizaciones próximas a expirar**

## 🐛 Testing

Para probar las funcionalidades:

1. Iniciar sesión como administrador
2. Navegar a cualquier sección del panel admin
3. Verificar que el dropdown funciona correctamente
4. Crear, editar y eliminar clientes
5. Crear, editar y eliminar cotizaciones
6. Verificar cálculos automáticos en cotizaciones
7. Probar en diferentes dispositivos (desktop, tablet, mobile)

## 📝 Notas Importantes

- **Backend**: Los endpoints deben estar implementados en el backend para que el sistema funcione completamente
- **Autenticación**: Requiere token JWT válido con rol `admin`
- **LocalStorage**: Los tokens se almacenan en localStorage con la clave `authToken`
- **Validación**: Todos los formularios tienen validación HTML5 básica

## 🎉 Conclusión

El sistema está completamente implementado en el frontend y listo para integrarse con el backend. La navegación es intuitiva, el diseño es consistente y la experiencia de usuario es fluida tanto en desktop como en dispositivos móviles.
