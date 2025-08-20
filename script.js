const FX_PEN_USD = 3.60; // Tipo de cambio soles a dólares

document.addEventListener("DOMContentLoaded", () => {
  const distritoSel = document.getElementById("distrito");
  const zonaSel = document.getElementById("zona");
  const form = document.getElementById("calc");

  // Cargar distritos
  Object.keys(DATA).forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    distritoSel.appendChild(opt);
  });

  // Al cambiar distrito, cargar zonas
  distritoSel.addEventListener("change", () => {
    zonaSel.innerHTML = "";
    const zonas = DATA[distritoSel.value].zonas;
    Object.keys(zonas).forEach(z => {
      const opt = document.createElement("option");
      opt.value = z;
      opt.textContent = z;
      zonaSel.appendChild(opt);
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    calcular();
  });

  function calcular(){
    const d = distritoSel.value;
    const z = zonaSel.value;
    const tipo = document.getElementById("tipo").value;
    const areaT = parseFloat(document.getElementById("areaTechada").value);
    const areaL = parseFloat(document.getElementById("areaLibre").value);
    const dorms = parseInt(document.getElementById("dorms").value);
    const baths = parseInt(document.getElementById("baths").value);
    const piso = parseInt(document.getElementById("piso").value);
    const ascensor = document.getElementById("ascensor").value;
    const antig = parseInt(document.getElementById("antiguedad").value);
    const curr = document.getElementById("currency").value;

    let precioM2 = DATA[d].zonas[z]; // base por zona
    let valorBase = precioM2 * (areaT + areaL*0.3); // libre se pondera 30%

    // Ajustes por características
    valorBase *= (1 - Math.min(antig*0.005, 0.2)); // antigüedad max -20%
    if(dorms > 2) valorBase *= 1 + Math.min((dorms-2)*0.02,0.06);
    if(baths > 2) valorBase *= 1 + Math.min((baths-2)*0.015,0.05);
    if(piso > 4 && ascensor==="sin") valorBase *= 0.92;
    if(ascensor==="con") valorBase *= 1.03;

    // Factor según tipo
    if(tipo==="Terreno") valorBase *= 0.85;
    if(tipo==="Casa") valorBase *= 1.05;

    // Resultado
    const valMin = valorBase*0.9;
    const valMax = valorBase*1.1;

    const divisa = curr==="USD" ? "USD" : "S/";
    const fx = curr==="USD" ? 1/FX_PEN_USD : 1;

    document.getElementById("summary").textContent = `Estimación para ${tipo} en ${z}, ${d}`;
    document.getElementById("valMin").textContent = (valMin*fx).toFixed(0) + " " + divisa;
    document.getElementById("valMed").textContent = (valorBase*fx).toFixed(0) + " " + divisa;
    document.getElementById("valMax").textContent = (valMax*fx).toFixed(0) + " " + divisa;
  }
});
