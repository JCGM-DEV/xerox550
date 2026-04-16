# Xerox 550 - Calculadora de Presupuestos para Copistería

[![Live Demo](https://img.shields.io/badge/Acceso_Directo-Ver_Web-da291c?style=for-the-badge&logo=googlechrome&logoColor=white)](https://jcgm.dev/xerox550/)

Una aplicación web moderna y accesible para calcular presupuestos de impresión en una Xerox 550 Digital Press con análisis de rentabilidad en tiempo real.

## 🚀 Características Principales

- **Carga de PDFs**: Arrastra archivos PDF o selecciona múltiples archivos
- **Cálculo de presupuestos**: Tarifas automáticas según volumen
- **Modo claro/oscuro**: Interfaz adaptable a tus preferencias
- **Panel de administración**: Análisis de costes y márgenes en tiempo real
- **Historial diario**: Registro automático de trabajos del día
- **Responsive**: Funciona perfectamente en móvil, tablet y desktop
- **Accesible**: Cumple con estándares WCAG para usuarios con discapacidades

## 📋 Mejoras Realizadas

### Accesibilidad (WCAG 2.1)
- ✅ Atributos ARIA completos (aria-label, aria-live, aria-describedby)
- ✅ Semantic HTML5 mejorado (roles, landmarks regions)
- ✅ Focus states visibles en botones e inputs
- ✅ Contraste mejorado en textos
- ✅ Soporte completo para navegación por teclado
- ✅ Mensajes de error con role="alert"

### Validación y Seguridad
- ✅ Validación de archivos (solo PDF, máx 50 MB)
- ✅ Límite de páginas por archivo (máx 1000)
- ✅ Mensajes de error específicos y claros
- ✅ Confirmación antes de borrar datos
- ✅ Manejo robusto de localStorage con try-catch
- ✅ Validación de datos antes de guardar

### Performance
- ✅ PDF.js cargado de forma asíncrona
- ✅ Optimización de renderizado
- ✅ Procesamiento eficiente de múltiples PDFs
- ✅ Caché inteligente en localStorage

### UX/UI Mejorado
- ✅ Drop zone más accesible (soporte de teclado)
- ✅ Panel de errores persistente con auto-dismiss
- ✅ Feedback visual mejorado en transiciones
- ✅ Información de tamaño de archivo en listado
- ✅ Confirmaciones de acciones destructivas
- ✅ Animaciones suaves sin exceso

### Responsividad Móvil
- ✅ Breakpoints mejorados (768px y 480px)
- ✅ Botones optimizados para touch
- ✅ Textos redimensionables en móvil
- ✅ Mejor espaciado en pantallas pequeñas
- ✅ Grid responsive en paneles

## 🛠️ Instalación y Uso

1. Coloca todos los archivos en un servidor web o abre `index.html` localmente
2. El navegador debe soportar ES6 y PDF.js
3. LocalStorage debe estar habilitado para el historial

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- LocalStorage disponible (mínimo 5 MB)

## 📱 Uso

### Cargar Archivos
1. Arrastra PDFs a la zona de carga o haz clic para seleccionar
2. Máximo 20 archivos por lote, 50 MB cada uno
3. Los archivos se procesan automáticamente

### Configurar Presupuesto
1. Selecciona tipo de impresión (B/N o Color)
2. Elige modo (Símplex o Dúplex)
3. El precio se calcula automáticamente

### Registrar Trabajo
1. Haz clic en "Confirmar" para registrar el trabajo
2. Se guardará en el historial del día
3. Se reproduce un sonido de caja registradora

### Ver Historial
El historial del día aparece automáticamente con:
- Número de trabajos
- Ingresos totales
- Beneficio neto

## 💾 Datos Locales

La aplicación usa `localStorage` para:
- **Modo oscuro**: Preferencia del usuario
- **Historial**: Trabajos del día actual

Puedes borrar el historial con el botón "Borrar historial" en el panel de resumen.

## 🎨 Personalización

### Tarifas
Edita las constantes en `script.js`:
```javascript
const PRICING = {
    bn: { /* precios B/N */ },
    color: { /* precios color */ }
};
```

### Costes
```javascript
const COST_PAPER = 0.0096;      // Papel
const COST_ENERGY = 0.001;      // Luz
const COST_MAINT_BN = 0.006;    // Mantenimiento B/N
const COST_MAINT_COLOR = 0.035; // Mantenimiento Color
const COST_REPAIRS = 0.005;     // Averías
```

## 🔒 Privacidad

- Todos los datos se procesan localmente en tu navegador
- Los PDFs NO se envían a servidores externos
- El historial se guarda solo en localStorage local
- No hay tracking ni analíticas

## ⚡ Atajos de Teclado

- **Espacio/Enter** en drop zone: Abre selector de archivos
- **Tab**: Navega entre controles
- **Enter**: Confirma acciones

## 🐛 Soporte de Navegadores

| Navegador | Versión Mínima | Estado |
|-----------|-----------------|---------|
| Chrome    | 90+             | ✅ Full |
| Firefox   | 88+             | ✅ Full |
| Safari    | 14+             | ✅ Full |
| Edge      | 90+             | ✅ Full |

## 📞 Notas Técnicas

### localStorage
Si ves advertencia de almacenamiento lleno:
1. Borra el historial del día
2. Limpia datos del navegador
3. Libera espacio en localStorage

### PDFs Protegidos
Los PDFs con contraseña no se pueden procesar. Elimina la protección primero.

### Errores al Cargar
- Verifica que los archivos sean PDFs válidos
- Comprueba que el tamaño sea menor a 50 MB
- Intenta recargar la página

## 📈 Próximas Mejoras Potenciales

- Exportar historial a CSV
- Modo offline con Service Workers
- Gráficos de tendencias diarias
- Backup automático de datos
- Configuración guardable

---

**Versión**: 2.0.0 Mejorada  
**Última actualización**: Abril 2026  
**Estado**: Producción
