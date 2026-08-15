// 1. Éléments du DOM
const portSelect = document.getElementById("port-select");
const coefValue = document.getElementById("coef-value");
const currentState = document.getElementById("current-state");
const nextEvent = document.getElementById("next-event");
const tideGrid = document.getElementById("tide-grid");

// 2. Base des données des ports avec le slug exact attendu par l'API
const PORTS_DATA = {
  // Manche & Nord
  dunkerque: { id: "8", slug: "dunkerque", lat: 51.034, lon: 2.376 },
  calais: { id: "9", slug: "calais", lat: 50.958, lon: 1.859 },
  "le-havre": { id: "16", slug: "le-havre", lat: 49.49, lon: 0.1 },
  cherbourg: { id: "29", slug: "cherbourg", lat: 49.63, lon: -1.62 },
  granville: { id: "40", slug: "granville", lat: 48.83, lon: -1.6 },

  // Bretagne
  "saint-malo": { id: "52", slug: "saint-malo", lat: 48.65, lon: -2.02 },
  roscoff: { id: "62", slug: "roscoff", lat: 48.72, lon: -3.98 },
  brest: { id: "71", slug: "brest", lat: 48.39, lon: -4.48 },
  concarneau: { id: "81", slug: "concarneau", lat: 47.87, lon: -3.91 },
  lorient: { id: "84", slug: "lorient", lat: 47.75, lon: -3.36 },
  vannes: { id: "92", slug: "vannes", lat: 47.65, lon: -2.75 },

  // Atlantique
  "saint-nazaire": { id: "104", slug: "saint-nazaire", lat: 47.27, lon: -2.21 },
  "les-sables-dolonne": {
    id: "114",
    slug: "les-sables-dolonne",
    lat: 46.49,
    lon: -1.78,
  },
  "la-rochelle": { id: "119", slug: "la-rochelle", lat: 46.16, lon: -1.15 },
  royan: { id: "124", slug: "royan", lat: 45.62, lon: -1.03 },
  arcachon: { id: "128", slug: "arcachon", lat: 44.66, lon: -1.16 },
  biarritz: { id: "136", slug: "biarritz", lat: 43.48, lon: -1.56 },
};

const API_TOKEN = "6644217faf20d111fb8d5b6a3acc2522";

async function fetchTideData(portKey) {
  const portInfo = PORTS_DATA[portKey];
  if (!portInfo) return;

  const today = new Date().toISOString().split("T")[0];
  const cacheKey = `shom_v4_${portKey}_${today}`;
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
    // CORRECTION : On utilise portInfo.id (l'identifiant numérique officiel) à la place de portKey
    const url = `https://api-maree.fr/tide-extrema?site=${portInfo.id}&from=${today}&to=${today}&tz=Europe/Paris&key=${API_TOKEN}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Erreur réseau : ${response.status}`);

    const data = await response.json();
    console.log("Données reçues de api-maree :", data);

    localStorage.setItem(cacheKey, JSON.stringify(data));
    processAndRenderData(data);
  } catch (error) {
    console.error("Erreur API :", error);
    currentState.textContent = "Erreur de connexion ❌";
    nextEvent.textContent = "Vérifie ta clé API";
  }
}

// 4. Traitement et mise en forme des données reçues
function processAndRenderData(dataObj) {
  // L'API api-maree.fr stocke généralement son tableau dans la clé "data"
  const marees = dataObj.data || [];

  if (!Array.isArray(marees) || marees.length === 0) {
    console.warn("Aucun tableau de marées exploitable trouvé.");
    currentState.textContent = "Format de données inconnu ❌";
    return;
  }

  // Mise à jour de l'en-tête
  currentState.textContent = "Données Officielles (SHOM) ⚓";
  nextEvent.textContent = "Mise à jour automatique";
  tideGrid.innerHTML = "";

  let globalCoef = "--";

  marees.slice(0, 4).forEach((item) => {
    let timeStr = "--:--";
    let heightNum = null;
    let isHigh = false;

    // Fonction récursive pour extraire les données imbriquées
    function extractDeep(obj) {
      if (!obj || typeof obj !== "object") return;

      for (const [key, val] of Object.entries(obj)) {
        if (typeof val === "object") {
          // Si la valeur est un autre objet, on fouille à l'intérieur
          extractDeep(val);
        } else {
          const k = String(key).toLowerCase();
          const v = String(val).toLowerCase();

          // Extraction de l'heure (format Date ISO)
          if (
            timeStr === "--:--" &&
            (k.includes("time") ||
              k.includes("date") ||
              k === "datetime" ||
              v.includes("t"))
          ) {
            const d = new Date(val);
            if (!isNaN(d.getTime())) {
              timeStr = d.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              });
            }
          }
          // Extraction de la hauteur de l'eau
          if (
            heightNum === null &&
            (k.includes("height") ||
              k.includes("hauteur") ||
              k === "v" ||
              k === "value")
          ) {
            const parsed = parseFloat(String(val).replace(",", "."));
            if (!isNaN(parsed) && parsed >= -5 && parsed <= 20) {
              heightNum = parsed;
            }
          }
          // Détection de l'état (Pleine mer / Basse mer)
          if (
            v.includes("high") ||
            v.includes("pm") ||
            v.includes("pleine") ||
            v.includes("haute")
          ) {
            isHigh = true;
          }
          // Extraction du coefficient
          if (k.includes("coef") && val !== null && val !== "") {
            globalCoef = val;
          }
        }
      }
    }

    // Lancement de la fouille sur l'élément en cours
    extractDeep(item);

    // Préparation de l'affichage
    const icon = isHigh ? "🏔️" : "🌊";
    const title = isHigh ? "Pleine Mer" : "Basse Mer";
    const height = heightNum !== null ? heightNum.toFixed(2) + "m" : "--m";

    // Création de la carte HTML
    const card = document.createElement("div");
    card.classList.add("tide-card");
    card.innerHTML = `
      <span class="tide-icon">${icon}</span>
      <div class="tide-info">
        <span class="tide-type">${title}</span>
        <span class="tide-time">${timeStr}</span>
        <span class="tide-height">${height}</span>
      </div>
    `;
    tideGrid.appendChild(card);
  });

  // Mise à jour finale du DOM pour le coefficient
  coefValue.textContent = globalCoef;
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

function findNearestPort(userLat, userLon) {
  let closestPortKey = null;
  let minDistance = Infinity;

  for (const [key, coords] of Object.entries(PORTS_DATA)) {
    const dist = getDistanceInKm(userLat, userLon, coords.lat, coords.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closestPortKey = key;
    }
  }
  return closestPortKey;
}

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
