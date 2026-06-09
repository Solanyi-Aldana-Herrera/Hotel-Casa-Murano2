var api_otros = (() => {

    let idExistente = null;

    function init() {
        const ids = ['form-redes', 'redes-facebook', 'redes-instagram', 'redes-whatsapp'];
        const allExist = ids.every(id => document.getElementById(id));
        if (!allExist) return setTimeout(init, 50);

        idExistente = null;
        ['redes-facebook', 'redes-instagram', 'redes-whatsapp'].forEach(id => {
            document.getElementById(id).value = '';
        });

        cargarExistente();
    }

    async function cargarExistente() {
        try {
            const json = await apiGet('redes');
            if (json.success && json.datos.length > 0) {
                idExistente = json.datos[0].id;
            }
        } catch (e) {}
    }

    async function guardar() {
        const facebook = document.getElementById('redes-facebook').value.trim();
        const instagram = document.getElementById('redes-instagram').value.trim();
        const whatsapp = document.getElementById('redes-whatsapp').value.trim();

        if (!facebook || !instagram || !whatsapp) {
            toast('Todos los campos son obligatorios', 'warning');
            return;
        }

        const datos = { facebook, instagram, whatsapp };

        try {
            let res;
            if (idExistente) {
                res = await apiPut('redes', idExistente, datos);
            } else {
                res = await apiPost('redes', datos);
            }

            if (!res.success) {
                toast('Error al guardar las redes sociales', 'error');
                return;
            }

            if (res.id) idExistente = res.id;

            limpiarFormulario();
            toast('Redes sociales guardadas correctamente', 'success');

        } catch (e) {
            toast('Error al guardar: ' + e.message, 'error');
        }
    }

    function limpiarFormulario() {
        ['redes-facebook', 'redes-instagram', 'redes-whatsapp'].forEach(id => {
            document.getElementById(id).value = '';
        });
        idExistente = null;
    }

    return { init, guardar };

})();
