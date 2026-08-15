// 1. Éléments du DOM
const portSelect = document.getElementById("port-select");
const coefValue = document.getElementById("coef-value");
const currentState = document.getElementById("current-state");
const nextEvent = document.getElementById("next-event");
const tideGrid = document.getElementById("tide-grid");

document.addEventListener("DOMContentLoaded", () => {
  const portSelect = document.getElementById("port-select");

  // Remplissage automatique du menu déroulant
  PORTS_DATA.forEach((port) => {
    const option = document.createElement("option");
    option.value = port.slug;
    option.textContent = port.name;
    portSelect.appendChild(option);
  });

  // Sélectionner par défaut le premier port ou celui sauvegardé
  portSelect.value = "roscoff"; // ou ta logique actuelle

  // Le reste de ton code d'initialisation...
});
// 2. Base des données des ports avec le slug exact attendu par l'API
const PORTS_DATA = [
  { name: "Aber Wrac'h", slug: "aber-wrac-h" },
  { name: "Anse de Primel", slug: "anse-de-primel" },
  { name: "Arcachon (Jetée d'Eyrac)", slug: "arcachon-jetee-d-eyrac" },
  { name: "Arradon", slug: "arradon" },
  { name: "Arromanches-les-Bains", slug: "arromanches-les-bains" },
  { name: "Audierne", slug: "audierne" },
  { name: "Auray (St-Goustan)", slug: "auray-st-goustan" },
  { name: "Baie de Morlaix - Carantec", slug: "baie-de-morlaix-carantec" },
  {
    name: "Baie de Saint-Brieuc (Le Légué)",
    slug: "baie-de-saint-brieuc-le-legue",
  },
  { name: "Barfleur", slug: "barfleur" },
  { name: "Belle-Île (Le Palais)", slug: "belle-ile-le-palais" },
  { name: "Berck Plage - Fort Mahon", slug: "berck-plage-fort-mahon" },
  { name: "Binic", slug: "binic" },
  { name: "Biscarrosse", slug: "biscarrosse" },
  { name: "Bordeaux", slug: "bordeaux" },
  { name: "Boucau-Bayonne / Biarritz", slug: "boucau-bayonne-biarritz" },
  { name: "Boulogne-sur-Mer", slug: "boulogne-sur-mer" },
  { name: "Brest", slug: "brest" },
  { name: "Brignogan-Plage", slug: "brignogan-plage" },
  { name: "Bénodet", slug: "benodet" },
  { name: "Calais", slug: "calais" },
  { name: "Camaret-sur-Mer", slug: "camaret-sur-mer" },
  { name: "Cancale", slug: "cancale" },
  { name: "Cap Ferret", slug: "cap-ferret" },
  { name: "Carteret", slug: "carteret" },
  { name: "Cayeux-sur-mer", slug: "cayeux-sur-mer" },
  { name: "Cherbourg", slug: "cherbourg" },
  { name: "Concarneau", slug: "concarneau" },
  { name: "Cordouan", slug: "cordouan" },
  { name: "Courseulles-sur-Mer", slug: "courseulles-sur-mer" },
  { name: "Dahouet", slug: "dahouet" },
  { name: "Dieppe", slug: "dieppe" },
  { name: "Dives-sur-Mer", slug: "dives-sur-mer" },
  { name: "Diélette", slug: "dielette" },
  { name: "Douarnenez", slug: "douarnenez" },
  { name: "Dunkerque", slug: "dunkerque" },
  { name: "Erquy", slug: "erquy" },
  { name: "Fouesnant", slug: "fouesnant" },
  { name: "Fromentine", slug: "fromentine" },
  { name: "Fécamp", slug: "fecamp" },
  { name: "Goury", slug: "goury" },
  { name: "Grandcamp", slug: "grandcamp" },
  { name: "Granville", slug: "granville" },
  { name: "Gravelines", slug: "gravelines" },
  { name: "Honfleur", slug: "honfleur" },
  { name: "Houat", slug: "houat" },
  { name: "Hoëdic", slug: "hoedic" },
  { name: "L'Aber Benoît", slug: "l-aber-benoit" },
  { name: "L'Aber Ildut - Lanildut", slug: "l-aber-ildut-lanildut" },
  { name: "La Rochelle-Pallice", slug: "la-rochelle-pallice" },
  { name: "La Trinité-sur-Mer", slug: "la-trinite-sur-mer" },
  { name: "Lacanau", slug: "lacanau" },
  { name: "Le Conquet", slug: "le-conquet" },
  { name: "Le Croisic", slug: "le-croisic" },
  { name: "Le Guilvinec", slug: "le-guilvinec" },
  { name: "Le Havre", slug: "le-havre" },
  { name: "Le Havre-Antifer", slug: "le-havre-antifer" },
  { name: "Le Logeo", slug: "le-logeo" },
  { name: "Le Pouldu", slug: "le-pouldu" },
  { name: "Le Pouliguen", slug: "le-pouliguen" },
  { name: "Le Tréport", slug: "le-treport" },
  { name: "Les Héaux de Bréhat", slug: "les-heaux-de-brehat" },
  { name: "Les Sables-d'Olonne", slug: "les-sables-d-olonne" },
  { name: "Lesconil", slug: "lesconil" },
  { name: "Locmariaquer", slug: "locmariaquer" },
  { name: "Locquemeau", slug: "locquemeau" },
  { name: "Locquirec", slug: "locquirec" },
  { name: "Loctudy", slug: "loctudy" },
  { name: "Lorient", slug: "lorient" },
  { name: "Luc-sur-mer", slug: "luc-sur-mer" },
  { name: "Mimizan", slug: "mimizan" },
  { name: "Morgat", slug: "morgat" },
  { name: "Noirmoutier (L'Herbaudière)", slug: "noirmoutier-l-herbaudiere" },
  { name: "Omonville-la-Rogue", slug: "omonville-la-rogue" },
  { name: "Ouistreham", slug: "ouistreham" },
  { name: "Paimpol", slug: "paimpol" },
  { name: "Pauillac", slug: "pauillac" },
  { name: "Penfret (Îles de Glénan)", slug: "penfret-iles-de-glenan" },
  { name: "Penmarc'h / Saint-Guénolé", slug: "penmarc-h-saint-guenole" },
  { name: "Perros-Guirec", slug: "perros-guirec" },
  { name: "Ploumanac'h", slug: "ploumanac-h" },
  { name: "Pointe d'Agon", slug: "pointe-d-agon" },
  { name: "Pointe de Gatseau", slug: "pointe-de-gatseau" },
  { name: "Pointe de Grave (Port-Bloc)", slug: "pointe-de-grave-port-bloc" },
  { name: "Pointe de Saint-Gildas", slug: "pointe-de-saint-gildas" },
  { name: "Pornic", slug: "pornic" },
  { name: "Pornichet", slug: "pornichet" },
  { name: "Port Manec'h", slug: "port-manec-h" },
  { name: "Port du Crouesty", slug: "port-du-crouesty" },
  { name: "Port-Béni", slug: "port-beni" },
  { name: "Port-Louis (Locmalo)", slug: "port-louis-locmalo" },
  { name: "Port-Navalo", slug: "port-navalo" },
  { name: "Port-en-Bessin", slug: "port-en-bessin" },
  { name: "Portbail", slug: "portbail" },
  { name: "Portsall", slug: "portsall" },
  { name: "Pénerf", slug: "penerf" },
  { name: "Quiberon (Port-Haliguen)", slug: "quiberon-port-haliguen" },
  { name: "Quiberon (Port-Maria)", slug: "quiberon-port-maria" },
  { name: "Quinéville", slug: "quineville" },
  { name: "Richards", slug: "richards" },
  { name: "Roscoff", slug: "roscoff" },
  { name: "Royan", slug: "royan" },
  { name: "Saint-Cast", slug: "saint-cast" },
  { name: "Saint-Malo", slug: "saint-malo" },
  { name: "Saint-Nazaire", slug: "saint-nazaire" },
  { name: "Saint-Quay-Portrieux", slug: "saint-quay-portrieux" },
  { name: "Saint-Vaast-la-Hougue", slug: "saint-vaast-la-hougue" },
  { name: "Saint-Valery-en-Caux", slug: "saint-valery-en-caux" },
  {
    name: "Sainte-Marie-du-Mont (Utah Beach)",
    slug: "sainte-marie-du-mont-utah-beach",
  },
  { name: "Surtainville", slug: "surtainville" },
  { name: "Trez-Hir", slug: "trez-hir" },
  { name: "Trouville / Deauville", slug: "trouville-deauville" },
  { name: "Trébeurden", slug: "trebeurden" },
  { name: "Tréguier", slug: "treguier" },
  { name: "Tréhiguier", slug: "trehiguier" },
  { name: "Vannes", slug: "vannes" },
  { name: "Vauville", slug: "vauville" },
  { name: "Vierville", slug: "vierville" },
  { name: "Vieux-Boucau", slug: "vieux-boucau" },
  { name: "Wissant", slug: "wissant" },
  { name: "Étel", slug: "etel" },
  { name: "Étretat", slug: "etretat" },
  { name: "Île d'Oléron (La Cotinière)", slug: "ile-d-oleron-la-cotiniere" },
  { name: "Île d'Yeu", slug: "ile-d-yeu" },
  { name: "Île de Groix (Port-Tudy)", slug: "ile-de-groix-port-tudy" },
  { name: "Île de Ré (Saint-Martin)", slug: "ile-de-re-saint-martin" },
  { name: "Île des Ébihens", slug: "ile-des-ebihens" },
  { name: "Îles Saint-Marcouf", slug: "iles-saint-marcouf" },
];

