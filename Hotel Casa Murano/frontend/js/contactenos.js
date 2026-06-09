async function cargarContacto() {
    try {
        const r = await fetch('/api/informacion_contacto?_=' + Date.now());
        const json = await r.json();
        if (!json.success || !json.datos.length) return;

        const d = json.datos[0];

        const textoEl = document.getElementById('contacto-texto');
        if (textoEl) {
            textoEl.innerHTML = `Celular: ${d.celular}<br>Email: ${d.email}<br>Dirección: ${d.direccion}`;
        }

        const iframeEl = document.getElementById('mapa-iframe');
        if (iframeEl && d.mapa_iframe) {
            const match = d.mapa_iframe.match(/src=["']([^"']+)["']/);
            iframeEl.src = match ? match[1] : d.mapa_iframe;
        }

        const dirEl = document.getElementById('footer-direccion');
        const emailEl = document.getElementById('footer-email');
        const telEl = document.getElementById('footer-telefono');
        if (dirEl) dirEl.innerText = d.direccion;
        if (emailEl) emailEl.innerText = d.email;
        if (telEl) telEl.innerText = d.celular;
    } catch (e) {}
}
