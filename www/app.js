// 1. Éléments du DOM
const portSelect = document.getElementById("port-select");
const coefValue = document.getElementById("coef-value");
const currentState = document.getElementById("current-state");
const nextEvent = document.getElementById("next-event");
const tideGrid = document.getElementById("tide-grid");

// Clé API WorldTides (Créer un compte gratuit sur worldtides.info pour avoir ta clé)
const API_KEY = "8b3747b6-129f-44ed-b822-83768db7c5d5";

// 2. Base des coordonnées GPS des ports
const PORTS_COORDINATES = {
  // Manche & Nord
  dunkerque: { lat: 51.034, lon: 2.376 },
  calais: { lat: 50.958, lon: 1.859 },
  "le-havre": { lat: 49.49, lon: 0.1 },
  cherbourg: { lat: 49.63, lon: -1.62 },
  granville: { lat: 48.83, lon: -1.6 },

  // Bretagne
  "saint-malo": { lat: 48.65, lon: -2.02 },
  roscoff: { lat: 48.72, lon: -3.98 },
  brest: { lat: 48.39, lon: -4.48 },
  concarneau: { lat: 47.87, lon: -3.91 },
  lorient: { lat: 47.75, lon: -3.36 },
  vannes: { lat: 47.65, lon: -2.75 },

  // Atlantique
  "saint-nazaire": { lat: 47.27, lon: -2.21 },
  "les-sables-dolonne": { lat: 46.49, lon: -1.78 },
  "la-rochelle": { lat: 46.16, lon: -1.15 },
  royan: { lat: 45.62, lon: -1.03 },
  arcachon: { lat: 44.66, lon: -1.16 },
  biarritz: { lat: 43.48, lon: -1.56 },
};

async function fetchTideData(portKey) {
  const coords = PORTS_COORDINATES[portKey];
  if (!coords) return;

  currentState.textContent = "Mise à jour en direct… ⏳";
  nextEvent.textContent = "Connexion à WorldTides";
  coefValue.textContent = "--";
  tideGrid.innerHTML = "";

  try {
    // Remarque : Ajout de &datum=LAT pour avoir des hauteurs toujours positives
    const url = `https://www.worldtides.info/api/v3?heights&extremes&lat=${coords.lat}&lon=${coords.lon}&key=${API_KEY}&datum=LAT`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur réseau : ${response.status}`);
    }

    const data = await response.json();
    processAndRenderData(data);
  } catch (error) {
    console.error("Erreur API :", error);
    currentState.textContent = "Erreur de connexion ❌";
    nextEvent.textContent = "Vérifie l'activation de ton e-mail WorldTides";
  }
}

// 4. Traitement et mise en forme des données reçues
function processAndRenderData(data) {
  if (!data.extremes || data.extremes.length === 0) return;

  const extremes = data.extremes;

  // 1. Calcul du coefficient (référence Brest 6.10m = coeff 100)
  const highTides = extremes.filter(
    (e) => e.type === "High" || e.type === "Pleine Mer",
  );
  const lowTides = extremes.filter(
    (e) => e.type === "Low" || e.type === "Basse Mer",
  );

  if (highTides.length > 0 && lowTides.length > 0) {
    const maxHigh = Math.max(...highTides.map((e) => e.height));
    const minLow = Math.min(...lowTides.map((e) => e.height));
    const marnage = maxHigh - minLow;

    let coeff = Math.round((marnage / 6.1) * 100);
    coeff = Math.min(120, Math.max(20, coeff));
    coefValue.textContent = coeff;
  } else {
    coefValue.textContent = "--";
  }

  // 2. Mise à jour de l'en-tête
  currentState.textContent = "Données en direct 🛰️";
  nextEvent.textContent = "Mise à jour automatique";

  // 3. Affichage des cartes avec la structure CSS exacte
  tideGrid.innerHTML = "";
  extremes.slice(0, 4).forEach((item) => {
    const isHigh = item.type === "High" || item.type === "Pleine Mer";
    const icon = isHigh ? "🏔️" : "🌊";
    const title = isHigh ? "Pleine Mer" : "Basse Mer";
    const time = new Date(item.dt * 1000).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const height = item.height.toFixed(2) + "m";

    const card = document.createElement("div");
    card.classList.add("tide-card");
    card.innerHTML = `
      <span class="tide-icon">${icon}</span>
      <div class="tide-info">
        <span class="tide-type">${title}</span>
        <span class="tide-time">${time}</span>
        <span class="tide-height">${height}</span>
      </div>
    `;
    tideGrid.appendChild(card);
  });
}

// 5. Initialisation & Écouteurs
const savedPort = localStorage.getItem("selectedPort") || "saint-malo";
portSelect.value = savedPort;
fetchTideData(savedPort);

portSelect.addEventListener("change", (e) => {
  const selectedPort = e.target.value;
  localStorage.setItem("selectedPort", selectedPort);
  fetchTideData(selectedPort);
});

// --- GÉOLOCALISATION ---

// Formule de Haversine pour calculer la distance entre deux points GPS (en km)
function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Trouver la clé du port le plus proche des coordonnées GPS données
function findNearestPort(userLat, userLon) {
  let closestPortKey = null;
  let minDistance = Infinity;

  for (const [key, coords] of Object.entries(PORTS_COORDINATES)) {
    const dist = getDistanceInKm(userLat, userLon, coords.lat, coords.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closestPortKey = key;
    }
  }
  return closestPortKey;
}

// Gestion du clic sur le bouton de géolocalisation
const geoBtn = document.getElementById('geo-btn');

geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par ton navigateur.");
    return;
  }

  geoBtn.textContent = "⏳";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const nearestPort = findNearestPort(latitude, longitude);

      if (nearestPort) {
        portSelect.value = nearestPort;
        localStorage.setItem('selectedPort', nearestPort);
        fetchTideData(nearestPort);
      }
      geoBtn.textContent = "📍";
    },
    (error) => {
      console.error("Erreur géolocalisation :", error);
      alert("Impossible d'accéder à ta position GPS.");
      geoBtn.textContent = "📍";
    }
  );
});