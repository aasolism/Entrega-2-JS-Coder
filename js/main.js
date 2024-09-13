document.addEventListener('DOMContentLoaded', function() {
  cargarPartidos();
  cargarCarritoDeLocalStorage();  // Cargar el carrito guardado al cargar la página
});

let cart = [];

// Cargar el carrito desde localStorage cuando se carga la página
function cargarCarritoDeLocalStorage() {
  const storedCart = JSON.parse(localStorage.getItem('cart'));
  if (storedCart && storedCart.length > 0) {
      cart = storedCart; // Si el carrito existe en localStorage, se carga en la variable cart
  }
}

const partidos = [
  { nombre: "Real San Joaquín vs San Antonio Unido", fecha: "Sábado 14 de septiembre", hora: "12:00", lugar: "Estadio Municipal de San Joaquín", precioGeneral: 5000, precioVIP: 10000, imagen: './img/p1.png' },
  { nombre: "Deportes Melipilla vs Rengo", fecha: "Sábado 14 de septiembre", hora: "15:00", lugar: "Estadio Soinca Bata", precioGeneral: 5500, precioVIP: 11000, imagen: './img/p2.png' },
  { nombre: "Deportes Linares vs Provincial Osorno", fecha: "Sábado 14 de septiembre", hora: "17:30", lugar: "Estadio Fiscal Tucapel Bustamante", precioGeneral: 5000, precioVIP: 10000, imagen: './img/p3.png' },
  { nombre: "Deportes Puerto Montt vs Lautaro de Buín", fecha: "Domingo 15 de Septiembre", hora: "12:00", lugar: "Estadio Bicentenario Chinquihue", precioGeneral: 4500, precioVIP: 9000, imagen: './img/p4.png' },
  { nombre: "General Velásquez vs Fernández Vial", fecha: "Domingo 15 de Septiembre", hora: "15:00", lugar: "Estadio Municipal Augusto Rodríguez", precioGeneral: 5500, precioVIP: 11000, imagen: './img/p5.png' },
  { nombre: "Deportes Concepción vs Trasandino", fecha: "Domingo 15 de Septiembre", hora: "17:30", lugar: "Estadio Ester Roa Rebolledo", precioGeneral: 5500, precioVIP: 11000, imagen: './img/p6.png' },
  { nombre: "Concón National vs Provincial Ovalle", fecha: "Domingo 29 de Septiembre", hora: "15:00", lugar: "Por Confirmar", precioGeneral: 5000, precioVIP: 10000, imagen: './img/p7.png' }
];

// Cargar partidos como tarjetas dinámicamente
function cargarPartidos() {
  const eventCardsContainer = document.getElementById('event-cards');

  eventCardsContainer.innerHTML = partidos.map((partido, index) => `
      <div class="event-card">
          <img src="${partido.imagen}" alt="${partido.nombre}" class="event-img">
          <h3>${partido.nombre}</h3>
          <p>${partido.fecha} - ${partido.hora}</p>
          <p>Estadio: ${partido.lugar}</p>
          <p>Precio General: $${partido.precioGeneral} | VIP: $${partido.precioVIP}</p>
          
          <label for="cantidad-${index}">Cantidad de entradas:</label>
          <input type="number" id="cantidad-${index}" min="1" value="1">

          <label for="tipo-${index}">Tipo de entrada:</label>
          <select id="tipo-${index}">
              <option value="general">General</option>
              <option value="vip">VIP</option>
          </select>

          <button class="btn-agregar" data-index="${index}">Agregar al Carrito</button>
      </div>
  `).join('');

  document.querySelectorAll('.btn-agregar').forEach(btn => {
      btn.addEventListener('click', function() {
          agregarAlCarrito(parseInt(this.dataset.index));
      });
  });

  // Asegurar que se valide el número de entradas
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
      validarNumero(this);  // Llamar a la función para validar el número
    });
  });
}

// Función para validar que solo se ingresen números positivos y mayores a 0
function validarNumero(input) {
  // Eliminar caracteres no numéricos
  input.value = input.value.replace(/[^0-9]/g, '');

  // Validar que el valor sea mayor o igual a 1
  if (parseInt(input.value) < 1 || input.value === '') {
    input.value = 1;  // Cambiar a 1 si el valor es inválido
  }
}

// Función para agregar productos al carrito
function agregarAlCarrito(index) {
  const partidoSeleccionado = partidos[index];
  const cantidad = parseInt(document.getElementById(`cantidad-${index}`).value);
  const tipoEntrada = document.getElementById(`tipo-${index}`).value;
  const precio = tipoEntrada === 'vip' ? partidoSeleccionado.precioVIP : partidoSeleccionado.precioGeneral;
  const total = precio * cantidad;

  // Verificar si la cantidad es válida
  if (isNaN(cantidad) || cantidad <= 0) {
      mostrarMensaje("Por favor ingresa una cantidad válida de entradas.");
      return;
  }

  // Verificar si el producto ya está en el carrito
  const productoExistente = cart.find(item => item.partido === partidoSeleccionado.nombre && item.tipo === tipoEntrada);
  
  if (productoExistente) {
      // Si el producto ya existe, actualizar la cantidad y el total
      productoExistente.cantidad += cantidad;
      productoExistente.total += total;
  } else {
      // Si el producto no existe, agregarlo como nuevo producto
      cart.push({
          partido: partidoSeleccionado.nombre,
          tipo: tipoEntrada,
          cantidad,
          total,
          precioVIP: partidoSeleccionado.precioVIP,
          precioGeneral: partidoSeleccionado.precioGeneral
      });
  }

  guardarCarrito();  // Guardar el carrito actualizado en localStorage
}

// Guardar el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje) {
  const mensajeContainer = document.createElement('div');
  mensajeContainer.textContent = mensaje;
  mensajeContainer.style.color = "red";
  document.body.appendChild(mensajeContainer);
  setTimeout(() => {
      mensajeContainer.remove();
  }, 3000);
}
