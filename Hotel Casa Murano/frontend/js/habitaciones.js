let habitacionesData = [];

// ABRIR MODAL
function abrirModal(titulo, texto, capacidad, precio){

    document.getElementById("tituloModal").innerText = titulo;
    document.getElementById("textoModal").innerText = texto;

    const capEl = document.getElementById("capacidadModal");
    const preEl = document.getElementById("precioModal");
    if (capEl) capEl.innerText = capacidad != null ? capacidad : '';
    if (preEl) preEl.innerText = precio != null ? Number(precio).toLocaleString('es-CO') : '';

    document.getElementById("modalHabitacion").style.display = "flex";
}

// CERRAR MODAL
function cerrarModal(){

    document.getElementById("modalHabitacion").style.display = "none";
}

// CERRAR AL DAR CLICK AFUERA
window.onclick = function(event){

    let modal = document.getElementById("modalHabitacion");

    if(event.target == modal){

        modal.style.display = "none";
    }
}

// CARGAR HABITACIONES DESDE LA API
async function cargarHabitaciones() {
    try {
        const r = await fetch('/api/habitaciones?_=' + Date.now());
        const json = await r.json();
        if (!json.success) return;

        const contenedor = document.getElementById('catalogo-habitaciones');
        if (!contenedor) return;

        habitacionesData = json.datos;

        contenedor.innerHTML = json.datos.map((h, i) => `
            <article>
                <h4>${h.nombre}</h4>
                <img src="${h.imagen}" alt="${h.nombre}">
                <p>${h.descripcion_primera}</p>
                <button class="ver" data-index="${i}">Ver m&aacute;s</button>
                <button class="btn-reserva2" onclick="window.location.href='/frontend/pages/reserva.html'">Reserva</button>
            </article>
        `).join('');

        contenedor.addEventListener('click', (e) => {
            const btn = e.target.closest('.ver');
            if (!btn) return;
            const h = habitacionesData[btn.dataset.index];
            if (h) abrirModal(h.nombre, h.descripcion_segunda, h.capacidad, h.precio);
        });

    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', cargarHabitaciones);

