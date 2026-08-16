// 1. Éléments du DOM
const portSelect = document.getElementById("port-select");
const coefValue = document.getElementById("coef-value");
const currentState = document.getElementById("current-state");
const nextEvent = document.getElementById("next-event");
const tideGrid = document.getElementById("tide-grid");

document.addEventListener("DOMContentLoaded", () => {
  const portSelect = document.getElementById("port-select");
  portSelect.innerHTML = ""; // Nettoyage au cas où

  // 1. Regrouper les ports par département
  const groupedPorts = PORTS_DATA.reduce((acc, port) => {
    const dept = port.dept || "Autres";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(port);
    return acc;
  }, {});

  // 2. Créer les <optgroup> et les <option> associés
  for (const [deptName, ports] of Object.entries(groupedPorts)) {
    const optGroup = document.createElement("optgroup");
    optGroup.label = deptName;

    ports.forEach((port) => {
      const option = document.createElement("option");
      option.value = port.slug;
      option.textContent = port.name;
      optGroup.appendChild(option);
    });

    portSelect.appendChild(optGroup);
  }

  // 3. Sélectionner par défaut le port sauvegardé ou une valeur par défaut
  const savedPort = localStorage.getItem("selectedPort") || "roscoff";
  portSelect.value = savedPort;
  fetchTideData(savedPort);
});
// 2. Base des données des ports avec le slug exact attendu par l'API
const PORTS_DATA = [
  // Calvados (14)
  {
    name: "Arromanches-les-Bains",
    slug: "arromanches-les-bains",
    dept: "Calvados (14)",
  },
  {
    name: "Courseulles-sur-Mer",
    slug: "courseulles-sur-mer",
    dept: "Calvados (14)",
  },
  { name: "Dives-sur-Mer", slug: "dives-sur-mer", dept: "Calvados (14)" },
  { name: "Grandcamp", slug: "grandcamp", dept: "Calvados (14)" },
  { name: "Honfleur", slug: "honfleur", dept: "Calvados (14)" },
  { name: "Luc-sur-mer", slug: "luc-sur-mer", dept: "Calvados (14)" },
  { name: "Ouistreham", slug: "ouistreham", dept: "Calvados (14)" },
  { name: "Port-en-Bessin", slug: "port-en-bessin", dept: "Calvados (14)" },
  {
    name: "Trouville / Deauville",
    slug: "trouville-deauville",
    dept: "Calvados (14)",
  },
  { name: "Vierville", slug: "vierville", dept: "Calvados (14)" },

  // Charente-Maritime (17)
  { name: "Cordouan", slug: "cordouan", dept: "Charente-Maritime (17)" },
  {
    name: "La Rochelle-Pallice",
    slug: "la-rochelle-pallice",
    dept: "Charente-Maritime (17)",
  },
  {
    name: "Pointe de Gatseau",
    slug: "pointe-de-gatseau",
    dept: "Charente-Maritime (17)",
  },
  { name: "Royan", slug: "royan", dept: "Charente-Maritime (17)" },
  {
    name: "Île d'Oléron (La Cotinière)",
    slug: "ile-d-oleron-la-cotiniere",
    dept: "Charente-Maritime (17)",
  },
  {
    name: "Île de Ré (Saint-Martin)",
    slug: "ile-de-re-saint-martin",
    dept: "Charente-Maritime (17)",
  },

  // Côtes-d'Armor (22)
  {
    name: "Baie de Saint-Brieuc (Le Légué)",
    slug: "baie-de-saint-brieuc-le-legue",
    dept: "Côtes-d'Armor (22)",
  },
  { name: "Binic", slug: "binic", dept: "Côtes-d'Armor (22)" },
  { name: "Dahouet", slug: "dahouet", dept: "Côtes-d'Armor (22)" },
  { name: "Erquy", slug: "erquy", dept: "Côtes-d'Armor (22)" },
  {
    name: "Les Héaux de Bréhat",
    slug: "les-heaux-de-brehat",
    dept: "Côtes-d'Armor (22)",
  },
  { name: "Locquemeau", slug: "locquemeau", dept: "Côtes-d'Armor (22)" },
  { name: "Paimpol", slug: "paimpol", dept: "Côtes-d'Armor (22)" },
  { name: "Perros-Guirec", slug: "perros-guirec", dept: "Côtes-d'Armor (22)" },
  { name: "Ploumanac'h", slug: "ploumanac-h", dept: "Côtes-d'Armor (22)" },
  { name: "Port-Béni", slug: "port-beni", dept: "Côtes-d'Armor (22)" },
  { name: "Saint-Cast", slug: "saint-cast", dept: "Côtes-d'Armor (22)" },
  {
    name: "Saint-Quay-Portrieux",
    slug: "saint-quay-portrieux",
    dept: "Côtes-d'Armor (22)",
  },
  { name: "Trébeurden", slug: "trebeurden", dept: "Côtes-d'Armor (22)" },
  { name: "Tréguier", slug: "treguier", dept: "Côtes-d'Armor (22)" },
  {
    name: "Île des Ébihens",
    slug: "ile-des-ebihens",
    dept: "Côtes-d'Armor (22)",
  },

  // Finistère (29)
  { name: "Aber Wrac'h", slug: "aber-wrac-h", dept: "Finistère (29)" },
  { name: "Anse de Primel", slug: "anse-de-primel", dept: "Finistère (29)" },
  { name: "Audierne", slug: "audierne", dept: "Finistère (29)" },
  {
    name: "Baie de Morlaix - Carantec",
    slug: "baie-de-morlaix-carantec",
    dept: "Finistère (29)",
  },
  { name: "Brest", slug: "brest", dept: "Finistère (29)" },
  { name: "Brignogan-Plage", slug: "brignogan-plage", dept: "Finistère (29)" },
  { name: "Bénodet", slug: "benodet", dept: "Finistère (29)" },
  { name: "Camaret-sur-Mer", slug: "camaret-sur-mer", dept: "Finistère (29)" },
  { name: "Concarneau", slug: "concarneau", dept: "Finistère (29)" },
  { name: "Douarnenez", slug: "douarnenez", dept: "Finistère (29)" },
  { name: "Fouesnant", slug: "fouesnant", dept: "Finistère (29)" },
  { name: "L'Aber Benoît", slug: "l-aber-benoit", dept: "Finistère (29)" },
  {
    name: "L'Aber Ildut - Lanildut",
    slug: "l-aber-ildut-lanildut",
    dept: "Finistère (29)",
  },
  { name: "Le Conquet", slug: "le-conquet", dept: "Finistère (29)" },
  { name: "Le Guilvinec", slug: "le-guilvinec", dept: "Finistère (29)" },
  { name: "Le Pouldu", slug: "le-pouldu", dept: "Finistère (29)" },
  { name: "Lesconil", slug: "lesconil", dept: "Finistère (29)" },
  { name: "Locquirec", slug: "locquirec", dept: "Finistère (29)" },
  { name: "Loctudy", slug: "loctudy", dept: "Finistère (29)" },
  { name: "Morgat", slug: "morgat", dept: "Finistère (29)" },
  {
    name: "Penfret (Îles de Glénan)",
    slug: "penfret-iles-de-glenan",
    dept: "Finistère (29)",
  },
  {
    name: "Penmarc'h / Saint-Guénolé",
    slug: "penmarc-h-saint-guenole",
    dept: "Finistère (29)",
  },
  { name: "Port Manec'h", slug: "port-manec-h", dept: "Finistère (29)" },
  { name: "Portsall", slug: "portsall", dept: "Finistère (29)" },
  { name: "Roscoff", slug: "roscoff", dept: "Finistère (29)" },
  { name: "Trez-Hir", slug: "trez-hir", dept: "Finistère (29)" },

  // Gironde (33)
  {
    name: "Arcachon (Jetée d'Eyrac)",
    slug: "arcachon-jetee-d-eyrac",
    dept: "Gironde (33)",
  },
  { name: "Bordeaux", slug: "bordeaux", dept: "Gironde (33)" },
  { name: "Cap Ferret", slug: "cap-ferret", dept: "Gironde (33)" },
  { name: "Lacanau", slug: "lacanau", dept: "Gironde (33)" },
  { name: "Pauillac", slug: "pauillac", dept: "Gironde (33)" },
  {
    name: "Pointe de Grave (Port-Bloc)",
    slug: "pointe-de-grave-port-bloc",
    dept: "Gironde (33)",
  },
  { name: "Richards", slug: "richards", dept: "Gironde (33)" },

  // Ille-et-Vilaine (35)
  { name: "Cancale", slug: "cancale", dept: "Ille-et-Vilaine (35)" },
  { name: "Saint-Malo", slug: "saint-malo", dept: "Ille-et-Vilaine (35)" },

  // Landes (40)
  { name: "Biscarrosse", slug: "biscarrosse", dept: "Landes (40)" },
  { name: "Mimizan", slug: "mimizan", dept: "Landes (40)" },
  { name: "Vieux-Boucau", slug: "vieux-boucau", dept: "Landes (40)" },

  // Loire-Atlantique (44)
  { name: "Le Croisic", slug: "le-croisic", dept: "Loire-Atlantique (44)" },
  { name: "Le Pouliguen", slug: "le-pouliguen", dept: "Loire-Atlantique (44)" },
  {
    name: "Pointe de Saint-Gildas",
    slug: "pointe-de-saint-gildas",
    dept: "Loire-Atlantique (44)",
  },
  { name: "Pornic", slug: "pornic", dept: "Loire-Atlantique (44)" },
  { name: "Pornichet", slug: "pornichet", dept: "Loire-Atlantique (44)" },
  {
    name: "Saint-Nazaire",
    slug: "saint-nazaire",
    dept: "Loire-Atlantique (44)",
  },

  // Manche (50)
  { name: "Barfleur", slug: "barfleur", dept: "Manche (50)" },
  { name: "Carteret", slug: "carteret", dept: "Manche (50)" },
  { name: "Cherbourg", slug: "cherbourg", dept: "Manche (50)" },
  { name: "Diélette", slug: "dielette", dept: "Manche (50)" },
  { name: "Goury", slug: "goury", dept: "Manche (50)" },
  { name: "Granville", slug: "granville", dept: "Manche (50)" },
  {
    name: "Omonville-la-Rogue",
    slug: "omonville-la-rogue",
    dept: "Manche (50)",
  },
  { name: "Pointe d'Agon", slug: "pointe-d-agon", dept: "Manche (50)" },
  { name: "Portbail", slug: "portbail", dept: "Manche (50)" },
  { name: "Quinéville", slug: "quineville", dept: "Manche (50)" },
  {
    name: "Saint-Vaast-la-Hougue",
    slug: "saint-vaast-la-hougue",
    dept: "Manche (50)",
  },
  {
    name: "Sainte-Marie-du-Mont (Utah Beach)",
    slug: "sainte-marie-du-mont-utah-beach",
    dept: "Manche (50)",
  },
  { name: "Surtainville", slug: "surtainville", dept: "Manche (50)" },
  { name: "Vauville", slug: "vauville", dept: "Manche (50)" },
  {
    name: "Îles Saint-Marcouf",
    slug: "iles-saint-marcouf",
    dept: "Manche (50)",
  },

  // Morbihan (56)
  { name: "Arradon", slug: "arradon", dept: "Morbihan (56)" },
  {
    name: "Auray (St-Goustan)",
    slug: "auray-st-goustan",
    dept: "Morbihan (56)",
  },
  {
    name: "Belle-Île (Le Palais)",
    slug: "belle-ile-le-palais",
    dept: "Morbihan (56)",
  },
  { name: "Houat", slug: "houat", dept: "Morbihan (56)" },
  { name: "Hoëdic", slug: "hoedic", dept: "Morbihan (56)" },
  {
    name: "La Trinité-sur-Mer",
    slug: "la-trinite-sur-mer",
    dept: "Morbihan (56)",
  },
  { name: "Le Logeo", slug: "le-logeo", dept: "Morbihan (56)" },
  { name: "Locmariaquer", slug: "locmariaquer", dept: "Morbihan (56)" },
  { name: "Lorient", slug: "lorient", dept: "Morbihan (56)" },
  { name: "Port du Crouesty", slug: "port-du-crouesty", dept: "Morbihan (56)" },
  {
    name: "Port-Louis (Locmalo)",
    slug: "port-louis-locmalo",
    dept: "Morbihan (56)",
  },
  { name: "Port-Navalo", slug: "port-navalo", dept: "Morbihan (56)" },
  { name: "Pénerf", slug: "penerf", dept: "Morbihan (56)" },
  {
    name: "Quiberon (Port-Haliguen)",
    slug: "quiberon-port-haliguen",
    dept: "Morbihan (56)",
  },
  {
    name: "Quiberon (Port-Maria)",
    slug: "quiberon-port-maria",
    dept: "Morbihan (56)",
  },
  { name: "Tréhiguier", slug: "trehiguier", dept: "Morbihan (56)" },
  { name: "Vannes", slug: "vannes", dept: "Morbihan (56)" },
  { name: "Étel", slug: "etel", dept: "Morbihan (56)" },
  {
    name: "Île de Groix (Port-Tudy)",
    slug: "ile-de-groix-port-tudy",
    dept: "Morbihan (56)",
  },

  // Nord (59)
  { name: "Dunkerque", slug: "dunkerque", dept: "Nord (59)" },
  { name: "Gravelines", slug: "gravelines", dept: "Nord (59)" },

  // Pas-de-Calais (62)
  {
    name: "Berck Plage - Fort Mahon",
    slug: "berck-plage-fort-mahon",
    dept: "Pas-de-Calais (62)",
  },
  {
    name: "Boulogne-sur-Mer",
    slug: "boulogne-sur-mer",
    dept: "Pas-de-Calais (62)",
  },
  { name: "Calais", slug: "calais", dept: "Pas-de-Calais (62)" },
  { name: "Wissant", slug: "wissant", dept: "Pas-de-Calais (62)" },

  // Pyrénées-Atlantiques (64)
  {
    name: "Boucau-Bayonne / Biarritz",
    slug: "boucau-bayonne-biarritz",
    dept: "Pyrénées-Atlantiques (64)",
  },

  // Seine-Maritime (76)
  { name: "Dieppe", slug: "dieppe", dept: "Seine-Maritime (76)" },
  { name: "Fécamp", slug: "fecamp", dept: "Seine-Maritime (76)" },
  { name: "Le Havre", slug: "le-havre", dept: "Seine-Maritime (76)" },
  {
    name: "Le Havre-Antifer",
    slug: "le-havre-antifer",
    dept: "Seine-Maritime (76)",
  },
  { name: "Le Tréport", slug: "le-treport", dept: "Seine-Maritime (76)" },
  {
    name: "Saint-Valery-en-Caux",
    slug: "saint-valery-en-caux",
    dept: "Seine-Maritime (76)",
  },
  { name: "Étretat", slug: "etretat", dept: "Seine-Maritime (76)" },

  // Somme (80)
  { name: "Cayeux-sur-mer", slug: "cayeux-sur-mer", dept: "Somme (80)" },

  // Vendée (85)
  { name: "Fromentine", slug: "fromentine", dept: "Vendée (85)" },
  {
    name: "Les Sables-d'Olonne",
    slug: "les-sables-d-olonne",
    dept: "Vendée (85)",
  },
  {
    name: "Noirmoutier (L'Herbaudière)",
    slug: "noirmoutier-l-herbaudiere",
    dept: "Vendée (85)",
  },
  { name: "Île d'Yeu", slug: "ile-d-yeu", dept: "Vendée (85)" },
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

// --- MODAL & MARÉES DE LA SEMAINE ---

// 1. Récupération des nouveaux éléments du DOM
const weekBtn = document.getElementById("week-btn");
const modalOverlay = document.getElementById("modal-overlay");
const closeModal = document.getElementById("close-modal");
const weekContent = document.getElementById("week-content");
const alertContainer = document.getElementById("alert-container");

// 2. Gestion de l'ouverture et fermeture
weekBtn.addEventListener("click", () => {
  modalOverlay.classList.add("active");
  fetchWeekData(portSelect.value); // Lance la recherche pour le port actuel
});

closeModal.addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});

