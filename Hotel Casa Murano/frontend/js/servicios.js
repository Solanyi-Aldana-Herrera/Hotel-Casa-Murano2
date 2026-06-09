// ABRIR IMAGEN
function abrirImagen(src){

    document.getElementById("modalGaleria").style.display = "flex";

    document.getElementById("imagenGrande").src = src;
}

// CERRAR IMAGEN
document.querySelector(".modal-close").onclick = function(){

    document.getElementById("modalGaleria").style.display = "none";
}

// CERRAR AL DAR CLICK AFUERA
window.onclick = function(event){

    let modal = document.getElementById("modalGaleria");

    if(event.target == modal){

        modal.style.display = "none";
    }
}

// CARGAR SERVICIOS DESDE LA API
async function cargarServicios() {
    try {
        const r = await fetch('/api/servicios?_=' + Date.now());
        const json = await r.json();
        if (!json.success) return;

        const contenedor = document.getElementById('contenedor-servicios');
        if (!contenedor) return;

        contenedor.innerHTML = json.datos.map((s, i) => `
            <div class="servicio-wrapper" style="display:flex;align-items:flex-start;justify-content:center;gap:60px;width:100%;flex-direction:${i % 2 === 0 ? 'row' : 'row-reverse'}">
                <div class="${i % 2 === 0 ? 'uno' : 'dos'}">
                    <h4>${s.nombre}</h4>
                    <p>${s.descripcion}</p>
                </div>
                <div style="max-width:430px;width:100%;max-height:330px;height:100%;">
                    <img src="${s.imagen}" onclick="abrirImagen(this.src)" style="max-width:430px;width:100%;height:330px;object-fit:cover;border-radius:8px;transition:all 0.4s ease;cursor:pointer;">
                </div>
            </div>
        `).join('');
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', cargarServicios);