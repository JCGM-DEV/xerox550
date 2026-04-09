# Changelog - Xerox 550 Calculadora

## [2.0.0] - 2026-04-02 - Versión Mejorada

### 🎯 Cambios Principales

#### Accesibilidad (WCAG 2.1)
- **HTML Semantic**: Cambio de `<div>` genéricos a elementos semánticos
  - `<h2>` cambiado a `<h1>` para mejor jerarquía
  - Drop zone con `role=\"button\"` y `tabindex=\"0\"`
  - Paneles con `role=\"region\"` y `aria-label`
  - Formulario con `role=\"form\"`
  
- **ARIA Attributes**: 
  - `aria-label` en botones y controles interactivos
  - `aria-describedby` para instrucciones de drop zone
  - `aria-live=\"polite\"` para actualizaciones dinámicas
  - `aria-live=\"assertive\"` para alertas
  - `aria-atomic=\"true\"` para resúmenes

- **Navegación por Teclado**:
  - Drop zone accesible con Enter/Espacio
  - Focus states visibles con outline de 3px
  - Tab order correcto en todos los elementos

#### Validación y Error Handling
- **Validación de Archivos**:
  - Máximo 50 MB por archivo
  - Máximo 1000 páginas por PDF
  - Máximo 20 archivos por lote
  - Mensajes de error específicos

- **Manejo de Errores Mejorado**:
  - Panel de errores con auto-dismiss (5s)
  - Errores contextuales (\"El archivo X es muy grande\")
  - Validación de PDF.js antes de usar
  - Try-catch en JSON.parse/localStorage
  - Confirmación antes de acciones destructivas

#### Performance
- **Carga de Archivos**:
  - PDF.js con atributo `async`
  - Procesamiento asíncrono mejorado
  - Información de tamaño en listado de archivos

- **localStorage**:
  - Manejo seguro con try-catch
  - Valores nulos manejados correctamente
  - Error handling para almacenamiento lleno

#### CSS Mejorado
- **Variables CSS**:
  - `--error: #ef4444` para consistencia

- **Focus States**:
  - `outline: 3px` en botones y selectores
  - `box-shadow` para mejor visibilidad
  - Estados consistentes

- **Responsividad**:
  - Breakpoint móvil añadido: 480px
  - Mejor espaciado en pantallas pequeñas
  - Tamaños de fuente ajustables por pantalla
  - Grid responsive en admin-grid

- **Animaciones**:
  - Transiciones mejoradas en botones
  - Loading overlay con texto descriptivo
  - Flash animado en asignación de precio

#### UX Improvements
- **Dashboard Mejorado**:
  - Panel de confirmación antes de reset
  - Focus automático en drop zone después de reset
  - Botones con feedback visual prolongado (2s)

- **Mensajes Inteligentes**:
  - \"Archivo X es muy grande. Máximo 50MB.\"
  - \"Almacenamiento lleno. Borra el historial.\"
  - \"Error en \\\"X.pdf\\\": demasiadas páginas\"

- **Accesibilidad Visual**:
  - Contraste mejorado en variables CSS
  - Bordes de input más visibles (2px)
  - Mejor diferenciación entre estados

#### JavaScript Refactorizado
- **Funciones Auxiliares**:
  - `showError(message)` centralizada
  - `safeLocalStorageGet()` con error handling
  - Manejo consistente de promises

- **Validaciones**:
  - Validación de archivos PDF específica
  - Chequeo de tamaño y cantidad
  - Validación de datos antes de historial

- **Manejo de Estado**:
  - Mejor gestión de estados del DOM
  - Confirmaciones en acciones irreversibles
  - Reset completo del formulario

### 📝 Cambios por Fichero

#### index.html
- Cambio `<h2>` → `<h1>` (Xerox 550)
- Añadido `role=\"main\"` en container
- Añadido `role=\"application\"` en body
- Añadido div `#drop-error` para errores
- Semantic sections con roles
- ARIA labels en todos los controles
- Meta tag `X-UA-Compatible` para IE
- `async` en PDF.js script

#### script.js
- Validación de PDF.js al inicio
- Constantes de validación (tamaño, páginas, archivos)
- Función `showError()` reutilizable
- Función `safeLocalStorageGet()`
- Enhanced `handleFiles()` validation
- Better error messages en processAllPDFs()
- Historial con fallback values (|| 0)
- Try-catch en localStorage operations
- Confirmación en btnReset
- Focus management mejorado
- Better logging en console

#### style.css
- `--error` CSS variable añadida
- Select con `outline` en focus
- Botones con focus states mejorados
- Drop zone con focus outline
- Loading overlay con flex-direction
- Media queries optimizadas (480px)
- Better box-shadows en focus
- Improved transitions en botones

#### README.md (Nuevo)
- Documentación completa
- Sección de características
- Guía de instalación
- Tabla de compatibilidad
- Instrucciones de personalización
- Info de privacidad

#### CHANGELOG.md (Este archivo)
- Historial de cambios detallado
- Versiones y fechas
- Cambios por categoría

### 🔧 Detalles Técnicos

#### Validación de Archivos
```javascript
// Validaciones nuevas
- Tamaño: 50 MB máximo
- Páginas: 1000 máximo por archivo
- Cantidad: 20 archivos máximo
- Tipo: Solo application/pdf
```

#### localStorage Safety
```javascript
// Manejo seguro
try {
    localStorage.setItem(key, JSON.stringify(value));
} catch (e) {
    showError('Almacenamiento lleno');
}
```

#### Error Display
- Panel con `role=\"alert\"`
- Auto-dismiss después de 5s
- Mensajes contextualizados
- Sin interrupciones modales

### 🎨 Ejemplo de Mejoras Visuales

**Antes**:
```html
<button id=\"btn-order\">🛒 Confirmar</button>
```

**Después**:
```html
<button id=\"btn-order\" aria-label=\"Confirmar pedido\">🛒 Confirmar</button>
```

Con focus state con outline de 3px y mejor color.

### 📊 Cobertura de Accesibilidad

| Criterio WCAG | Nivel | Status |
|---|---|---|
| Keyboard Access | A | ✅ |
| Screen Readers | A | ✅ |
| Contrast Ratio | AA | ✅ |
| Focus Visible | AA | ✅ |
| Error Messages | A | ✅ |
| Form Labels | A | ✅ |

### ⚠️ Breaking Changes

Ninguno. La actualización es completamente backward-compatible.

### 🔄 Migración desde v1.x

1. Reemplaza los archivos HTML, CSS y JS
2. Tu historial local se mantiene
3. Tus preferencias (modo oscuro) se mantienen
4. No requiere cambios en configuración

### 🚀 Próximas Mejoras

- [ ] Service Workers para offline
- [ ] Exportar CSV del historial
- [ ] Gráficos de tendencias
- [ ] Dark mode automático (prefers-color-scheme)
- [ ] PWA mejorada con icono

### 🐛 Bugs Conocidos

Ninguno en esta versión.

### 📞 Soporte

Para problemas, verifica:
1. Navegador actualizado
2. localStorage habilitado
3. PDFs válidos (no protegidos)
4. Consola del navegador (F12) para errores

---

**Versión**: 2.0.0  
**Fecha**: 2026-04-02  
**Autor**: Mejoras de Accesibilidad y UX  
**Estado**: Ready for Production
