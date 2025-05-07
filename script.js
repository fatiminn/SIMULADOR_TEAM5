
const gemelo = document.getElementById("gemeloViajero");
const velocidadText = document.getElementById("velocidadViajero");
const tiempoViajeroText = document.getElementById("tiempoViajero");
const tiempoTierraText = document.getElementById("tiempoTierra");
const relojViajero = document.getElementById("relojViajero");

let offsetX, isDragging = false;
let contenedorWidth = 300;
let velocidad = 0;
let tiempoTierra = 0;
let tiempoViajero = 0;
let intervalo;

const dataTierra = [];
const dataViajero = [];
const etiquetas = [];
let contador = 0;

const ctx = document.getElementById('grafica').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: etiquetas,
    datasets: [
      {
        label: 'Tiempo Tierra',
        data: dataTierra,
        borderColor: 'blue',
        fill: false
      },
      {
        label: 'Tiempo Viajero',
        data: dataViajero,
        borderColor: 'red',
        fill: false
      }
    ]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { title: { display: true, text: 'Ciclos de simulación' } },
      y: { title: { display: true, text: 'Tiempo (años)' } }
    }
  }
});

function actualizarTiempos() {
  tiempoTierra += 0.05;
  const factorDilatacion = Math.sqrt(1 - velocidad * velocidad);
  tiempoViajero += 0.05 * factorDilatacion;

  tiempoTierraText.textContent = tiempoTierra.toFixed(2);
  tiempoViajeroText.textContent = tiempoViajero.toFixed(2);

  etiquetas.push(contador);
  dataTierra.push(tiempoTierra.toFixed(2));
  dataViajero.push(tiempoViajero.toFixed(2));
  chart.update();
  contador++;
}

function iniciarIntervalo() {
  if (intervalo) clearInterval(intervalo);
  intervalo = setInterval(actualizarTiempos, 200);
}

function pausarIntervalo() {
  clearInterval(intervalo);
}

function reiniciarSimulacion() {
  clearInterval(intervalo);
  tiempoTierra = 0;
  tiempoViajero = 0;
  contador = 0;
  tiempoTierraText.textContent = "0.00";
  tiempoViajeroText.textContent = "0.00";
  etiquetas.length = 0;
  dataTierra.length = 0;
  dataViajero.length = 0;
  chart.update();
}

gemelo.addEventListener("mousedown", function(e) {
  isDragging = true;
  offsetX = e.clientX - gemelo.getBoundingClientRect().left;
  gemelo.style.cursor = "grabbing";
});

document.addEventListener("mousemove", function(e) {
  if (isDragging) {
    const containerLeft = gemelo.parentElement.getBoundingClientRect().left;
    let newX = e.clientX - containerLeft - offsetX;
    newX = Math.max(0, Math.min(contenedorWidth - 80, newX));
    gemelo.style.marginLeft = newX + "px";

    velocidad = (newX / (contenedorWidth - 80)) * 0.99;

    velocidadText.textContent = `Velocidad simulada: ${velocidad.toFixed(2)}c`;

    const velocidadAnimacion = Math.max(0.5, 2 - (velocidad * 1.5));
    relojViajero.style.animation = `girar ${velocidadAnimacion}s linear infinite`;
  }
});

document.addEventListener("mouseup", function() {
  isDragging = false;
  gemelo.style.cursor = "grab";
});

function mostrarTiempoElegido() {
  const tiempoElegido = document.getElementById("tiempoInput").value;
  document.getElementById("valorTiempo").textContent = tiempoElegido;
}

function calcularResultado() {
  const tTierra = parseFloat(document.getElementById("tiempoInput").value);
  const resultadoDiv = document.getElementById("resultadoCalculo");
  if (velocidad >= 1) {
    resultadoDiv.innerHTML = "<p style='color:red;'>⚠️ La velocidad no puede ser igual o mayor a la luz (c).</p>";
    return;
  }
  const factor = Math.sqrt(1 - velocidad * velocidad);
  const tViajero = tTierra * factor;
  const diferencia = tTierra - tViajero;
  resultadoDiv.innerHTML = `
    <p><strong>📋 Resultado:</strong></p>
    <ul>
      <li>Velocidad actual: <strong>${velocidad.toFixed(2)}c</strong></li>
      <li>Tiempo en la Tierra: <strong>${tTierra.toFixed(2)}</strong> años</li>
      <li>Tiempo del gemelo viajero: <strong>${tViajero.toFixed(2)}</strong> años</li>
      <li>Diferencia: <strong>${diferencia.toFixed(2)}</strong> años</li>
    </ul>
  `;
}
