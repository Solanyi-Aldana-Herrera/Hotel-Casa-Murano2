function abrirImagen(src) {
  const modal = document.getElementById("modalGaleria");
  const grande = document.getElementById("imagenGrande");
  const ribbon = document.getElementById("modalRibbon");

  const imagenes = Array.from(document.querySelectorAll(".gallery-grid img"));
  const index = imagenes.findIndex(img => img.src === src);

  grande.src = src;

  ribbon.innerHTML = "";
  imagenes.forEach((img, i) => {
    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.alt = img.alt || "";
    if (i === index) thumb.classList.add("active");
    thumb.addEventListener("click", function () {
      abrirImagen(this.src);
    });
    ribbon.appendChild(thumb);
  });

  modal.style.display = "flex";
  ribbon.scrollLeft = Math.max(0, (index - 2) * 90);
}

document.querySelector(".modal-close").onclick = function () {
  document.getElementById("modalGaleria").style.display = "none";
};

window.onclick = function (event) {
  const modal = document.getElementById("modalGaleria");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// CARGAR GALERÍA DESDE LA API
async function cargarGaleria() {
    try {
        const r = await fetch('/api/galeria?_=' + Date.now());
        const json = await r.json();
        if (!json.success) return;

        const grid = document.getElementById('gallery-grid');
        if (!grid) return;

        grid.innerHTML = json.datos.map(g => `
            <img src="${g.imagen}" alt="galeria" onclick="abrirImagen(this.src)">
        `).join('');
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', cargarGaleria);

document.getElementById("modalPrev").addEventListener("click", function () {
  const imagenes = document.querySelectorAll(".gallery-grid img");
  const ribbon = document.getElementById("modalRibbon");
  const thumbs = ribbon.querySelectorAll("img");
  const active = ribbon.querySelector("img.active");
  let idx = Array.from(thumbs).indexOf(active);
  idx = (idx - 1 + imagenes.length) % imagenes.length;
  abrirImagen(imagenes[idx].src);
});

document.getElementById("modalNext").addEventListener("click", function () {
  const imagenes = document.querySelectorAll(".gallery-grid img");
  const ribbon = document.getElementById("modalRibbon");
  const thumbs = ribbon.querySelectorAll("img");
  const active = ribbon.querySelector("img.active");
  let idx = Array.from(thumbs).indexOf(active);
  idx = (idx + 1) % imagenes.length;
  abrirImagen(imagenes[idx].src);
});
