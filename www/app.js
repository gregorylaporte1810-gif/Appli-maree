// 1. Éléments du DOM
const portSelect = document.getElementById("port-select");
const coefValue = document.getElementById("coef-value");
const currentState = document.getElementById("current-state");
const nextEvent = document.getElementById("next-event");
const tideGrid = document.getElementById("tide-grid");

// 2. Base des données des ports (Coordonnées pour le GPS + ID SHOM pour l'API)
const PORTS_DATA = {
  // Manche & Nord
  dunkerque: { id: "8", lat: 51.034, lon: 2.376 },
  calais: { id: "9", lat: 50.958, lon: 1.859 },
  "le-havre": { id: "16", lat: 49.49, lon: 0.1 },
  cherbourg: { id: "29", lat: 49.63, lon: -1.62 },
  granville: { id: "40", lat: 48.83, lon: -1.6 },

  // Bretagne
  "saint-malo": { id: "52", lat: 48.65, lon: -2.02 },
  roscoff: { id: "62", lat: 48.72, lon: -3.98 },
  brest: { id: "71", lat: 48.39, lon: -4.48 },
  concarneau: { id: "81", lat: 47.87, lon: -3.91 },
  lorient: { id: "84", lat: 47.75, lon: -3.36 },
  vannes: { id: "92", lat: 47.65, lon: -2.75 }, // Port-Navalo / Golfe

  // Atlantique
  "saint-nazaire": { id: "104", lat: 47.27, lon: -2.21 },
  "les-sables-dolonne": { id: "114", lat: 46.49, lon: -1.78 },
  "la-rochelle": { id: "119", lat: 46.16, lon: -1.15 },
  royan: { id: "124", lat: 45.62, lon: -1.03 },
  arcachon: { id: "128", lat: 44.66, lon: -1.16 },
  biarritz: { id: "136", lat: 43.48, lon: -1.56 }, // Saint-Jean-de-Luz
};

// N'oublie pas de coller ta clé obtenue sur api-maree.fr
const API_TOKEN = "6644217faf20d111fb8d5b6a3acc2522";

async function fetchTideData(portKey) {
  const portInfo = PORTS_DATA[portKey];
  if (!portInfo) return;

  const today = new Date().toISOString().split("T")[0];
  const cacheKey = `marees_${portKey}_${today}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    processAndRenderData(JSON.parse(cachedData));
    return;
  }

  currentState.textContent = "Mise à jour en direct… ⏳";
  nextEvent.textContent = "Connexion au SHOM...";
  coefValue.textContent = "--";
  tideGrid.innerHTML = "";

  try {
    // L'URL de base selon la documentation de api-maree.fr
    // L'identifiant du port est injecté dynamiquement
    const url = `https://api-maree.fr/api/v1/tides?port_id=${portInfo.id}&date=${today}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`, // Méthode classique d'authentification
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error(`Erreur réseau : ${response.status}`);

    const data = await response.json();

    localStorage.setItem(cacheKey, JSON.stringify(data));
    processAndRenderData(data);
  } catch (error) {
    console.error("Erreur API :", error);
    currentState.textContent = "Erreur de connexion ❌";
    nextEvent.textContent = "Vérifie ta clé API";
  }
}

// 4. Traitement et mise en forme des données reçues
function processAndRenderData(data) {
  // On supprime la logique de marnage, l'API nous donne tout !
  // Attention à vérifier les clés exactes retournées dans ton console.log(data)

  const marees = data.marees; // À adapter selon le format exact du JSON
  if (!marees || marees.length === 0) return;

  // 1. Récupération du coefficient officiel du SHOM
  // Le coef n'est souvent communiqué que sur les marées hautes
  const pleineMer = marees.find(
    (m) => m.coefficient != null && m.coefficient > 0,
  );
  coefValue.textContent = pleineMer ? pleineMer.coefficient : "--";

  // 2. En-tête
  currentState.textContent = "Données Officielles (SHOM) ⚓";
  nextEvent.textContent = "Mise à jour automatique";

  // 3. Affichage des 4 cartes de la journée
  tideGrid.innerHTML = "";
  marees.slice(0, 4).forEach((item) => {
    // Adapter "Pleine mer" selon la chaîne de caractère renvoyée par le JSON
    const isHigh = item.etat === "Pleine mer";
    const icon = isHigh ? "🏔️" : "🌊";
    const title = isHigh ? "Pleine Mer" : "Basse Mer";

    // Formatage de l'heure exacte
    const time = new Date(item.date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Formatage de la hauteur positive
    const height = parseFloat(item.hauteur).toFixed(2) + "m";

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
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
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
const geoBtn = document.getElementById("geo-btn");

geoBtn.addEventListener("click", () => {
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
        localStorage.setItem("selectedPort", nearestPort);
        fetchTideData(nearestPort);
      }
      geoBtn.textContent = "📍";
    },
    (error) => {
      console.error("Erreur géolocalisation :", error);
      alert("Impossible d'accéder à ta position GPS.");
      geoBtn.textContent = "📍";
    },
  );
});
