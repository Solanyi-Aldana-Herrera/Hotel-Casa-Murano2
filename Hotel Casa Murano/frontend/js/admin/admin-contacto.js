var api_contacto = (() => {

    let idExistente = null;

    function init() {
        const ids = ['form-contacto', 'contacto-celular', 'contacto-email', 'contacto-direccion', 'contacto-mapa'];
        const allExist = ids.every(id => document.getElementById(id));
        if (!allExist) return setTimeout(init, 50);

        idExistente = null;
        ['contacto-celular', 'contacto-email', 'contacto-direccion', 'contacto-mapa'].forEach(id => {
            document.getElementById(id).value = '';
        });

        cargarExistente();
    }

    async function cargarExistente() {
        try {
            const json = await apiGet('informacion_contacto');
            if (json.success && json.datos.length > 0) {
                idExistente = json.datos[0].id;
            }
        } catch (e) {}
    }

    function extraerUrlIframe(valor) {
        const match = valor.match(/src=["']([^"']+)["']/);
        return match ? match[1] : valor;
    }

    async function guardar() {
        const celular = document.getElementById('contacto-celular').value.trim();
        const email = document.getElementById('contacto-email').value.trim();
        const direccion = document.getElementById('contacto-direccion').value.trim();
        const mapa_iframe = extraerUrlIframe(document.getElementById('contacto-mapa').value.trim());

        if (!celular || !email || !direccion || !mapa_iframe) {
            toast('Todos los campos son obligatorios', 'warning');
            return;
        }

        const datos = { celular, email, direccion, mapa_iframe };

        try {
            let res;
            if (idExistente) {
                res = await apiPut('informacion_contacto', idExistente, datos);
            } else {
                res = await apiPost('informacion_contacto', datos);
            }

            if (!res.success) {
                toast('Error al guardar la información de contacto', 'error');
                return;
            }

            if (res.id) idExistente = res.id;

            limpiarFormulario();
            toast('Información de contacto guardada correctamente', 'success');

        } catch (e) {
            toast('Error al guardar: ' + e.message, 'error');
        }
    }

    function limpiarFormulario() {
        ['contacto-celular', 'contacto-email', 'contacto-direccion', 'contacto-mapa'].forEach(id => {
            document.getElementById(id).value = '';
        });
        idExistente = null;
    }

    return { init, guardar };

})();
