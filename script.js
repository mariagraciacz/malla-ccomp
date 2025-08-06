const totalCreditos = 235;
const totalElectivas = 16;

let data = {};
let colores = {};

const mallaContainer = document.getElementById('malla-container');
const creditosAprobados = document.getElementById('creditos-aprobados');
const electivasAprobadas = document.getElementById('electivas-aprobadas');

function cargarDatos() {
  const params = new URLSearchParams(window.location.search);
  const carrera = params.get('m') || 'CCOMP';

  Promise.all([
    fetch(`data/data_${carrera}.json`).then(res => res.json()),
    fetch(`data/colors_${carrera}.json`).then(res => res.json())
  ]).then(([d, c]) => {
    data = d;
    colores = c;
    renderizarMalla();
    actualizarContadores();
  });
}

function renderizarMalla() {
  mallaContainer.innerHTML = '';

  Object.keys(data).forEach(sem => {
    const contenedorSem = document.createElement('div');
    contenedorSem.className = 'semestre';

    const titulo = document.createElement('h2');
    titulo.textContent = `Semestre ${sem.toUpperCase()}`;
    contenedorSem.appendChild(titulo);

    data[sem].forEach(materia => {
      const [nombre, codigo, creditos, categoria, prereq] = materia;

      const tarjeta = document.createElement('div');
      tarjeta.className = 'curso';
      tarjeta.style.backgroundColor = colores[categoria] || '#ddd';
      tarjeta.dataset.codigo = codigo;
      tarjeta.dataset.creditos = creditos;
      tarjeta.dataset.categoria = categoria;

      tarjeta.textContent = `${nombre} (${codigo}) - ${creditos} créditos`;

      if (estaAprobado(codigo)) {
        tarjeta.classList.add('aprobado');
      }

      tarjeta.onclick = () => {
        toggleAprobacion(codigo);
        actualizarContadores();
        tarjeta.classList.toggle('aprobado');
      };

      contenedorSem.appendChild(tarjeta);
    });

    mallaContainer.appendChild(contenedorSem);
  });
}

function estaAprobado(codigo) {
  const aprobados = JSON.parse(localStorage.getItem('aprobados')) || [];
  return aprobados.includes(codigo);
}

function toggleAprobacion(codigo) {
  let aprobados = JSON.parse(localStorage.getItem('aprobados')) || [];
  if (aprobados.includes(codigo)) {
    aprobados = aprobados.filter(c => c !== codigo);
  } else {
    aprobados.push(codigo);
  }
  localStorage.setItem('aprobados', JSON.stringify(aprobados));
}

function actualizarContadores() {
  const aprobados = JSON.parse(localStorage.getItem('aprobados')) || [];
  let sumaTotal = 0;
  let sumaElectivas = 0;

  Object.values(data).flat().forEach(([nombre, codigo, creditos, categoria]) => {
    if (aprobados.includes(codigo)) {
      sumaTotal += creditos;
      if (categoria.toLowerCase().includes('electiva')) {
        sumaElectivas += creditos;
      }
    }
  });

  creditosAprobados.textContent = sumaTotal;
  electivasAprobadas.textContent = sumaElectivas;
}

cargarDatos();