const API_TOKEN = "6644217faf20d111fb8d5b6a3acc2522";

async function fetchTideData(portSlug) {
  // On cherche le port par son slug dans le tableau
  const portInfo = PORTS_DATA.find((p) => p.slug === portSlug);
  if (!portInfo) return;

  const today = new Date().toISOString().split("T")[0];
  const cacheKey = `shom_v4_${portSlug}_${today}`;
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
    const url = `https://api-maree.fr/tide-extrema?site=${portInfo.slug}&from=${today}&to=${today}&tz=Europe/Paris&key=${API_TOKEN}`;
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
  // On vérifie que les données et le tableau extrema existent pour le premier jour
  if (!dataObj.data || dataObj.data.length === 0 || !dataObj.data[0].extrema) {
    console.warn("Aucun tableau de marées exploitable trouvé.");
    currentState.textContent = "Format de données inconnu ❌";
    return;
  }

  // Mise à jour de l'en-tête
  currentState.textContent = "Données Officielles ⚓";
  nextEvent.textContent = "Mise à jour automatique";
  tideGrid.innerHTML = "";

  // On cible directement les événements de marées du jour ciblé
  const horairesMaree = dataObj.data[0].extrema;
  let globalCoef = "--";

  horairesMaree.slice(0, 4).forEach((item) => {
    // Le JSON fournit directement ces clés
    const timeStr = item.time || "--:--";
    const heightNum = item.height !== undefined ? item.height : null;

    // PM = Pleine Mer, BM = Basse Mer
    const isHigh = item.type === "PM";

    // Seules les pleines mers ont un coefficient dans ce JSON
    if (item.coef !== undefined) {
      globalCoef = item.coef;
    }

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
