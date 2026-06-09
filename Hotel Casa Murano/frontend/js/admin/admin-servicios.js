var api_servicios = (() => {

    let archivo = null;

    function init() {
        const ids = ['btn-anadir', 'btn-eliminar', 'eliminar-lista', 'form-servicio', 'servicio-input', 'servicio-upload-area', 'servicio-preview', 'servicio-nombre', 'servicio-descripcion'];
        const allExist = ids.every(id => document.getElementById(id));
        if (!allExist) return setTimeout(init, 50);

        archivo = null;
        document.getElementById('servicio-nombre').value = '';
        document.getElementById('servicio-descripcion').value = '';
        document.getElementById('servicio-input').value = '';
        document.getElementById('servicio-preview').innerHTML = '';
        document.getElementById('form-servicio').classList.remove('mostrar');
        document.getElementById('eliminar-lista').classList.remove('mostrar');
        document.getElementById('eliminar-lista').innerHTML = '';

        document.getElementById('btn-anadir').onclick = () => {
            limpiarFormulario();
            document.getElementById('form-servicio').classList.add('mostrar');
            document.getElementById('eliminar-lista').classList.remove('mostrar');
        };
        document.getElementById('btn-eliminar').onclick = mostrarEliminar;
        configurarUploads();
    }

    function configurarUploads() {
        const input = document.getElementById('servicio-input');
        const area = document.getElementById('servicio-upload-area');

        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                archivo = e.target.files[0];
                const container = document.getElementById('servicio-preview');
                container.innerHTML = `
                    <div class="preview-item">
                        <img src="${URL.createObjectURL(archivo)}" alt="servicio">
                        <button class="btn-remove-img" id="btn-remove-servicio">X</button>
                    </div>`;
            }
            e.target.value = '';
        });

        document.getElementById('servicio-preview').addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-img');
            if (!btn) return;
            archivo = null;
            document.getElementById('servicio-preview').innerHTML = '';
        });
    }

    async function guardar() {
        const nombre = document.getElementById('servicio-nombre').value.trim();
        const descripcion = document.getElementById('servicio-descripcion').value.trim();

        if (!nombre || !descripcion) {
            toast('Todos los campos son obligatorios', 'warning');
            return;
        }

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

            const datos = {
                nombre,
                descripcion,
                imagen: jsonImg.ruta
            };

            const res = await apiPost('servicios', datos);
            if (!res.success) {
                toast('Error al guardar el servicio', 'error');
                return;
            }

            limpiarFormulario();
            toast('Servicio guardado correctamente', 'success');

        } catch (e) {
            toast('Error al guardar: ' + e.message, 'error');
        }
    }

    function limpiarFormulario() {
        archivo = null;
        document.getElementById('servicio-nombre').value = '';
        document.getElementById('servicio-descripcion').value = '';
        document.getElementById('servicio-input').value = '';
        document.getElementById('servicio-preview').innerHTML = '';
        document.getElementById('form-servicio').classList.remove('mostrar');
    }

    async function mostrarEliminar() {
        limpiarFormulario();
        const contenedor = document.getElementById('eliminar-lista');

        try {
            const json = await apiGet('servicios');
            if (!json.success || !json.datos.length) {
                contenedor.innerHTML = '<p style="color:var(--text-muted);margin:0;">No hay servicios registrados.</p>';
                contenedor.classList.add('mostrar');
                return;
            }

            contenedor.innerHTML = json.datos.map(s => `
                <div class="eliminar-item">
                    <div class="eliminar-item-info">
                        <h4>${s.nombre}</h4>
                        <p>${s.descripcion}</p>
                    </div>
                    <button class="btn-eliminar-item" data-id="${s.id}">Eliminar</button>
                </div>
            `).join('');

            contenedor.classList.add('mostrar');

            contenedor.querySelectorAll('.btn-eliminar-item').forEach(btn => {
                btn.addEventListener('click', () => eliminar(btn.dataset.id));
            });
        } catch (e) {
            toast('Error al cargar servicios', 'error');
        }
    }

    async function eliminar(id) {
        abrirModalConfirmar('¿Eliminar este servicio?', async () => {
            try {
                const res = await apiDelete('servicios', id);
                if (res.success) {
                    toast('Servicio eliminado correctamente', 'success');
                    const contenedor = document.getElementById('eliminar-lista');
                    contenedor.classList.remove('mostrar');
                    contenedor.innerHTML = '';
                    limpiarFormulario();
                } else {
                    toast('Error al eliminar el servicio', 'error');
                }
            } catch (e) {
                toast('Error al eliminar: ' + e.message, 'error');
            }
        }, 'Eliminar', 'danger');
    }

    return { init, guardar };

})();
