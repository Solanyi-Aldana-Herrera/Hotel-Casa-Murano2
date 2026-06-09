var api_galeria = (() => {

    let archivo = null;

    function init() {
        const ids = ['btn-anadir', 'btn-eliminar', 'eliminar-lista', 'form-galeria', 'galeria-input', 'galeria-upload-area', 'galeria-preview'];
        const allExist = ids.every(id => document.getElementById(id));
        if (!allExist) return setTimeout(init, 50);

        archivo = null;
        document.getElementById('galeria-input').value = '';
        document.getElementById('galeria-preview').innerHTML = '';
        document.getElementById('form-galeria').classList.remove('mostrar');
        document.getElementById('eliminar-lista').classList.remove('mostrar');
        document.getElementById('eliminar-lista').innerHTML = '';

        document.getElementById('btn-anadir').onclick = () => {
            limpiarFormulario();
            document.getElementById('form-galeria').classList.add('mostrar');
            document.getElementById('eliminar-lista').classList.remove('mostrar');
        };
        document.getElementById('btn-eliminar').onclick = mostrarEliminar;
        configurarUploads();
    }

    function configurarUploads() {
        const input = document.getElementById('galeria-input');
        const area = document.getElementById('galeria-upload-area');

        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                archivo = e.target.files[0];
                const container = document.getElementById('galeria-preview');
                container.innerHTML = `
                    <div class="preview-item">
                        <img src="${URL.createObjectURL(archivo)}" alt="galeria">
                        <button class="btn-remove-img" id="btn-remove-galeria">X</button>
                    </div>`;
            }
            e.target.value = '';
        });

        document.getElementById('galeria-preview').addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-img');
            if (!btn) return;
            archivo = null;
            document.getElementById('galeria-preview').innerHTML = '';
        });
    }

    async function guardar() {
        if (!archivo) {
            toast('Debe seleccionar una imagen', 'warning');
            return;
        }

        try {
            const jsonImg = await subirArchivo(archivo);
            if (!jsonImg.success) {
                toast('Error al subir la imagen', 'error');
                return;
            }

            const datos = { imagen: jsonImg.ruta };

            const res = await apiPost('galeria', datos);
            if (!res.success) {
                toast('Error al guardar la imagen', 'error');
                return;
            }

            limpiarFormulario();
            toast('Imagen guardada correctamente', 'success');

        } catch (e) {
            toast('Error al guardar: ' + e.message, 'error');
        }
    }

    function limpiarFormulario() {
        archivo = null;
        document.getElementById('galeria-input').value = '';
        document.getElementById('galeria-preview').innerHTML = '';
        document.getElementById('form-galeria').classList.remove('mostrar');
    }

    async function mostrarEliminar() {
        limpiarFormulario();
        const contenedor = document.getElementById('eliminar-lista');

        try {
            const json = await apiGet('galeria');
            if (!json.success || !json.datos.length) {
                contenedor.innerHTML = '<p style="color:var(--text-muted);margin:0;">No hay imágenes registradas.</p>';
                contenedor.classList.add('mostrar');
                return;
            }

            contenedor.innerHTML = json.datos.map(g => `
                <div class="eliminar-item">
                    <img src="${g.imagen}" alt="galeria">
                    <button class="btn-eliminar-item" data-id="${g.id}">Eliminar</button>
                </div>
            `).join('');

            contenedor.classList.add('mostrar');

            contenedor.querySelectorAll('.btn-eliminar-item').forEach(btn => {
                btn.addEventListener('click', () => eliminar(btn.dataset.id));
            });
        } catch (e) {
            toast('Error al cargar imágenes', 'error');
        }
    }

    async function eliminar(id) {
        abrirModalConfirmar('¿Eliminar esta imagen?', async () => {
            try {
                const res = await apiDelete('galeria', id);
                if (res.success) {
                    toast('Imagen eliminada correctamente', 'success');
                    const contenedor = document.getElementById('eliminar-lista');
                    contenedor.classList.remove('mostrar');
                    contenedor.innerHTML = '';
                    limpiarFormulario();
                } else {
                    toast('Error al eliminar la imagen', 'error');
                }
            } catch (e) {
                toast('Error al eliminar: ' + e.message, 'error');
            }
        }, 'Eliminar', 'danger');
    }

    return { init, guardar };

})();
