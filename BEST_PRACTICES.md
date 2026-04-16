# 📋 Guía de Mejores Prácticas - Xerox 550

## Uso Óptimo de la Aplicación

### ✅ Lo que Debes Hacer

#### Gestión de Archivos
1. **Organiza tus PDFs antes de subir**
   - Agrupa trabajos similares
   - Nómbralos descriptivamente (ej: `Folleto_20pag.pdf`)
   - Verifica que no estén protegidos

2. **Usa el modo cargas múltiples**
   - Puedes subir hasta 20 archivos a la vez
   - Máximo 50 MB por archivo
   - El sistema procesará todos automáticamente

3. **Espera confirmación visual**
   - La zona de carga se pone verde cuando completa
   - Los archivos se listan con número de páginas
   - Si hay error, verás un mensaje rojo específico

#### Configuración de Precios
1. **Tipo de impresión**
   - B/N: Para documentos de oficina, copias simples
   - Color: Para proyectos gráficos, marketing

2. **Modo de impresión**
   - Símplex: Una cara (más barato)
   - Dúplex: Ambas caras (mejor presentación)

3. **Observa el tramo automático**
   - El badge azul muestra el rango de precio ("1-50 págs")
   - Los precios bajan con mayor volumen
   - Se actualiza en tiempo real

#### Historial Diario
1. **Registra cada trabajo**
   - Presiona \"Confirmar\" para guardar
   - Se reproduce un sonido de caja registradora
   - El historial se actualiza automáticamente

2. **Revisa tu rentabilidad**
   - Ve el panel de administración con todos los costes
   - El % de margen te ayuda a evaluar precios

3. **Limpia diariamente**
   - Al final del día, revisa el resumen
   - Los datos se reinician a medianoche

### ❌ Lo que Debes Evitar

#### Errores Comunes
1. **NO subas PDFs protegidos**
   - La app no puede leer PDFs con contraseña
   - Usa herramientas externas para desproteger

2. **NO ignores los errores**
   - Cada mensaje rojo tiene una razón
   - Lee el mensaje completo antes de reintentar
   - Ejemplo: \"demasiadas páginas\" = PDF > 1000 págs

3. **NO cierres la sección sin guardar**
   - Si cierras el navegador, pierdes el presupuesto no guardado
   - Confirma siempre antes de cerrar
   - El historial se guarda automáticamente

4. **NO edites localStorage manualmente**
   - Es peligroso y puede corromper datos
   - Usa solo el botón \"Borrar historial\"

#### Limitaciones a Conocer
- Máximo 50 MB por archivo (no cambiar)
- Máximo 1000 páginas por PDF
- Solo PDFs válidos (no imágenes escaneadas débiles)
- LocalStorage limitado (típicamente 5-10 MB)

### 🔧 Mantenimiento y Limpieza

#### Semanal
```
1. Revisa el % de margen del historial
2. Nota si algún tipo de trabajo es rentable/no rentable
3. Ajusta tarifas si es necesario (en script.js)
```

#### Mensual
```
1. Exporta el historial manualmente si lo necesitas
2. Limpia localStorage si ves advertencias
3. Verifica que los costes de papel y consumibles sean actuales
```

#### Anual
```
1. Actualiza costes de Ofiterra
2. Revisa tarifas de Peplogar
3. Actualiza provisión de averías si cambió
```

### 📊 Interpretación de Datos

#### Margen Ideal
- **> 40%**: Excelente rentabilidad
- **20-40%**: Buena rentabilidad
- **< 20%**: Baja rentabilidad (considerar cambiar tarifas)

#### Desglose de Costes
- **Papel + Luz**: Aprox 1% del precio final
- **Mecánica**: Aprox 0.6-3.5% según color
- **Averías**: Aprox 0.5% (provisión)

#### Ejemplo Real
```
Trabajo: 100 págs B/N Dúplex
- Precio PVP: 6.00€
- Coste real: 1.20€
- Margen: 4.80€ (80%)
→ Excelente margen
```

### 🎯 Tips de Productividad

1. **Ataja por teclado**
   - Tab: Navega entre campos
   - Enter: Confirma (en drop zone)
   - Espacio: Abre selector archivos

2. **Usa modo oscuro para:**
   - Trabajar de noche
   - Reducir fatiga visual
   - Ahorrar batería (en OLED)
   - Toggle con el botón 🌙

3. **Imprime el ticket**
   - Botón \"Ticket\" 🖨️
   - Se imprime de forma limpia
   - Incluye todos los detalles

4. **Multitarea eficiente**
   - Carga archivos mientras hablas con clientes
   - El panel se actualiza en tiempo real
   - Sin bloqueos o delays

### 🔐 Privacidad y Seguridad

#### Tus Datos
- ✅ Procesamiento 100% local (sin subidas)
- ✅ Historial solo en este navegador
- ✅ No hay sincronización con servidores
- ✅ Puedes borrar todo cuando quieras

#### Ataques
- ❌ No hay tokens de autenticación (no necesarios)
- ❌ No se envían datos por red
- ❌ No hay cookies de tracking
- ❌ Cada navegador es independiente

### ⚡ Optimización de Navegador

#### Para Mejor Performance
1. **Cierra pestañas innecesarias**
   - Libera RAM para procesar PDFs
   - Reduce lag en tiempo real

2. **Vacía caché periódicamente**
   - Algunos navegadores cachean PDFs
   - Ctrl+Shift+Delete → Caché

3. **Actualiza tu navegador**
   - Versiones nuevas = mejor performance
   - Chrome 90+, Firefox 88+, Safari 14+

### 🆘 Troubleshooting

#### \"Archivo muy grande\"
- ✅ Solución: Comprimir PDF o dividir en partes
- Usa herramientas online como PDF Compressor

#### \"Demasiadas páginas\"
- ✅ Solución: Dividir en múltiples PDFs (máx 1000 págs)
- PDFs muy grandes ralentizan navegador

#### \"Almacenamiento lleno\"
- ✅ Solución: Borrar historial con botón
- Los datos antiguos se pierden (guardarlos si necesarios)

#### Historial desaparece
- ❌ Si cerraste índice/datos sin guardar: Se pierde
- ✅ Si cerraste el navegador: Los datos persisten
- ✅ Si cambias navegador: Datos NO se sincronizan

#### PDF no se carga
- Verifica que no sea protegido
- Intenta abrir en navegador normalmente
- Prueba con diferente navegador

### 📞 Contacto y Soporte

Si encuentras bugs o sugerencias:
1. Abre la consola (F12)
2. Revisa si hay mensajes de error
3. Copia el error completo
4. Reporta con navegador y versión

### 📈 Mejoras Futuras Recomendadas

Ideas para próximas versiones:
- Gráficos de tendencias semanales/mensuales
- Exportar historial a PDF/CSV
- Modo offline con sincronización
- Múltiples usuarios/máquinas
- Integración con sistema TPV

---

**Última actualización**: Abril 2026  
**Versión**: Compatible con v2.0.0+  
**Estado**: Vigente y actualizado
