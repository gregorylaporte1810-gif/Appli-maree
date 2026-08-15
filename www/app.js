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
  vannes: { id: "92", lat: 47.65, lon: -2.75 },

  // Atlantique
  "saint-nazaire": { id: "104", lat: 47.27, lon: -2.21 },
  "les-sables-dolonne": { id: "114", lat: 46.49, lon: -1.78 },
  "la-rochelle": { id: "119", lat: 46.16, lon: -1.15 },
  royan: { id: "124", lat: 45.62, lon: -1.03 },
  arcachon: { id: "128", lat: 44.66, lon: -1.16 },
  biarritz: { id: "136", lat: 43.48, lon: -1.56 },
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
    const url = `https://api-maree.fr/tide-extrema?site=${portKey}&from=${today}&to=${today}&tz=Europe/Paris&key=${API_TOKEN}`;
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
function processAndRenderData(data) {
  const marees = Array.isArray(data)
    ? data
    : data.extremas ||
      data.extremes ||
      data.data ||
      data.tides ||
      Object.values(data).find((val) => Array.isArray(val));

  if (!marees || !Array.isArray(marees) || marees.length === 0) {
    console.warn("Impossible de trouver le tableau des marées dans :", data);
    currentState.textContent = "Format de données inconnu ❌";
    return;
  }

  function parseVal(val) {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const cleaned = val.replace(",", ".").replace(/[^\d.-]/g, "");
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num;
    }
    return null;
  }

  // 1. Récupération du coefficient officiel du SHOM
  let coef = "--";
  const pleineMerCoef = marees.find(
    (m) =>
      (m.coefficient != null && m.coefficient > 0) ||
      (m.coef != null && m.coef > 0) ||
      (m.coeft != null && m.coeft > 0),
  );
  if (pleineMerCoef) {
    coef =
      parseVal(
        pleineMerCoef.coefficient || pleineMerCoef.coef || pleineMerCoef.coeft,
      ) ?? "--";
  }
  coefValue.textContent = coef;

  // 2. En-tête
  currentState.textContent = "Données Officielles (SHOM) ⚓";
  nextEvent.textContent = "Mise à jour automatique";

  // 3. Affichage des cartes de la journée
  tideGrid.innerHTML = "";
  marees.slice(0, 4).forEach((item) => {
    const etatStr = Object.values(item).join(" ").toLowerCase();
    const isHigh =
      etatStr.includes("pleine") ||
      etatStr.includes("high") ||
      etatStr.includes("plein");

    const icon = isHigh ? "🏔️" : "🌊";
    const title = isHigh ? "Pleine Mer" : "Basse Mer";

    let time = "--:--";
    const rawDate =
      item.date || item.time || item.datetime || item.dt || item.timestamp;
    if (rawDate) {
      if (typeof rawDate === "number") {
        time = new Date(rawDate * 1000).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        const dateObj = new Date(rawDate);
        if (!isNaN(dateObj.getTime())) {
          time = dateObj.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else if (typeof rawDate === "string" && rawDate.includes(":")) {
          time = rawDate.slice(11, 16) || rawDate.slice(0, 5);
        }
      }
    }

    // Recherche exhaustive de la hauteur dans l'objet
    let rawHeight =
      item.hauteur ??
      item.height ??
      item.valeur ??
      item.value ??
      item.niveau ??
      item.water_level ??
      item.h ??
      item.mer;
    let heightNum = parseVal(rawHeight);

    if (heightNum === null) {
      for (const val of Object.values(item)) {
        const p = parseVal(val);
        if (p !== null && p !== Number(coef) && p >= -5 && p <= 16) {
          heightNum = p;
          break;
        }
      }
    }

    const height = heightNum !== null ? heightNum.toFixed(2) + "m" : "--m";

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
