var api_habitaciones = (() => {

    let archivo = null;

    function init() {
        const ids = ['btn-anadir', 'btn-eliminar', 'eliminar-lista', 'form-habitacion', 'habitacion-input', 'habitacion-upload-area', 'habitacion-preview', 'habitacion-nombre', 'habitacion-descripcion-primera', 'habitacion-descripcion-segunda', 'habitacion-precio', 'habitacion-capacidad'];
        const allExist = ids.every(id => document.getElementById(id));
        if (!allExist) return setTimeout(init, 50);

        archivo = null;
        ['habitacion-nombre', 'habitacion-descripcion-primera', 'habitacion-descripcion-segunda', 'habitacion-precio', 'habitacion-capacidad'].forEach(id => {
            document.getElementById(id).value = '';
        });
        document.getElementById('habitacion-input').value = '';
        document.getElementById('habitacion-preview').innerHTML = '';
        document.getElementById('form-habitacion').classList.remove('mostrar');
        document.getElementById('eliminar-lista').classList.remove('mostrar');
        document.getElementById('eliminar-lista').innerHTML = '';

        document.getElementById('btn-anadir').onclick = () => {
            limpiarFormulario();
            document.getElementById('form-habitacion').classList.add('mostrar');
            document.getElementById('eliminar-lista').classList.remove('mostrar');
        };
        document.getElementById('btn-eliminar').onclick = mostrarEliminar;
        configurarUploads();
    }

    function configurarUploads() {
        const input = document.getElementById('habitacion-input');
        const area = document.getElementById('habitacion-upload-area');

        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                archivo = e.target.files[0];
                const container = document.getElementById('habitacion-preview');
                container.innerHTML = `
                    <div class="preview-item">
                        <img src="${URL.createObjectURL(archivo)}" alt="habitacion">
                        <button class="btn-remove-img" id="btn-remove-habitacion">X</button>
                    </div>`;
            }
            e.target.value = '';
        });

        document.getElementById('habitacion-preview').addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-img');
            if (!btn) return;
            archivo = null;
            document.getElementById('habitacion-preview').innerHTML = '';
        });
    }

    async function guardar() {
        const nombre = document.getElementById('habitacion-nombre').value.trim();
        const descripcion_primera = document.getElementById('habitacion-descripcion-primera').value.trim();
        const descripcion_segunda = document.getElementById('habitacion-descripcion-segunda').value.trim();
        const precio = document.getElementById('habitacion-precio').value.trim();
        const capacidad = document.getElementById('habitacion-capacidad').value.trim();

        if (!nombre || !descripcion_primera || !descripcion_segunda || !precio || !capacidad) {
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
                descripcion_primera,
                descripcion_segunda,
                imagen: jsonImg.ruta,
                precio: Number(precio),
                capacidad: Number(capacidad)
            };

            const res = await apiPost('habitaciones', datos);
            if (!res.success) {
                toast('Error al guardar la habitación', 'error');
                return;
            }

            limpiarFormulario();
            toast('Habitación guardada correctamente', 'success');

        } catch (e) {
            toast('Error al guardar: ' + e.message, 'error');
        }
    }

    function limpiarFormulario() {
        archivo = null;
        ['habitacion-nombre', 'habitacion-descripcion-primera', 'habitacion-descripcion-segunda', 'habitacion-precio', 'habitacion-capacidad'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.getElementById('habitacion-input').value = '';
        document.getElementById('habitacion-preview').innerHTML = '';
        document.getElementById('form-habitacion').classList.remove('mostrar');
    }

    async function mostrarEliminar() {
        limpiarFormulario();
        const contenedor = document.getElementById('eliminar-lista');

        try {
            const json = await apiGet('habitaciones');
            if (!json.success || !json.datos.length) {
                contenedor.innerHTML = '<p style="color:var(--text-muted);margin:0;">No hay habitaciones registradas.</p>';
                contenedor.classList.add('mostrar');
                return;
            }

            contenedor.innerHTML = json.datos.map(h => `
                <div class="eliminar-item">
                    <div class="eliminar-item-info">
                        <h4>${h.nombre}</h4>
                        <p>Capacidad: ${h.capacidad} pers - $${Number(h.precio).toLocaleString('es-CO')}</p>
                    </div>
                    <button class="btn-eliminar-item" data-id="${h.id}">Eliminar</button>
                </div>
            `).join('');

            contenedor.classList.add('mostrar');

            contenedor.querySelectorAll('.btn-eliminar-item').forEach(btn => {
                btn.addEventListener('click', () => eliminar(btn.dataset.id));
            });
        } catch (e) {
            toast('Error al cargar habitaciones', 'error');
        }
    }

    async function eliminar(id) {
        abrirModalConfirmar('¿Eliminar esta habitación?', async () => {
            try {
                const res = await apiDelete('habitaciones', id);
                if (res.success) {
                    toast('Habitación eliminada correctamente', 'success');
                    const contenedor = document.getElementById('eliminar-lista');
                    contenedor.classList.remove('mostrar');
                    contenedor.innerHTML = '';
                    limpiarFormulario();
                } else {
                    toast('Error al eliminar la habitación', 'error');
                }
            } catch (e) {
                toast('Error al eliminar: ' + e.message, 'error');
            }
        }, 'Eliminar', 'danger');
    }

    return { init, guardar };

})();