// Fermer le modal si on clique en dehors de la boîte
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove("active");
  }
});

// 3. Récupération des données pour 7 jours
async function fetchWeekData(portSlug) {
  weekContent.innerHTML = "<p style='text-align:center;'>Calcul des marées en cours... ⏳</p>";
  alertContainer.innerHTML = "";

  // CORRECTION 1 : PORTS_DATA est un tableau, on utilise .find()
  const portInfo = PORTS_DATA.find((p) => p.slug === portSlug);
  if (!portInfo) {
    weekContent.innerHTML = "<p style='color:red;'>Port introuvable.</p>";
    return;
  }

  // Calcul des dates (Aujourd'hui -> +7 jours)
  const dateObj = new Date();
  const today = dateObj.toISOString().split("T")[0];
  dateObj.setDate(dateObj.getDate() + 7);
  const nextWeek = dateObj.toISOString().split("T")[0];

  const cacheKey = `shom_week_${portSlug}_${today}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    renderWeekData(JSON.parse(cachedData));
    return;
  }

  try {
    const url = `https://api-maree.fr/tide-extrema?site=${portInfo.slug}&from=${today}&to=${nextWeek}&tz=Europe/Paris&key=${API_TOKEN}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error("Erreur réseau");
    
    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify(data));
    renderWeekData(data);
  } catch (error) {
    console.error(error);
    weekContent.innerHTML = "<p style='color:red;'>Erreur lors du chargement des prévisions.</p>";
  }
}

