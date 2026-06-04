// ============================================================
// INICIO — BIENVENIDA (CRUD)
// ============================================================

async function cargarBienvenida() {
  const tbody = document.getElementById('bienvenida-body');
  if (!tbody) { console.error('No se encontró el elemento bienvenida-body'); return; }
  tbody.innerHTML = '<tr><td colspan="6" class="vacio">Cargando...</td></tr>';
  const res = await apiGet('bienvenida');
  if (!res.success) { tbody.innerHTML = '<tr><td colspan="6" class="vacio">Error al cargar</td></tr>'; return; }
  if (res.datos.length === 0) { tbody.innerHTML = '<tr><td colspan="6" class="vacio">Sin datos</td></tr>'; return; }
  tbody.innerHTML = res.datos.map(d => `
    <tr>
      <td>${d.imagen ? `<img src="${d.imagen}" class="imagen-tabla">` : '—'}</td>
      <td>${d.titulo || '—'}</td>
      <td>${d.subtitulo || '—'}</td>
      <td>${d.descripcion ? d.descripcion.substring(0, 80) + (d.descripcion.length > 80 ? '...' : '') : '—'}</td>
      <td>${d.despedida || '—'}</td>
      <td class="td-acciones">
        <div class="acciones">
          <button class="btn-accion editar" onclick="editarBienvenida(${d.id})" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-accion eliminar" onclick="eliminarBienvenida(${d.id})" title="Eliminar">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  configurarUpload('bienvenida-img-input', 'bienvenida-img-preview', 'bienvenida-img-nombre', 'bienvenida-imagen');
}

function abrirFormBienvenida(data) {
  const form = document.getElementById('form-bienvenida');
  form.style.display = 'block';
  if (data) {
    document.getElementById('bienvenida-form-titulo').textContent = 'Editar Bienvenida';
    document.getElementById('bienvenida-id').value = data.id;
    document.getElementById('bienvenida-titulo').value = data.titulo || '';
    document.getElementById('bienvenida-subtitulo').value = data.subtitulo || '';
    document.getElementById('bienvenida-descripcion').value = data.descripcion || '';
    document.getElementById('bienvenida-despedida').value = data.despedida || '';
    document.getElementById('bienvenida-imagen').value = data.imagen || '';
    if (data.imagen) {
      const preview = document.getElementById('bienvenida-img-preview');
      preview.style.display = 'flex';
      preview.querySelector('img').src = data.imagen;
      document.getElementById('bienvenida-img-nombre').textContent = data.imagen.split('/').pop();
    }
  } else {
    document.getElementById('bienvenida-form-titulo').textContent = 'Nueva Bienvenida';
    document.getElementById('bienvenida-id').value = '';
    limpiarFormBienvenida();
  }
  form.scrollIntoView({ behavior: 'smooth' });
}

function cerrarFormBienvenida() {
  document.getElementById('form-bienvenida').style.display = 'none';
}

async function guardarBienvenida() {
  const id = document.getElementById('bienvenida-id').value;
  const data = {
    titulo: document.getElementById('bienvenida-titulo').value,
    subtitulo: document.getElementById('bienvenida-subtitulo').value,
    descripcion: document.getElementById('bienvenida-descripcion').value,
    despedida: document.getElementById('bienvenida-despedida').value,
    imagen: document.getElementById('bienvenida-imagen').value
  };
  const r = id ? await apiPut('bienvenida', id, data) : await apiPost('bienvenida', data);
  if (r.success) { toast('Bienvenida guardada', 'exito'); cerrarFormBienvenida(); cargarBienvenida(); }
  else toast('Error al guardar', 'error');
}

function limpiarFormBienvenida() {
  document.getElementById('bienvenida-titulo').value = '';
  document.getElementById('bienvenida-subtitulo').value = '';
  document.getElementById('bienvenida-descripcion').value = '';
  document.getElementById('bienvenida-despedida').value = '';
  removerBienvenidaImg();
}

function removerBienvenidaImg() {
  const preview = document.getElementById('bienvenida-img-preview');
  const nombreEl = document.getElementById('bienvenida-img-nombre');
  const hidden = document.getElementById('bienvenida-imagen');
  const input = document.getElementById('bienvenida-img-input');
  if (preview) {
    preview.style.display = 'none';
    preview.querySelector('img').src = '';
  }
  if (nombreEl) nombreEl.textContent = '';
  if (hidden) hidden.value = '';
  if (input) input.value = '';
}

async function editarBienvenida(id) {
  const res = await apiGet('bienvenida', id);
  if (res.success) abrirFormBienvenida(res.dato);
}

function eliminarBienvenida(id) {
  abrirModalConfirmar('¿Eliminar esta bienvenida?', async () => {
    const r = await apiDelete('bienvenida', id);
    if (r.success) { toast('Bienvenida eliminada', 'exito'); cargarBienvenida(); }
    else toast('Error al eliminar', 'error');
  });
}

// Init
cargarBienvenida();
