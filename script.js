// Créditos oficiales de cada ramo
const creditos = {
  'intro_vida': 3,
  'com1': 2,
  'logica': 2,
  'fundamentos': 5,
  'mate': 6,
  'intro_compt': 3,
  'com2': 2,
  'calc1': 5,
  'historia': 4,
  'poo': 6,
  'discretas': 6,
  'realidad': 3,
  'algebra': 4,
  'datos': 4,
  'calc2': 4,
  'gnoseologia': 3,
  'tap': 4,
  'metafisica': 3,
  'algoritmos': 5,
  'estadistica': 4,
  'fisica': 4,
  'analisis_num': 3,
  'antropologia': 3,
  'software': 4,
  'arqui': 3,
  'moral': 4,
  'leng_prog': 4,
  'analisis_algo': 5,
  'simulacion': 4,
  'sist_operativos': 4,
  'compiladores': 4,
  'big_data': 4,
  'fe_razon': 3,
  'fund_cdatos': 4,
  'fund_ia': 4,
  'tesis1': 3,
  'teoria_compt': 4,
  'teologia': 3,
  'liderazgo': 1,
  'redes_com': 3,
  'machine_learning': 4,
  'prog_web': 4,
  'tesis2': 3,
  'compt_grafica': 4,
  'a_profundo': 4,
  'ciberseguridad': 4,
  'alto_desempeño': 4,
  'startup': 3,
  'humano_compt': 3,
  'iglesia': 3,
  'a_refuerzo': 4,
  'cloud': 3,
  'responsable': 3,
  'cultura': 3,
  'tesis3': 3,
  'etica': 2,
  'vision': 4,
  'block_cripto': 3,
  'cuantica': 4,
  'videojuegos': 4,
  'software_ind': 4,
  'leng_natural': 4,
  'tesis4': 3,
  'realidad_virtual': 3,
};

// Prerrequisitos de cada ramo (ramos que deben estar aprobados para desbloquear este)
const prerequisitos = {
  'com2': ['com1'],
  'calc1': ['mate'],
  'poo': ['intro_compt'],
  'discretas': ['mate', 'intro_compt'],
  'algebra': ['discretas'],
  'datos': ['discretas'],
  'calc2': ['calc1'],
  'tap': ['poo'],
  'algoritmos': ['tap'],
  'estadistica': ['algebra'],
  'fisica': ['poo', 'calc2'],
  'analisis_num': ['poo', 'calc2'],
  'software': ['tap', 'datos'],
  'arqui': ['discretas'],
  'leng_prog': ['algoritmos', 'discretas'],
  'analisis_algo': ['algoritmos'],
  'simulacion': ['estadistica', 'analisis_num'],
  'sist_operativos': ['arqui'],
  'compiladores': ['leng_prog'],
  'big_data': ['datos', 'analisis_algo'],
  'fund_cdatos': ['analisis_algo', 'simulacion'],
  'fund_ia': ['analisis_algo', 'simulacion'],
  'tesis_1': ['big_data'],
  'teoria_compt': ['analisis_algo', 'discretas'],
  'redes_com': ['sist_operativos'],
  'machine_learning': ['fund_ia'],
  'prog_web': ['leng_prog', 'datos'],
  'tesis2': ['tesis_1'],
  'compt_grafica': ['algoritmos', 'fisica', 'algebra'],
  'a_profundo': ['machine_learning'],
  'ciberseguridad': ['redes_com'],
  'alto_desempeño': ['redes_com', 'big_data'],
  'startup': ['liderazgo', 'tesis_1'],
  'humano_compt': ['big_data'],
  'a_refuerzo': ['a_profundo'],
  'cloud': ['alto_desempeño'],
  'responsable': ['prog_web'],
  'tesis3': ['tesis2'],
  'vision': ['a_profundo'],
  'block_cripto': ['analisis_algo', 'ciberseguridad'],
  'cuantica': ['arqui', 'teoria_compt', 'estadistica', 'analisis_algo'],
  'videojuegos': ['compt_grafica'],
  'software_ind': ['software'],
  'leng_natural': ['a_profundo'],
  'tesis4': ['tesis3'],
  'realidad_virtual': ['compt_grafica'],
  'historia':[],
  'realidad':[],
  'gnoseologia':[],
  'metafisica':[],
  'antropologia':[],
  'moral':[],
  'fe_razon':[],
  'teologia':[],
  'liderazgo':[],
  'iglesia':[],
  'cultura':[],
  'etica':[],
};