// 4. Affichage et analyse des grandes marées
function renderWeekData(dataObj) {
  // CORRECTION 2 : Adaptation au nouveau format structuré (dataObj.data)
  if (!dataObj.data || dataObj.data.length === 0) {
    weekContent.innerHTML = "<p>Données non disponibles.</p>";
    return;
  }

  let maxCoef = 0;
  const daysMap = {};
  
  // Date de référence pour incrémenter les jours proprement
  const currentDate = new Date();

  // On boucle sur chaque jour renvoyé par l'API
  dataObj.data.forEach((dayData, index) => {
    if (!dayData.extrema) return;

    // Détermination de la date de ce bloc de marées
    const dateObj = new Date(currentDate);
    dateObj.setDate(currentDate.getDate() + index);
    const dayKey = dateObj.toLocaleDateString("fr-FR", { weekday: 'short', day: 'numeric', month: 'short' });

    // Analyse des marées de la journée
    dayData.extrema.forEach(item => {
      const timeStr = item.time || "--:--";
      const isHigh = item.type === "PM";
      const icon = isHigh ? "🏔️" : "🌊";
      const heightStr = item.height !== undefined ? item.height.toFixed(2) + "m" : "";
      
      let coefNum = null;
      if (item.coef !== undefined) {
         coefNum = item.coef;
         if (coefNum > maxCoef) maxCoef = coefNum;
      }

      if (!daysMap[dayKey]) daysMap[dayKey] = [];
      daysMap[dayKey].push(`
        <div class="week-tides-row">
          <span>${icon} ${timeStr}</span>
          <span>${heightStr} ${coefNum ? `(Coef: <b>${coefNum}</b>)` : ""}</span>
        </div>
      `);
    });
  });

  // Affichage de l'alerte si grandes marées (Coef >= 90)
  if (maxCoef >= 90) {
    alertContainer.innerHTML = `
      <div class="alert-high-tide">
        ⚠️ <span>Alerte Grandes Marées cette semaine ! (Max: coef ${maxCoef})</span>
      </div>
    `;
  }

  // Génération du HTML final de la liste
  let html = "";
  for (const [day, tidesList] of Object.entries(daysMap)) {
    html += `
      <div class="week-day">
        <div class="week-date">${day.charAt(0).toUpperCase() + day.slice(1)}</div>
        ${tidesList.join("")}
      </div>
    `;
  }
  
  weekContent.innerHTML = html;
}
