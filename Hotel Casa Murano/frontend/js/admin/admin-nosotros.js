// ============================================================
// NOSOTROS
// ============================================================

async function cargarNosotros() {
  const res = await apiGet('nosotros');
  if (res.success && res.datos.length > 0) {
    const d = res.datos[0];
    document.getElementById('nosotros-titulo').value = d.titulo || '';
    document.getElementById('nosotros-subtitulo').value = d.subtitulo || '';
    document.getElementById('nosotros-descripcion').value = d.descripcion || '';
    document.getElementById('nosotros-imagen').value = d.imagen || '';
    document.getElementById('nosotros-mision').value = d.mision || '';
    document.getElementById('nosotros-mision-imagen').value = d.mision_imagen || '';
    document.getElementById('nosotros-vision').value = d.vision || '';
    document.getElementById('nosotros-vision-imagen').value = d.vision_imagen || '';
    document.getElementById('nosotros-valores').value = d.valores || '';
    document.getElementById('nosotros-valores-imagen').value = d.valores_imagen || '';

    mostrarPreviewImg('nosotros-img-preview', 'nosotros-img-nombre', d.imagen);
    mostrarPreviewImg('nosotros-mision-preview', 'nosotros-mision-nombre', d.mision_imagen);
    mostrarPreviewImg('nosotros-vision-preview', 'nosotros-vision-nombre', d.vision_imagen);
    mostrarPreviewImg('nosotros-valores-preview', 'nosotros-valores-nombre', d.valores_imagen);
  }
  configurarUpload('nosotros-img-input', 'nosotros-img-preview', 'nosotros-img-nombre', 'nosotros-imagen');
  configurarUpload('nosotros-mision-input', 'nosotros-mision-preview', 'nosotros-mision-nombre', 'nosotros-mision-imagen');
  configurarUpload('nosotros-vision-input', 'nosotros-vision-preview', 'nosotros-vision-nombre', 'nosotros-vision-imagen');
  configurarUpload('nosotros-valores-input', 'nosotros-valores-preview', 'nosotros-valores-nombre', 'nosotros-valores-imagen');
}

function mostrarPreviewImg(previewId, nombreId, url) {
  if (!url) return;
  const preview = document.getElementById(previewId);
  const nombreEl = document.getElementById(nombreId);
  if (preview) {
    preview.style.display = 'flex';
    preview.querySelector('img').src = url;
  }
  if (nombreEl) nombreEl.textContent = url.split('/').pop();
}

async function guardarNosotros() {
  const data = {
    titulo: document.getElementById('nosotros-titulo').value,
    subtitulo: document.getElementById('nosotros-subtitulo').value,
    descripcion: document.getElementById('nosotros-descripcion').value,
    imagen: document.getElementById('nosotros-imagen').value,
    mision: document.getElementById('nosotros-mision').value,
    mision_imagen: document.getElementById('nosotros-mision-imagen').value,
    vision: document.getElementById('nosotros-vision').value,
    vision_imagen: document.getElementById('nosotros-vision-imagen').value,
    valores: document.getElementById('nosotros-valores').value,
    valores_imagen: document.getElementById('nosotros-valores-imagen').value
  };

  const res = await apiGet('nosotros');
  let r;
  if (res.success && res.datos.length > 0) {
    r = await apiPut('nosotros', res.datos[0].id, data);
  } else {
    r = await apiPost('nosotros', data);
  }
  if (r.success) {
    toast('Información guardada', 'exito');
    limpiarFormularioNosotros();
  } else {
    toast('Error al guardar', 'error');
  }
}

function removerNosotrosImg(tipo) {
  const preview = document.getElementById('nosotros-' + tipo + '-preview');
  const nombreEl = document.getElementById('nosotros-' + tipo + '-nombre');
  const hiddenId = tipo === 'img' ? 'nosotros-imagen' : 'nosotros-' + tipo + '-imagen';
  const hidden = document.getElementById(hiddenId);
  const input = document.getElementById('nosotros-' + tipo + '-input');

  if (preview) { preview.style.display = 'none'; preview.querySelector('img').src = ''; }
  if (nombreEl) nombreEl.textContent = '';
  if (hidden) hidden.value = '';
  if (input) input.value = '';
}

function limpiarFormularioNosotros() {
  document.getElementById('nosotros-titulo').value = '';
  document.getElementById('nosotros-subtitulo').value = '';
  document.getElementById('nosotros-descripcion').value = '';
  document.getElementById('nosotros-mision').value = '';
  document.getElementById('nosotros-vision').value = '';
  document.getElementById('nosotros-valores').value = '';
  removerNosotrosImg('img');
  removerNosotrosImg('mision');
  removerNosotrosImg('vision');
  removerNosotrosImg('valores');
}

// Init
cargarNosotros();
