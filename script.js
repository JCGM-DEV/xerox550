document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════════════
    // 1. CONFIGURACIÓN DE PDF.js
    // ═══════════════════════════════════════════════════
    if (typeof window['pdfjsLib'] === 'undefined') {
        const dropError = document.getElementById('drop-error');
        if (dropError) {
            dropError.style.display = 'block';
            dropError.textContent = '❌ Error: No se pudo cargar la librería PDF. Recarga la página.';
        }
        return;
    }
    
    const PDFJS = window['pdfjsLib'];
    PDFJS.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    // ═══════════════════════════════════════════════════
    // 2. REFERENCIAS DEL DOM
    // ═══════════════════════════════════════════════════
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const dropError = document.getElementById('drop-error');
    const configPanel = document.getElementById('config-panel');
    const pageCountSpan = document.getElementById('page-count');
    const totalPriceSpan = document.getElementById('total-price');
    const totalBaseSpan = document.getElementById('total-base');
    const ivaAmountSpan = document.getElementById('iva-amount');
    const copyPriceSpan = document.getElementById('copy-price');
    const fileListDiv = document.getElementById('file-list');
    const sheetsCountSpan = document.getElementById('sheets-count');

    const minWarningSpan = document.getElementById('min-warning');
    const tierBadge = document.getElementById('tier-badge');

    const btnOrder = document.getElementById('btn-order');
    const btnPrint = document.getElementById('btn-print');
    const btnReset = document.getElementById('btn-reset');
    const toggleDark = document.getElementById('toggle-dark');

    const loadingOverlay = document.getElementById('loading');
    const cashSound = document.getElementById('cash-sound');

    // Admin Panel
    const adminPanel = document.getElementById('admin-panel');
    const adminCostPaper = document.getElementById('admin-cost-paper');
    const adminCostClick = document.getElementById('admin-cost-click');
    const adminRevenueBase = document.getElementById('admin-revenue-base');
    const adminMargin = document.getElementById('admin-margin');
    const adminMarginPct = document.getElementById('admin-margin-pct');
    const adminCostTotal = document.getElementById('admin-cost-total');

    // History Panel
    const historyPanel = document.getElementById('history-panel');
    const histCount = document.getElementById('hist-count');
    const histRevenue = document.getElementById('hist-revenue');
    const histProfit = document.getElementById('hist-profit');
    const historyList = document.getElementById('history-list');
    const historyClear = document.getElementById('history-clear');

    // Selectores
    const colorTypeSelect = document.getElementById('color-type');
    const sidesSelect = document.getElementById('sides');
    const simplexLabel = document.getElementById('simplex-label');
    const duplexLabel = document.getElementById('duplex-label');

    // Constantes de validación
    const MAX_FILE_SIZE_MB = 50;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const MAX_PAGES_PER_FILE = 1000;


    // ═══════════════════════════════════════════════════
    // 3. CONSTANTES DE NEGOCIO
    // ═══════════════════════════════════════════════════

    // Costes Reales Detallados (Ofiterra + Peplogar + Consumo)
    const COST_PAPER = 0.0096;      // 80g Ofiterra (20 paquetes)
    const COST_ENERGY = 0.001;      // Luz (consumo medio Xerox 550 por hoja)
    const COST_MAINT_BN = 0.006;    // Drums + Toner B/N (Peplogar)
    const COST_MAINT_COLOR = 0.035; // Drums + Toner Color (Peplogar)
    const COST_REPAIRS = 0.005;     // Provisión para Averías (Fusor, Banda, etc)

    // Precios PVP con IVA incluido (tarifas por tramos)

    const PRICING = {
        bn: {
            name: "Blanco y Negro",
            tiers: [
                { max: 50, simplex: 0.10, duplex: 0.15 },
                { max: 200, simplex: 0.05, duplex: 0.08 },
                { max: Infinity, simplex: 0.04, duplex: 0.06 }
            ]
        },
        color: {
            name: "Color Digital",
            tiers: [
                { max: 50, simplex: 0.30, duplex: 0.45 },
                { max: 100, simplex: 0.15, duplex: 0.25 },
                { max: Infinity, simplex: 0.10, duplex: 0.18 }
            ]
        }
    };

    const GESTION_ARCHIVOS_PVP = 0.80;
    const PEDIDO_MINIMO_PVP = 1.00;
    const IVA_FACTOR = 1.21;

    // ═══════════════════════════════════════════════════
    // 4. ESTADO
    // ═══════════════════════════════════════════════════
    let numPages = 0;
    let lastCalc = null; // Último cálculo para historial

    // ═══════════════════════════════════════════════════
    // 5. DARK MODE
    // ═══════════════════════════════════════════════════
    const savedDark = localStorage.getItem('xerox550_darkmode');
    if (savedDark === 'true') {
        document.body.classList.add('dark-mode');
        toggleDark.textContent = '☀️';
    }

    toggleDark.onclick = () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggleDark.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('xerox550_darkmode', isDark);
    };

    // ═══════════════════════════════════════════════════
    // 6. DRAG & DROP + CARGA DE ARCHIVOS
    // ═══════════════════════════════════════════════════
    
    // Hacer drop zone accesible por teclado
    dropZone.onkeypress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    };
    
    dropZone.onclick = () => fileInput.click();

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('active'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('active'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        handleFiles(e.dataTransfer.files);
    }, false);

    fileInput.onchange = (e) => {
        handleFiles(e.target.files);
    };

    function showError(message) {
        if (dropError) {
            dropError.style.display = 'block';
            dropError.textContent = message;
            setTimeout(() => {
                dropError.style.display = 'none';
            }, 5000);
        }
    }

    function handleFiles(files) {
        dropError.style.display = 'none';
        
        const selectedFiles = Array.from(files).filter(f => f.type === 'application/pdf');
        
        // Validación de cantidad
        if (selectedFiles.length === 0) {
            if (files.length > 0) {
                showError('❌ Solo se aceptan archivos PDF. Verifica que hayas seleccionado PDFs válidos.');
            }
            return;
        }

        // Validación de tamaño
        const oversizedFiles = selectedFiles.filter(f => f.size > MAX_FILE_SIZE_BYTES);
        if (oversizedFiles.length > 0) {
            showError(`❌ Archivo \"${oversizedFiles[0].name}\" es muy grande. Máximo ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }

        // Validación de cantidad de archivos
        if (selectedFiles.length > 20) {
            showError('⚠️ Máximo 20 archivos a la vez. Por favor, sube menos archivos.');
            return;
        }

        processAllPDFs(selectedFiles);
    }

    async function processAllPDFs(files) {
        loadingOverlay.style.display = 'flex';
        configPanel.style.display = 'none';
        adminPanel.style.display = 'none';
        dropError.style.display = 'none';
        numPages = 0;
        fileListDiv.innerHTML = '<strong>Archivos cargados:</strong><br>';
        fileListDiv.style.display = 'block';

        try {
            for (const file of files) {
                const reader = new FileReader();
                const p = new Promise((resolve, reject) => {
                    reader.onload = async function() {
                        try {
                            const typedarray = new Uint8Array(this.result);
                            const pdf = await PDFJS.getDocument({ data: typedarray }).promise;
                            
                            // Validación de páginas
                            if (pdf.numPages > MAX_PAGES_PER_FILE) {
                                throw new Error(`demasiadas páginas (${pdf.numPages})`);
                            }
                            
                            numPages += pdf.numPages;
                            const fileSize = (file.size / 1024).toFixed(1);
                            fileListDiv.innerHTML += `• ${file.name} (${pdf.numPages} pág, ${fileSize} KB)<br>`;
                            resolve();
                        } catch (e) { 
                            reject(new Error(`Error en \"${file.name}\": ${e.message}`));
                        }
                    };
                    reader.onerror = () => reject(new Error(`Error leyendo \"${file.name}\"`));
                });
                reader.readAsArrayBuffer(file);
                await p;
            }

            // Confirmación visual (flash verde en drop-zone)
            dropZone.classList.add('success');
            setTimeout(() => dropZone.classList.remove('success'), 1200);

            pageCountSpan.innerText = numPages;
            configPanel.style.display = 'block';
            calculatePrice();
        } catch (error) {
            console.error('Error procesando archivos:', error);
            showError(`❌ ${error.message || 'Error al leer. ¿El PDF está protegido?'}`);
            fileListDiv.innerHTML = '';
            fileListDiv.style.display = 'none';
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    // ═══════════════════════════════════════════════════
    // 7. CÁLCULO DE PRECIOS
    // ═══════════════════════════════════════════════════
    colorTypeSelect.onchange = calculatePrice;
    sidesSelect.onchange = calculatePrice;

    function calculatePrice() {
        const mode = colorTypeSelect.value;
        const isDuplex = sidesSelect.value === "2";
        
        // 1. Buscar tramo
        const config = PRICING[mode];
        const tierIndex = config.tiers.findIndex(t => numPages <= t.max);
        const tier = config.tiers[tierIndex];
        
        const unitSimplex = tier.simplex;
        const unitDuplex = tier.duplex;

        // 2. Mostrar tramo activo
        const tierLabels = ['1-50 págs', '51-200 págs', '+201 págs'];
        const tierLabelsColor = ['1-50 págs', '51-100 págs', '+101 págs'];
        const labels = mode === 'bn' ? tierLabels : tierLabelsColor;
        tierBadge.style.display = 'block';
        tierBadge.innerHTML = `📊 Tramo: <strong>${labels[tierIndex]}</strong> → ${isDuplex ? unitDuplex.toFixed(2) : unitSimplex.toFixed(2)}€/${isDuplex ? 'hoja' : 'pág'}`;

        // 3. Actualizar etiquetas de las opciones
        simplexLabel.innerText = `Simplex (${unitSimplex.toFixed(2)}€/pág)`;
        duplexLabel.innerText = `Dúplex (${unitDuplex.toFixed(2)}€/hoja)`;

        // 4. Cálculos
        let numSheets = isDuplex ? Math.ceil(numPages / 2) : numPages;
        let totalCopiesPVP = isDuplex ? (numSheets * unitDuplex) : (numPages * unitSimplex);
        
        // 6. PVP Total
        const totalPVP = totalCopiesPVP + GESTION_ARCHIVOS_PVP;
        
        // 7. Desglose fiscal
        const totalBase = totalPVP / IVA_FACTOR;
        const ivaAmount = totalPVP - totalBase;

        // 8. Actualizar UI
        if(copyPriceSpan) copyPriceSpan.innerText = totalCopiesPVP.toFixed(2) + '€';
        if(totalBaseSpan) totalBaseSpan.innerText = totalBase.toFixed(2) + '€';
        if(ivaAmountSpan) ivaAmountSpan.innerText = ivaAmount.toFixed(2) + '€';
        
        // Animación del precio
        totalPriceSpan.classList.remove('flash');
        void totalPriceSpan.offsetWidth; // Force reflow
        totalPriceSpan.innerText = totalPVP.toFixed(2) + '€';
        totalPriceSpan.classList.add('flash');
        
        if(sheetsCountSpan) {
            sheetsCountSpan.innerText = numSheets + (numSheets === 1 ? ' hoja' : ' hojas');
        }

        // ═══════════════════════════════════════════════
        // 9. ADMIN: Rentabilidad en tiempo real
        // ═══════════════════════════════════════════════
        adminPanel.style.display = 'block';
        
        let paperCost = numSheets * COST_PAPER;
        let energyCost = numSheets * COST_ENERGY;
        let maintenCost = numPages * (mode === 'bn' ? COST_MAINT_BN : COST_MAINT_COLOR);
        let repairsCost = numPages * COST_REPAIRS;
        
        let totalCost = paperCost + energyCost + maintenCost + repairsCost;
        let marginReal = totalBase - totalCost;
        let marginPct = totalBase > 0 ? ((marginReal / totalBase) * 100) : 0;

        adminCostPaper.innerText = (paperCost + energyCost).toFixed(3) + '€';
        adminCostClick.innerText = (maintenCost + repairsCost).toFixed(3) + '€';
        adminRevenueBase.innerText = totalBase.toFixed(2) + '€';
        adminMargin.innerText = marginReal.toFixed(2) + '€';
        adminMarginPct.innerText = marginPct.toFixed(0) + '%';
        adminCostTotal.innerText = totalCost.toFixed(3) + '€';

        // Color del margen según rentabilidad
        adminMargin.style.color = marginReal > 0 ? '#4ade80' : '#ef4444';
        adminMarginPct.style.color = marginPct > 40 ? '#4ade80' : marginPct > 20 ? '#facc15' : '#ef4444';

        // Log en consola
        console.group(`📋 REPORTE XEROX 550 | ${numPages} págs | ${config.name} | ${isDuplex ? 'Dúplex' : 'Simplex'}`);
        console.log(`Ingreso Neto (Ex-IVA): ${totalBase.toFixed(4)}€`);
        console.log(`Gasto Papel+Luz: ${(paperCost + energyCost).toFixed(4)}€`);
        console.log(`Gasto Mecánico: ${maintenCost.toFixed(4)}€`);
        console.log(`Provisión Averías: ${repairsCost.toFixed(4)}€`);
        console.log(`BENEFICIO LIMPIO: ${marginReal.toFixed(4)}€ (${marginPct.toFixed(1)}%)`);
        console.groupEnd();

        // Guardar último cálculo para historial
        lastCalc = {
            totalPVP,
            totalBase,
            totalCost,
            marginReal,
            numPages,
            mode: config.name,
            isDuplex
        };


        // ═══════════════════════════════════════════════
        // 10. PEDIDO MÍNIMO
        // ═══════════════════════════════════════════════
        if(totalPVP < PEDIDO_MINIMO_PVP) {
            btnOrder.disabled = true;
            minWarningSpan.style.display = 'block';
        } else {
            btnOrder.disabled = false;
            minWarningSpan.style.display = 'none';
        }

        // Mostrar historial
        renderHistory();
    }

    // ═══════════════════════════════════════════════════
    // 8. BOTÓN CONFIRMAR (AÑADIR AL CARRITO)
    // ═══════════════════════════════════════════════════
    btnOrder.onclick = () => {
        if (!lastCalc || btnOrder.disabled) return;

        // Validación de datos
        if (!lastCalc.numPages || lastCalc.totalPVP <= 0) {
            showError('⚠️ Error en los datos del presupuesto. Vuelve a subir los archivos.');
            return;
        }

        // Sonido de caja registradora (con mejor error handling)
        if (cashSound) {
            try {
                cashSound.currentTime = 0;
                cashSound.play().catch(() => {});
            } catch(e) {
                // Silenciosamente ignorar errores de sonido
            }
        }

        // Guardar en historial del día
        const today = new Date().toISOString().slice(0, 10);
        const history = JSON.parse(localStorage.getItem('xerox550_history') || '[]');
        
        // Validación de datos antes de guardar
        const newEntry = {
            date: today,
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            pages: lastCalc.numPages,
            mode: lastCalc.mode,
            duplex: lastCalc.isDuplex,
            pvp: parseFloat(lastCalc.totalPVP.toFixed(2)),
            margin: parseFloat(lastCalc.marginReal.toFixed(2))
        };
        
        history.push(newEntry);
        try {
            localStorage.setItem('xerox550_history', JSON.stringify(history));
        } catch (e) {
            console.error('Error guardando en localStorage:', e);
            showError('⚠️ Error guardando. El almacenamiento podría estar lleno.');
            return;
        }

        // Feedback visual
        const originalText = btnOrder.textContent;
        const originalBg = btnOrder.style.background;
        btnOrder.textContent = '✅ ¡Registrado!';
        btnOrder.style.background = '#22c55e';
        btnOrder.disabled = true;
        
        setTimeout(() => {
            btnOrder.textContent = originalText;
            btnOrder.style.background = originalBg;
            btnOrder.disabled = false;
        }, 2000);

        renderHistory();
    };

    // ═══════════════════════════════════════════════════
    // 9. BOTÓN IMPRIMIR TICKET
    // ═══════════════════════════════════════════════════
    btnPrint.onclick = () => {
        window.print();
    };

    // ═══════════════════════════════════════════════════
    // 10. BOTÓN NUEVO PRESUPUESTO
    // ═══════════════════════════════════════════════════
    btnReset.onclick = () => {
        if (numPages > 0 && !confirm('¿Estás seguro? Se perderán los datos actuales.')) {
            return;
        }
        
        numPages = 0;
        lastCalc = null;
        configPanel.style.display = 'none';
        adminPanel.style.display = 'none';
        fileInput.value = '';
        fileListDiv.innerHTML = '';
        fileListDiv.style.display = 'none';
        tierBadge.style.display = 'none';
        pageCountSpan.innerText = '0';
        totalPriceSpan.innerText = '0.00€';
        colorTypeSelect.value = 'bn';
        sidesSelect.value = '1';
        dropError.style.display = 'none';
        
        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Focus en drop zone para accesibilidad
        dropZone.focus();
    };

    // ═══════════════════════════════════════════════════
    // 11. HISTORIAL DEL DÍA (localStorage)
    // ═══════════════════════════════════════════════════
    function renderHistory() {
        const today = new Date().toISOString().slice(0, 10);
        const history = JSON.parse(localStorage.getItem('xerox550_history') || '[]');
        const todayItems = history.filter(h => h.date === today);

        if (todayItems.length === 0) {
            historyPanel.style.display = 'none';
            return;
        }

        historyPanel.style.display = 'block';

        const totalJobs = todayItems.length;
        const totalRevenue = todayItems.reduce((s, h) => s + (h.pvp || 0), 0);
        const totalProfit = todayItems.reduce((s, h) => s + (h.margin || 0), 0);

        histCount.innerText = totalJobs;
        histRevenue.innerText = totalRevenue.toFixed(2) + '€';
        histProfit.innerText = totalProfit.toFixed(2) + '€';

        historyList.innerHTML = todayItems.map((h, i) => {
            return '<div class="history-item"><span>' + h.time + ' · ' + h.pages + ' págs · ' + h.mode + '</span><span>+' + (h.margin || 0).toFixed(2) + '€</span></div>';
        }).reverse().join('');

    }

    historyClear.onclick = () => {
        if (confirm('¿Borrar el historial del día?')) {
            localStorage.removeItem('xerox550_history');
            renderHistory();
        }
    };

    // Cargar historial al iniciar
    renderHistory();

    // ═══════════════════════════════════════════════════
    // 12. CALCULADORA DE REVISTAS
    // ═══════════════════════════════════════════════════

    // Costes específicos para revistas en Xerox 550
    const REV_COSTS = {
        paper80g:           COST_PAPER,   // 0.0096€/hoja interior 80g
        paper100g:          0.013,        // €/hoja interior 100g
        paper130g:          0.018,        // €/hoja interior 130g
        paper200g:          0.022,        // €/hoja portada 200g
        paper250g:          0.028,        // €/hoja portada 250g
        paper300g:          0.034,        // €/hoja portada 300g
        clickColorInterior: 0.035,        // €/pág color interior
        clickBnInterior:    0.006,        // €/pág B/N interior
        clickCoverColor:    0.040,        // €/pág portada (mayor desgaste)
        energy:             COST_ENERGY,
        repairs:            COST_REPAIRS,
        bindingGrapado:     0.08,         // €/ejemplar grapado caballito
        bindingFresado:     0.22,         // €/ejemplar fresado con cola
    };

    const revCopiesInput      = document.getElementById('rev-copies');
    const revPagesInput       = document.getElementById('rev-pages');
    const revInteriorSel      = document.getElementById('rev-interior');
    const revInteriorGsmSel   = document.getElementById('rev-interior-gsm');
    const revCoverSel         = document.getElementById('rev-cover');
    const revBindingSel       = document.getElementById('rev-binding');
    const revMarginInput      = document.getElementById('rev-margin');
    const revPageWarning   = document.getElementById('rev-page-warning');

    const revCostInterior  = document.getElementById('rev-cost-interior');
    const revCostCover     = document.getElementById('rev-cost-cover');
    const revCostClicks    = document.getElementById('rev-cost-clicks');
    const revCostBinding   = document.getElementById('rev-cost-binding');
    const revCostTotal     = document.getElementById('rev-cost-total');
    const revCostUnit      = document.getElementById('rev-cost-unit');
    const revPvpUnit       = document.getElementById('rev-pvp-unit');
    const revPvpBase       = document.getElementById('rev-pvp-base');
    const revIva           = document.getElementById('rev-iva');
    const revPvpTotal      = document.getElementById('rev-pvp-total');

    const revAdmPaper      = document.getElementById('rev-adm-paper');
    const revAdmClicks     = document.getElementById('rev-adm-clicks');
    const revAdmBinding    = document.getElementById('rev-adm-binding');
    const revAdmRevenue    = document.getElementById('rev-adm-revenue');
    const revAdmMargin     = document.getElementById('rev-adm-margin');
    const revAdmPct        = document.getElementById('rev-adm-pct');

    const revBtnOrder      = document.getElementById('rev-btn-order');
    const revBtnPrint      = document.getElementById('rev-btn-print');
    const btnToggleRevista = document.getElementById('btn-toggle-revista');
    const revistaPanel     = document.getElementById('revista-panel');

    // Toggle panel
    btnToggleRevista.onclick = () => {
        const isOpen = revistaPanel.style.display !== 'none';
        revistaPanel.style.display = isOpen ? 'none' : 'block';
        btnToggleRevista.setAttribute('aria-expanded', String(!isOpen));
        if (!isOpen) {
            calculateRevista();
            revCopiesInput.focus();
        }
    };

    [revCopiesInput, revPagesInput, revInteriorSel, revInteriorGsmSel, revCoverSel, revBindingSel, revMarginInput]
        .forEach(el => el.addEventListener('input', calculateRevista));
    
    // Detectar si el usuario toca el margen manualmente
    revMarginInput.oninput = () => {
        revMarginInput._manual = true;
        calculateRevista();
    };

    function calculateRevista() {
        const copies      = Math.max(1, parseInt(revCopiesInput.value) || 1);
        let   pages       = parseInt(revPagesInput.value) || 24;
        const interior    = revInteriorSel.value;       // 'bn' | 'color'
        const interiorGsm = revInteriorGsmSel.value;    // '80' | '100' | '130'
        const coverGsm    = revCoverSel.value;          // '200' | '250' | '300'
        const binding     = revBindingSel.value;
        const defaultMargin = copies < 50 ? 60 : 45;
        const targetMarginPct = Math.min(90, Math.max(10, parseFloat(revMarginInput.value) || defaultMargin));
        
        // Actualizar visualmente el margen si no ha sido tocado por el usuario
        // o si queremos que refleje el cambio automático de tirada corta/larga.
        if (!revMarginInput._manual) {
            revMarginInput.value = defaultMargin;
        }

        // Validar múltiplo de 4
        if (pages % 4 !== 0) {
            revPageWarning.style.display = 'block';
            pages = Math.ceil(pages / 4) * 4;
        } else {
            revPageWarning.style.display = 'none';
        }

        // Hojas interiores por ejemplar (dúplex: 2 páginas/hoja)
        const interiorSheets = pages / 2;

        // ── COSTES POR EJEMPLAR ──────────────────────────
        const paperInteriorCost  = { '80': REV_COSTS.paper80g, '100': REV_COSTS.paper100g, '130': REV_COSTS.paper130g }[interiorGsm] || REV_COSTS.paper80g;
        const costPaperInterior  = interiorSheets * (paperInteriorCost + REV_COSTS.energy);
        const paperCoverCost     = { '200': REV_COSTS.paper200g, '250': REV_COSTS.paper250g, '300': REV_COSTS.paper300g }[coverGsm] || REV_COSTS.paper250g;
        const costPaperCover     = 1 * (paperCoverCost + REV_COSTS.energy);
        const clickCostPerPage   = interior === 'bn' ? REV_COSTS.clickBnInterior : REV_COSTS.clickColorInterior;
        const costClicksInterior = pages * (clickCostPerPage + REV_COSTS.repairs);
        const costClicksCover    = 4 * (REV_COSTS.clickCoverColor + REV_COSTS.repairs);
        const costBindingUnit    = binding === 'fresado' ? REV_COSTS.bindingFresado : REV_COSTS.bindingGrapado;

        const costPerUnit = costPaperInterior + costPaperCover + costClicksInterior + costClicksCover + costBindingUnit;

        // ── TOTALES LOTE ─────────────────────────────────
        const totalPaperCost   = (costPaperInterior + costPaperCover) * copies;
        const totalClicksCost  = (costClicksInterior + costClicksCover) * copies;
        const totalBindingCost = costBindingUnit * copies;
        const totalCost        = costPerUnit * copies;

        // ── PVP SUGERIDO: pvp = coste / (1 - margen%) ───
        const pvpUnitExIva = costPerUnit / (1 - targetMarginPct / 100);
        const pvpLoteExIva = pvpUnitExIva * copies;
        const ivaAmount    = pvpLoteExIva * 0.21;
        const pvpLoteTotal = pvpLoteExIva * IVA_FACTOR;

        // ── RENTABILIDAD ─────────────────────────────────
        const marginReal = pvpLoteExIva - totalCost;
        const marginPct  = pvpLoteExIva > 0 ? (marginReal / pvpLoteExIva) * 100 : 0;

        // ── ACTUALIZAR UI ─────────────────────────────────
        const fmt = (n) => n.toFixed(2) + '€';

        revCostInterior.innerText  = fmt(totalPaperCost);
        revCostCover.innerText     = fmt(costPaperCover * copies);
        revCostClicks.innerText    = fmt(totalClicksCost);
        revCostBinding.innerText   = fmt(totalBindingCost);
        revCostTotal.innerText     = fmt(totalCost);
        revCostUnit.innerText      = fmt(costPerUnit);
        revPvpUnit.innerText       = fmt(pvpUnitExIva * IVA_FACTOR);
        revPvpBase.innerText       = fmt(pvpLoteExIva);
        revIva.innerText           = fmt(ivaAmount);

        revPvpTotal.classList.remove('flash');
        void revPvpTotal.offsetWidth;
        revPvpTotal.innerText = fmt(pvpLoteTotal);
        revPvpTotal.classList.add('flash');

        revAdmPaper.innerText   = fmt(totalPaperCost);
        revAdmClicks.innerText  = fmt(totalClicksCost);
        revAdmBinding.innerText = fmt(totalBindingCost);
        revAdmRevenue.innerText = fmt(pvpLoteExIva);
        revAdmMargin.innerText  = fmt(marginReal);
        revAdmPct.innerText     = marginPct.toFixed(0) + '%';

        revAdmMargin.style.color = marginReal > 0 ? '#4ade80' : '#ef4444';
        revAdmPct.style.color    = marginPct > 40 ? '#4ade80' : marginPct > 20 ? '#facc15' : '#ef4444';

        revBtnOrder._lastCalc = {
            copies, pages, interior, interiorGsm, coverGsm, binding,
            pvpLoteTotal, pvpLoteExIva, totalCost, marginReal
        };
    }

    // Confirmar pedido revista
    revBtnOrder.onclick = () => {
        const calc = revBtnOrder._lastCalc;
        if (!calc) return;

        if (cashSound) {
            try { cashSound.currentTime = 0; cashSound.play().catch(() => {}); } catch(e) {}
        }

        const today = new Date().toISOString().slice(0, 10);
        const history = JSON.parse(localStorage.getItem('xerox550_history') || '[]');
        history.push({
            date: today,
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            pages: calc.copies + ' ej × ' + calc.pages + 'p',
            mode: 'Revista ' + (calc.interior === 'bn' ? 'B/N' : 'Color') + ' ' + calc.interiorGsm + 'g int/' + calc.coverGsm + 'g port',
            duplex: true,
            pvp: parseFloat(calc.pvpLoteTotal.toFixed(2)),
            margin: parseFloat(calc.marginReal.toFixed(2))
        });
        try {
            localStorage.setItem('xerox550_history', JSON.stringify(history));
        } catch(e) {
            showError('⚠️ Error guardando. El almacenamiento podría estar lleno.');
            return;
        }

        const orig = revBtnOrder.textContent;
        revBtnOrder.textContent = '✅ ¡Registrado!';
        revBtnOrder.style.background = '#22c55e';
        revBtnOrder.disabled = true;
        setTimeout(() => {
            revBtnOrder.textContent = orig;
            revBtnOrder.style.background = '';
            revBtnOrder.disabled = false;
        }, 2000);

        renderHistory();
    };

    revBtnPrint.onclick = () => window.print();
});