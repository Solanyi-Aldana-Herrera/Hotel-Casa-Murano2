var api_inicio = (() => {

    let slidersSeleccionados = [];
    let slidersActuales = [];

    function init() {
        const slidersInput = document.getElementById('sliders-input');
        if (!slidersInput) return setTimeout(init, 50);
        slidersSeleccionados = [];
        slidersInput.value = '';
        document.getElementById('sliders-preview').innerHTML = '';
        configurarUploads();
        cargarSliders();
    }

    async function cargarSliders() {
        try {
            const json = await apiGet('sliders');
            if (json.success) {
                slidersActuales = json.datos || [];
            }
        } catch (e) {
            slidersActuales = [];
        }
    }

    function configurarUploads() {
        const slidersInput = document.getElementById('sliders-input');

        slidersInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            const disponibles = 5 - slidersSeleccionados.length;
            const aAgregar = files.slice(0, disponibles);
            slidersSeleccionados = slidersSeleccionados.concat(aAgregar);
            renderSlidersPreview();
            e.target.value = '';
        });

        document.getElementById('sliders-preview').addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-img');
            if (!btn) return;
            const idx = parseInt(btn.dataset.index);
            if (!isNaN(idx)) {
                slidersSeleccionados.splice(idx, 1);
                renderSlidersPreview();
            }
        });
    }

    function renderSlidersPreview() {
        const container = document.getElementById('sliders-preview');
        container.innerHTML = slidersSeleccionados.map((file, i) => `
            <div class="slider-preview-item">
                <img src="${URL.createObjectURL(file)}" alt="Slider ${i + 1}">
                <button class="btn-remove-img" data-index="${i}">X</button>
            </div>
        `).join('');
    }

    function guardarTodo() {
        abrirModalConfirmar(
            'Se guardarán los cambios en el slider.',
            ejecutarGuardado,
            'Guardar',
            'success'
        );
    }

    async function ejecutarGuardado() {
        try {
            const nuevasRutas = [];
            for (const file of slidersSeleccionados) {
                const json = await subirArchivo(file);
                if (json.success) nuevasRutas.push(json.ruta);
            }

            for (const s of slidersActuales) {
                await apiDelete('sliders', s.id);
            }

            for (const ruta of nuevasRutas) {
                await apiPost('sliders', { imagen: ruta });
            }

            slidersSeleccionados = [];
            document.getElementById('sliders-input').value = '';
            document.getElementById('sliders-preview').innerHTML = '';
            await cargarSliders();

            toast('Se ha guardado correctamente', 'success');

        } catch (e) {
            toast('Error al guardar: ' + e.message, 'error');
        }
    }

    return { init, guardarTodo };

})();
