var api_nosotros = (() => {

    const SECCIONES = [
        { id: 'mision', tabla: 'mision', descId: 'mision-descripcion', inputId: 'mision-input', areaId: 'mision-upload-area', previewId: 'mision-preview' },
        { id: 'vision', tabla: 'vision', descId: 'vision-descripcion', inputId: 'vision-input', areaId: 'vision-upload-area', previewId: 'vision-preview' },
        { id: 'valores', tabla: 'valores', descId: 'valores-descripcion', inputId: 'valores-input', areaId: 'valores-upload-area', previewId: 'valores-preview' }
    ];

    let archivos = { mision: null, vision: null, valores: null };
    let idsExistentes = { mision: null, vision: null, valores: null };

    function init() {
        const allExist = SECCIONES.every(s =>
            document.getElementById(s.inputId) &&
            document.getElementById(s.descId) &&
            document.getElementById(s.previewId)
        );
        if (!allExist) return setTimeout(init, 50);
        archivos = { mision: null, vision: null, valores: null };
        idsExistentes = { mision: null, vision: null, valores: null };
        SECCIONES.forEach(s => {
            document.getElementById(s.inputId).value = '';
            document.getElementById(s.descId).value = '';
            document.getElementById(s.previewId).innerHTML = '';
        });
        configurarUploads();
        cargarIdsExistentes();
    }

    async function cargarSeccion(sec) {
        try {
            const descEl = document.getElementById(sec.descId);
            const prevEl = document.getElementById(sec.previewId);
            if (!descEl || !prevEl) return;
            const json = await apiGet(sec.tabla);
            if (json.success && json.datos.length > 0) {
                const dato = json.datos[0];
                idsExistentes[sec.id] = dato.id;
                descEl.value = dato.descripcion || '';
                if (dato.imagen) {
                    prevEl.innerHTML = `
                        <div class="preview-item">
                            <img src="${dato.imagen}?=${Date.now()}" alt="${sec.id}">
                            <button class="btn-remove-img" data-sec="${sec.id}" data-tipo="existente">X</button>
                        </div>`;
                }
            }
        } catch (e) {}
    }

    async function cargarIdsExistentes() {
        for (const sec of SECCIONES) {
            try {
                const json = await apiGet(sec.tabla);
                if (json.success && json.datos.length > 0) {
                    idsExistentes[sec.id] = json.datos[0].id;
                }
            } catch (e) {}
        }
    }

    function configurarUploads() {
        SECCIONES.forEach(sec => {
            const input = document.getElementById(sec.inputId);
            const area = document.getElementById(sec.areaId);
            if (!input || !area) return;

            input.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    archivos[sec.id] = e.target.files[0];
                    const container = document.getElementById(sec.previewId);
                    container.innerHTML = `
                        <div class="preview-item">
                            <img src="${URL.createObjectURL(archivos[sec.id])}" alt="${sec.id}">
                            <button class="btn-remove-img" data-sec="${sec.id}" data-tipo="nuevo">X</button>
                        </div>`;
                }
                e.target.value = '';
            });

            document.getElementById(sec.previewId).addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-remove-img');
                if (!btn || btn.dataset.sec !== sec.id) return;
                archivos[sec.id] = null;
                if (btn.dataset.tipo === 'nuevo') {
                    document.getElementById(sec.previewId).innerHTML = '';
                } else {
                    document.getElementById(sec.previewId).innerHTML = '';
                }
            });
        });
    }

    function guardarTodo() {
        abrirModalConfirmar(
            'Se guardarán los cambios en Misión, Visión y Valores.',
            ejecutarGuardado,
            'Guardar',
            'success'
        );
    }

    async function ejecutarGuardado() {
        try {
            for (const sec of SECCIONES) {
                const descripcion = document.getElementById(sec.descId).value.trim();
                let imagenUrl = null;

                if (archivos[sec.id]) {
                    const json = await subirArchivo(archivos[sec.id]);
                    if (json.success) imagenUrl = json.ruta;
                }

                const datos = { descripcion };
                if (imagenUrl) datos.imagen = imagenUrl;

                if (idsExistentes[sec.id]) {
                    const resPut = await apiPut(sec.tabla, idsExistentes[sec.id], datos);
                    if (!resPut.success) toast('Error al actualizar ' + sec.id, 'error');
                } else {
                    if (!datos.imagen) {
                        toast('Debe seleccionar una imagen para ' + sec.id, 'warning');
                        continue;
                    }
                    const res = await apiPost(sec.tabla, datos);
                    if (res.success) idsExistentes[sec.id] = res.id;
                }
            }

            archivos = { mision: null, vision: null, valores: null };
            SECCIONES.forEach(s => {
                document.getElementById(s.inputId).value = '';
                document.getElementById(s.descId).value = '';
                document.getElementById(s.previewId).innerHTML = '';
            });

            toast('Se ha guardado correctamente', 'success');

        } catch (e) {
            toast('Error al guardar: ' + e.message, 'error');
        }
    }

    return { init, guardarTodo };

})();
