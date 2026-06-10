const API_BASE = '';

function verificarAuth() {
    if (!sessionStorage.getItem('auth_admin')) {
        window.location.replace('/frontend/pages/login.html');
        return;
    }
    const [entry] = performance.getEntriesByType('navigation');
    if (entry?.type === 'back_forward') {
        sessionStorage.removeItem('auth_admin');
        window.location.replace('/frontend/pages/login.html');
    }
}

verificarAuth();

window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
        sessionStorage.removeItem('auth_admin');
        window.location.replace('/frontend/pages/login.html');
    } else {
        verificarAuth();
    }
});

history.pushState(null, null, location.href);
window.addEventListener('popstate', function () {
    history.pushState(null, null, location.href);
});

let confirmCallback = null;

function salir() {
    sessionStorage.removeItem('auth_admin');
    window.location.replace('/frontend/pages/login.html');
}

function toggleSidebar() {
    document.querySelector('.admin-container').classList.toggle('sidebar-abierto');
    document.querySelector('.sidebar-toggle').classList.toggle('active');
}

function cerrarSidebarMovil() {
    const container = document.querySelector('.admin-container');
    if (container && container.classList.contains('sidebar-abierto')) {
        container.classList.remove('sidebar-abierto');
        document.querySelector('.sidebar-toggle')?.classList.remove('active');
    }
}

function cargarSeccion(nombre) {
    cerrarSidebarMovil();
    const panel = document.getElementById('panel-contenido');
    panel.innerHTML = '<div class="msj-cargando"><div class="spinner"></div><p>Cargando...</p></div>';

    document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('activo'));
    const btn = document.querySelector(`.sidebar button[data-sec="${nombre}"]`);
    if (btn) btn.classList.add('activo');

    fetch(`/frontend/pages/admin/${nombre}.html?_=${Date.now()}`)
        .then(r => {
            if (!r.ok) throw new Error('No encontrada');
            return r.text();
        })
        .then(html => {
            panel.innerHTML = html;
            cargarScript(`/frontend/js/admin/admin-${nombre}.js`);
        })
        .catch(() => {
            panel.innerHTML = `
                <h2>${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h2>
                <p style="color:var(--text-muted);font-family:var(--font-body);">
                    Sección en construcción.
                </p>`;
        });
}

function cargarScript(src) {
    const existing = document.querySelector(`script[src^="${src.split('?')[0]}"]`);
    if (existing) existing.remove();
    const sec = document.querySelector('.sidebar button.activo')?.dataset.sec;
    if (sec) delete window['api_' + sec];
    const s = document.createElement('script');
    s.src = src + '?_=' + Date.now();
    s.onload = () => {
        const fn = window['api_' + sec];
        if (typeof fn?.init === 'function') fn.init();
    };
    document.body.appendChild(s);
}

function abrirModalConfirmar(msg, cb, textoBoton = 'Eliminar', tipo = 'danger') {
    document.getElementById('modal-confirmar-title').textContent = textoBoton === 'Guardar' ? '¿Guardar cambios?' : '¿Eliminar registro?';
    document.getElementById('modal-confirmar-msg').textContent = msg;
    const btn = document.getElementById('modal-confirmar-btn');
    btn.textContent = textoBoton;
    btn.className = tipo === 'success' ? 'btn-guardar' : 'btn-eliminar';
    document.getElementById('modal-confirmar').classList.add('mostrar');
    confirmCallback = cb;
}

function cerrarModalConfirmar() {
    document.getElementById('modal-confirmar').classList.remove('mostrar');
    confirmCallback = null;
}

document.getElementById('modal-confirmar-btn')?.addEventListener('click', () => {
    if (typeof confirmCallback === 'function') confirmCallback();
    cerrarModalConfirmar();
});

function toast(mensaje, tipo = 'success') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast ' + tipo;
    el.textContent = mensaje;
    container.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s';
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

function getAuthHeaders(extra = {}) {
    const token = sessionStorage.getItem('auth_admin');
    return token ? { ...extra, 'Authorization': 'Bearer ' + token } : extra;
}

async function apiGet(tabla) {
    const r = await fetch(`${API_BASE}/api/${tabla}?_=${Date.now()}`, {
        headers: getAuthHeaders()
    });
    if (r.status === 401) { sessionStorage.removeItem('auth_admin'); window.location.replace('/frontend/pages/login.html'); return; }
    return r.json();
}

async function apiPost(tabla, datos) {
    const r = await fetch(`${API_BASE}/api/${tabla}`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(datos)
    });
    if (r.status === 401) { sessionStorage.removeItem('auth_admin'); window.location.replace('/frontend/pages/login.html'); return; }
    return r.json();
}

async function apiPut(tabla, id, datos) {
    const r = await fetch(`${API_BASE}/api/${tabla}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(datos)
    });
    if (r.status === 401) { sessionStorage.removeItem('auth_admin'); window.location.replace('/frontend/pages/login.html'); return; }
    return r.json();
}

async function apiDelete(tabla, id) {
    const r = await fetch(`${API_BASE}/api/${tabla}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (r.status === 401) { sessionStorage.removeItem('auth_admin'); window.location.replace('/frontend/pages/login.html'); return; }
    return r.json();
}

async function subirArchivo(file) {
    const fd = new FormData();
    fd.append('imagen', file);
    const r = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: fd
    });
    if (r.status === 401) { sessionStorage.removeItem('auth_admin'); window.location.replace('/frontend/pages/login.html'); return; }
    return r.json();
}

cargarSeccion('inicio');