// Funciones para guardar y cargar progreso en localStorage
function obtenerAprobados() {
  const data = localStorage.getItem('mallaAprobados');
  return data ? JSON.parse(data) : [];
}

function guardarAprobados(aprobados) {
  localStorage.setItem('mallaAprobados', JSON.stringify(aprobados));
}

// Calcula el total de créditos de ramos aprobados
function calcularCreditosAprobados() {
  const aprobados = obtenerAprobados();
  return aprobados.reduce((sum, ramo) => sum + (creditos[ramo] || 0), 0);
}

// Actualiza qué ramos están desbloqueados o bloqueados según prerrequisitos y créditos especiales
function actualizarDesbloqueos() {
  const aprobados = obtenerAprobados();
  const totalCreditos = calcularCreditosAprobados();

  for (const [destino, reqs] of Object.entries(prerequisitos)) {
    const elem = document.getElementById(destino);
    if (!elem) continue;

    // Verificar si se cumplen prerrequisitos normales
    let puedeDesbloquear = reqs.every(r => aprobados.includes(r));

    // Reglas especiales con créditos para ciertos módulos
    if (destino === 'modulo1') {
      puedeDesbloquear = totalCreditos >= 90;
    }
    if (destino === 'modulo2') {
      puedeDesbloquear = aprobados.includes('modulo1') && totalCreditos >= 170;
    }
    if (destino === 'internado_electivo' || destino === 'internado_electivo1') {
      puedeDesbloquear = totalCreditos >= 240;
    }

    if (!elem.classList.contains('aprobado')) {
      if (puedeDesbloquear) elem.classList.remove('bloqueado');
      else elem.classList.add('bloqueado');
    } else {
      // Si está aprobado, no debe estar bloqueado
      elem.classList.remove('bloqueado');
    }
  }
}

// Maneja el clic para aprobar o desaprobar un ramo (solo si no está bloqueado)
function aprobar(e) {
  const ramo = typeof e === 'string' ? document.getElementById(e) : e.currentTarget;
  if (ramo.classList.contains('bloqueado')) return;

  ramo.classList.toggle('aprobado');

  const aprobados = obtenerAprobados();
  if (ramo.classList.contains('aprobado')) {
    if (!aprobados.includes(ramo.id)) aprobados.push(ramo.id);
  } else {
    const idx = aprobados.indexOf(ramo.id);
    if (idx > -1) aprobados.splice(idx, 1);
  }
  guardarAprobados(aprobados);

  actualizarDesbloqueos();
  actualizarContadorCreditos(); // 🔹 actualizar después de cada cambio
}

window.addEventListener('DOMContentLoaded', () => {
  const todosRamos = document.querySelectorAll('.ramo');

  const aprobados = obtenerAprobados();
  todosRamos.forEach(ramo => {
    if (aprobados.includes(ramo.id)) {
      ramo.classList.add('aprobado');
    }
  });

  todosRamos.forEach(ramo => {
    ramo.addEventListener('click', aprobar);
  });

  actualizarDesbloqueos();
  actualizarContadorCreditos(); // 🔹 inicializar al cargar
});


// Al cargar la página, asignar eventos, cargar progreso y actualizar desbloqueos
window.addEventListener('DOMContentLoaded', () => {
  const todosRamos = document.querySelectorAll('.ramo');

  const aprobados = obtenerAprobados();
  todosRamos.forEach(ramo => {
    if (aprobados.includes(ramo.id)) {
      ramo.classList.add('aprobado');
    }
  });

  todosRamos.forEach(ramo => {
    ramo.addEventListener('click', aprobar);
  });

  actualizarDesbloqueos();
});

// Calcula créditos totales posibles
function calcularCreditosTotales() {
  return Object.values(creditos).reduce((sum, c) => sum + c, 0);
}

// Actualiza el contador en la parte superior
function actualizarContadorCreditos() {
  const aprobados = calcularCreditosAprobados();
  const total = calcularCreditosTotales();
  const contador = document.getElementById('contador-creditos');
  if (contador) {
    contador.textContent = `${aprobados}/${total} créditos aprobados`;
  }
}

