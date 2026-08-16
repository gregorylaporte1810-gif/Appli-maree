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
// 2. Base des données des ports avec le slug exact attendu par l'API et les coordonnées GPS
const PORTS_DATA = [
  // Calvados (14)
  {
    name: "Arromanches-les-Bains",
    slug: "arromanches-les-bains",
    dept: "Calvados (14)",
    lat: 49.342,
    lon: -0.621,
  },
  {
    name: "Courseulles-sur-Mer",
    slug: "courseulles-sur-mer",
    dept: "Calvados (14)",
    lat: 49.333,
    lon: -0.458,
  },
  {
    name: "Dives-sur-Mer",
    slug: "dives-sur-mer",
    dept: "Calvados (14)",
    lat: 49.299,
    lon: -0.098,
  },
  {
    name: "Grandcamp",
    slug: "grandcamp",
    dept: "Calvados (14)",
    lat: 49.388,
    lon: -1.041,
  },
  {
    name: "Honfleur",
    slug: "honfleur",
    dept: "Calvados (14)",
    lat: 49.421,
    lon: 0.233,
  },
  {
    name: "Luc-sur-mer",
    slug: "luc-sur-mer",
    dept: "Calvados (14)",
    lat: 49.316,
    lon: -0.354,
  },
  {
    name: "Ouistreham",
    slug: "ouistreham",
    dept: "Calvados (14)",
    lat: 49.283,
    lon: -0.249,
  },
  {
    name: "Port-en-Bessin",
    slug: "port-en-bessin",
    dept: "Calvados (14)",
    lat: 49.348,
    lon: -0.755,
  },
  {
    name: "Trouville / Deauville",
    slug: "trouville-deauville",
    dept: "Calvados (14)",
    lat: 49.366,
    lon: 0.076,
  },
  {
    name: "Vierville",
    slug: "vierville",
    dept: "Calvados (14)",
    lat: 49.373,
    lon: -0.9,
  },

  // Charente-Maritime (17)
  {
    name: "Cordouan",
    slug: "cordouan",
    dept: "Charente-Maritime (17)",
    lat: 45.586,
    lon: -1.171,
  },
  {
    name: "La Rochelle-Pallice",
    slug: "la-rochelle-pallice",
    dept: "Charente-Maritime (17)",
    lat: 46.158,
    lon: -1.218,
  },
  {
    name: "Pointe de Gatseau",
    slug: "pointe-de-gatseau",
    dept: "Charente-Maritime (17)",
    lat: 45.795,
    lon: -1.25,
  },
  {
    name: "Royan",
    slug: "royan",
    dept: "Charente-Maritime (17)",
    lat: 45.62,
    lon: -1.028,
  },
  {
    name: "Île d'Oléron (La Cotinière)",
    slug: "ile-d-oleron-la-cotiniere",
    dept: "Charente-Maritime (17)",
    lat: 45.914,
    lon: -1.328,
  },
  {
    name: "Île de Ré (Saint-Martin)",
    slug: "ile-de-re-saint-martin",
    dept: "Charente-Maritime (17)",
    lat: 46.204,
    lon: -1.366,
  },

  // Côtes-d'Armor (22)
  {
    name: "Baie de Saint-Brieuc (Le Légué)",
    slug: "baie-de-saint-brieuc-le-legue",
    dept: "Côtes-d'Armor (22)",
    lat: 48.531,
    lon: -2.744,
  },
  {
    name: "Binic",
    slug: "binic",
    dept: "Côtes-d'Armor (22)",
    lat: 48.601,
    lon: -2.822,
  },
  {
    name: "Dahouet",
    slug: "dahouet",
    dept: "Côtes-d'Armor (22)",
    lat: 48.58,
    lon: -2.564,
  },
  {
    name: "Erquy",
    slug: "erquy",
    dept: "Côtes-d'Armor (22)",
    lat: 48.632,
    lon: -2.464,
  },
  {
    name: "Les Héaux de Bréhat",
    slug: "les-heaux-de-brehat",
    dept: "Côtes-d'Armor (22)",
    lat: 48.887,
    lon: -3.054,
  },
  {
    name: "Locquemeau",
    slug: "locquemeau",
    dept: "Côtes-d'Armor (22)",
    lat: 48.723,
    lon: -3.57,
  },
  {
    name: "Paimpol",
    slug: "paimpol",
    dept: "Côtes-d'Armor (22)",
    lat: 48.78,
    lon: -3.041,
  },
  {
    name: "Perros-Guirec",
    slug: "perros-guirec",
    dept: "Côtes-d'Armor (22)",
    lat: 48.816,
    lon: -3.444,
  },
  {
    name: "Ploumanac'h",
    slug: "ploumanac-h",
    dept: "Côtes-d'Armor (22)",
    lat: 48.832,
    lon: -3.483,
  },
  {
    name: "Port-Béni",
    slug: "port-beni",
    dept: "Côtes-d'Armor (22)",
    lat: 48.835,
    lon: -3.111,
  },
  {
    name: "Saint-Cast",
    slug: "saint-cast",
    dept: "Côtes-d'Armor (22)",
    lat: 48.636,
    lon: -2.247,
  },
  {
    name: "Saint-Quay-Portrieux",
    slug: "saint-quay-portrieux",
    dept: "Côtes-d'Armor (22)",
    lat: 48.65,
    lon: -2.828,
  },
  {
    name: "Trébeurden",
    slug: "trebeurden",
    dept: "Côtes-d'Armor (22)",
    lat: 48.769,
    lon: -3.585,
  },
  {
    name: "Tréguier",
    slug: "treguier",
    dept: "Côtes-d'Armor (22)",
    lat: 48.788,
    lon: -3.228,
  },
  {
    name: "Île des Ébihens",
    slug: "ile-des-ebihens",
    dept: "Côtes-d'Armor (22)",
    lat: 48.629,
    lon: -2.128,
  },

  // Finistère (29)
  {
    name: "Aber Wrac'h",
    slug: "aber-wrac-h",
    dept: "Finistère (29)",
    lat: 48.598,
    lon: -4.561,
  },
  {
    name: "Anse de Primel",
    slug: "anse-de-primel",
    dept: "Finistère (29)",
    lat: 48.708,
    lon: -3.812,
  },
  {
    name: "Audierne",
    slug: "audierne",
    dept: "Finistère (29)",
    lat: 48.016,
    lon: -4.542,
  },
  {
    name: "Baie de Morlaix - Carantec",
    slug: "baie-de-morlaix-carantec",
    dept: "Finistère (29)",
    lat: 48.667,
    lon: -3.916,
  },
  {
    name: "Brest",
    slug: "brest",
    dept: "Finistère (29)",
    lat: 48.39,
    lon: -4.486,
  },
  {
    name: "Brignogan-Plage",
    slug: "brignogan-plage",
    dept: "Finistère (29)",
    lat: 48.665,
    lon: -4.327,
  },
  {
    name: "Bénodet",
    slug: "benodet",
    dept: "Finistère (29)",
    lat: 47.873,
    lon: -4.112,
  },
  {
    name: "Camaret-sur-Mer",
    slug: "camaret-sur-mer",
    dept: "Finistère (29)",
    lat: 48.275,
    lon: -4.595,
  },
  {
    name: "Concarneau",
    slug: "concarneau",
    dept: "Finistère (29)",
    lat: 47.873,
    lon: -3.918,
  },
  {
    name: "Douarnenez",
    slug: "douarnenez",
    dept: "Finistère (29)",
    lat: 48.096,
    lon: -4.331,
  },
  {
    name: "Fouesnant",
    slug: "fouesnant",
    dept: "Finistère (29)",
    lat: 47.842,
    lon: -4.004,
  },
  {
    name: "L'Aber Benoît",
    slug: "l-aber-benoit",
    dept: "Finistère (29)",
    lat: 48.567,
    lon: -4.615,
  },
  {
    name: "L'Aber Ildut - Lanildut",
    slug: "l-aber-ildut-lanildut",
    dept: "Finistère (29)",
    lat: 48.473,
    lon: -4.75,
  },
  {
    name: "Le Conquet",
    slug: "le-conquet",
    dept: "Finistère (29)",
    lat: 48.361,
    lon: -4.774,
  },
  {
    name: "Le Guilvinec",
    slug: "le-guilvinec",
    dept: "Finistère (29)",
    lat: 47.795,
    lon: -4.283,
  },
  {
    name: "Le Pouldu",
    slug: "le-pouldu",
    dept: "Finistère (29)",
    lat: 47.766,
    lon: -3.526,
  },
  {
    name: "Lesconil",
    slug: "lesconil",
    dept: "Finistère (29)",
    lat: 47.795,
    lon: -4.218,
  },
  {
    name: "Locquirec",
    slug: "locquirec",
    dept: "Finistère (29)",
    lat: 48.692,
    lon: -3.647,
  },
  {
    name: "Loctudy",
    slug: "loctudy",
    dept: "Finistère (29)",
    lat: 47.832,
    lon: -4.17,
  },
  {
    name: "Morgat",
    slug: "morgat",
    dept: "Finistère (29)",
    lat: 48.225,
    lon: -4.502,
  },
  {
    name: "Penfret (Îles de Glénan)",
    slug: "penfret-iles-de-glenan",
    dept: "Finistère (29)",
    lat: 47.72,
    lon: -3.956,
  },
  {
    name: "Penmarc'h / Saint-Guénolé",
    slug: "penmarc-h-saint-guenole",
    dept: "Finistère (29)",
    lat: 47.813,
    lon: -4.375,
  },
  {
    name: "Port Manec'h",
    slug: "port-manec-h",
    dept: "Finistère (29)",
    lat: 47.793,
    lon: -3.738,
  },
  {
    name: "Portsall",
    slug: "portsall",
    dept: "Finistère (29)",
    lat: 48.558,
    lon: -4.7,
  },
  {
    name: "Roscoff",
    slug: "roscoff",
    dept: "Finistère (29)",
    lat: 48.725,
    lon: -3.982,
  },
  {
    name: "Trez-Hir",
    slug: "trez-hir",
    dept: "Finistère (29)",
    lat: 48.353,
    lon: -4.675,
  },

  // Gironde (33)
  {
    name: "Arcachon (Jetée d'Eyrac)",
    slug: "arcachon-jetee-d-eyrac",
    dept: "Gironde (33)",
    lat: 44.664,
    lon: -1.166,
  },
  {
    name: "Bordeaux",
    slug: "bordeaux",
    dept: "Gironde (33)",
    lat: 44.837,
    lon: -0.579,
  },
  {
    name: "Cap Ferret",
    slug: "cap-ferret",
    dept: "Gironde (33)",
    lat: 44.621,
    lon: -1.246,
  },
  {
    name: "Lacanau",
    slug: "lacanau",
    dept: "Gironde (33)",
    lat: 45.0,
    lon: -1.197,
  },
  {
    name: "Pauillac",
    slug: "pauillac",
    dept: "Gironde (33)",
    lat: 45.197,
    lon: -0.748,
  },
  {
    name: "Pointe de Grave (Port-Bloc)",
    slug: "pointe-de-grave-port-bloc",
    dept: "Gironde (33)",
    lat: 45.556,
    lon: -1.066,
  },
  {
    name: "Richards",
    slug: "richards",
    dept: "Gironde (33)",
    lat: 45.438,
    lon: -0.93,
  },

  // Ille-et-Vilaine (35)
  {
    name: "Cancale",
    slug: "cancale",
    dept: "Ille-et-Vilaine (35)",
    lat: 48.675,
    lon: -1.851,
  },
  {
    name: "Saint-Malo",
    slug: "saint-malo",
    dept: "Ille-et-Vilaine (35)",
    lat: 48.649,
    lon: -2.025,
  },

  // Landes (40)
  {
    name: "Biscarrosse",
    slug: "biscarrosse",
    dept: "Landes (40)",
    lat: 44.444,
    lon: -1.249,
  },
  {
    name: "Mimizan",
    slug: "mimizan",
    dept: "Landes (40)",
    lat: 44.204,
    lon: -1.296,
  },
  {
    name: "Vieux-Boucau",
    slug: "vieux-boucau",
    dept: "Landes (40)",
    lat: 43.785,
    lon: -1.405,
  },

  // Loire-Atlantique (44)
  {
    name: "Le Croisic",
    slug: "le-croisic",
    dept: "Loire-Atlantique (44)",
    lat: 47.295,
    lon: -2.513,
  },
  {
    name: "Le Pouliguen",
    slug: "le-pouliguen",
    dept: "Loire-Atlantique (44)",
    lat: 47.276,
    lon: -2.427,
  },
  {
    name: "Pointe de Saint-Gildas",
    slug: "pointe-de-saint-gildas",
    dept: "Loire-Atlantique (44)",
    lat: 47.137,
    lon: -2.247,
  },
  {
    name: "Pornic",
    slug: "pornic",
    dept: "Loire-Atlantique (44)",
    lat: 47.112,
    lon: -2.103,
  },
  {
    name: "Pornichet",
    slug: "pornichet",
    dept: "Loire-Atlantique (44)",
    lat: 47.259,
    lon: -2.339,
  },
  {
    name: "Saint-Nazaire",
    slug: "saint-nazaire",
    dept: "Loire-Atlantique (44)",
    lat: 47.273,
    lon: -2.203,
  },

  // Manche (50)
  {
    name: "Barfleur",
    slug: "barfleur",
    dept: "Manche (50)",
    lat: 49.671,
    lon: -1.261,
  },
  {
    name: "Carteret",
    slug: "carteret",
    dept: "Manche (50)",
    lat: 49.375,
    lon: -1.794,
  },
  {
    name: "Cherbourg",
    slug: "cherbourg",
    dept: "Manche (50)",
    lat: 49.642,
    lon: -1.621,
  },
  {
    name: "Diélette",
    slug: "dielette",
    dept: "Manche (50)",
    lat: 49.551,
    lon: -1.865,
  },
  {
    name: "Goury",
    slug: "goury",
    dept: "Manche (50)",
    lat: 49.715,
    lon: -1.94,
  },
  {
    name: "Granville",
    slug: "granville",
    dept: "Manche (50)",
    lat: 48.835,
    lon: -1.602,
  },
  {
    name: "Omonville-la-Rogue",
    slug: "omonville-la-rogue",
    dept: "Manche (50)",
    lat: 49.704,
    lon: -1.846,
  },
  {
    name: "Pointe d'Agon",
    slug: "pointe-d-agon",
    dept: "Manche (50)",
    lat: 49.002,
    lon: -1.602,
  },
  {
    name: "Portbail",
    slug: "portbail",
    dept: "Manche (50)",
    lat: 49.333,
    lon: -1.698,
  },
  {
    name: "Quinéville",
    slug: "quineville",
    dept: "Manche (50)",
    lat: 49.509,
    lon: -1.258,
  },
  {
    name: "Saint-Vaast-la-Hougue",
    slug: "saint-vaast-la-hougue",
    dept: "Manche (50)",
    lat: 49.585,
    lon: -1.263,
  },
  {
    name: "Sainte-Marie-du-Mont (Utah Beach)",
    slug: "sainte-marie-du-mont-utah-beach",
    dept: "Manche (50)",
    lat: 49.414,
    lon: -1.174,
  },
  {
    name: "Surtainville",
    slug: "surtainville",
    dept: "Manche (50)",
    lat: 49.461,
    lon: -1.815,
  },
  {
    name: "Vauville",
    slug: "vauville",
    dept: "Manche (50)",
    lat: 49.636,
    lon: -1.845,
  },
  {
    name: "Îles Saint-Marcouf",
    slug: "iles-saint-marcouf",
    dept: "Manche (50)",
    lat: 49.497,
    lon: -1.146,
  },

  // Morbihan (56)
  {
    name: "Arradon",
    slug: "arradon",
    dept: "Morbihan (56)",
    lat: 47.625,
    lon: -2.827,
  },
  {
    name: "Auray (St-Goustan)",
    slug: "auray-st-goustan",
    dept: "Morbihan (56)",
    lat: 47.666,
    lon: -2.977,
  },
  {
    name: "Belle-Île (Le Palais)",
    slug: "belle-ile-le-palais",
    dept: "Morbihan (56)",
    lat: 47.347,
    lon: -3.153,
  },
  {
    name: "Houat",
    slug: "houat",
    dept: "Morbihan (56)",
    lat: 47.391,
    lon: -2.955,
  },
  {
    name: "Hoëdic",
    slug: "hoedic",
    dept: "Morbihan (56)",
    lat: 47.34,
    lon: -2.877,
  },
  {
    name: "La Trinité-sur-Mer",
    slug: "la-trinite-sur-mer",
    dept: "Morbihan (56)",
    lat: 47.585,
    lon: -3.028,
  },
  {
    name: "Le Logeo",
    slug: "le-logeo",
    dept: "Morbihan (56)",
    lat: 47.525,
    lon: -2.839,
  },
  {
    name: "Locmariaquer",
    slug: "locmariaquer",
    dept: "Morbihan (56)",
    lat: 47.568,
    lon: -2.943,
  },
  {
    name: "Lorient",
    slug: "lorient",
    dept: "Morbihan (56)",
    lat: 47.747,
    lon: -3.364,
  },
  {
    name: "Port du Crouesty",
    slug: "port-du-crouesty",
    dept: "Morbihan (56)",
    lat: 47.54,
    lon: -2.895,
  },
  {
    name: "Port-Louis (Locmalo)",
    slug: "port-louis-locmalo",
    dept: "Morbihan (56)",
    lat: 47.708,
    lon: -3.351,
  },
  {
    name: "Port-Navalo",
    slug: "port-navalo",
    dept: "Morbihan (56)",
    lat: 47.547,
    lon: -2.915,
  },
  {
    name: "Pénerf",
    slug: "penerf",
    dept: "Morbihan (56)",
    lat: 47.497,
    lon: -2.621,
  },
  {
    name: "Quiberon (Port-Haliguen)",
    slug: "quiberon-port-haliguen",
    dept: "Morbihan (56)",
    lat: 47.485,
    lon: -3.103,
  },
  {
    name: "Quiberon (Port-Maria)",
    slug: "quiberon-port-maria",
    dept: "Morbihan (56)",
    lat: 47.478,
    lon: -3.12,
  },
  {
    name: "Tréhiguier",
    slug: "trehiguier",
    dept: "Morbihan (56)",
    lat: 47.492,
    lon: -2.433,
  },
  {
    name: "Vannes",
    slug: "vannes",
    dept: "Morbihan (56)",
    lat: 47.655,
    lon: -2.757,
  },
  {
    name: "Étel",
    slug: "etel",
    dept: "Morbihan (56)",
    lat: 47.627,
    lon: -3.203,
  },
  {
    name: "Île de Groix (Port-Tudy)",
    slug: "ile-de-groix-port-tudy",
    dept: "Morbihan (56)",
    lat: 47.643,
    lon: -3.447,
  },

  // Nord (59)
  {
    name: "Dunkerque",
    slug: "dunkerque",
    dept: "Nord (59)",
    lat: 51.045,
    lon: 2.373,
  },
  {
    name: "Gravelines",
    slug: "gravelines",
    dept: "Nord (59)",
    lat: 50.999,
    lon: 2.115,
  },

  // Pas-de-Calais (62)
  {
    name: "Berck Plage - Fort Mahon",
    slug: "berck-plage-fort-mahon",
    dept: "Pas-de-Calais (62)",
    lat: 50.404,
    lon: 1.564,
  },
  {
    name: "Boulogne-sur-Mer",
    slug: "boulogne-sur-mer",
    dept: "Pas-de-Calais (62)",
    lat: 50.727,
    lon: 1.597,
  },
  {
    name: "Calais",
    slug: "calais",
    dept: "Pas-de-Calais (62)",
    lat: 50.963,
    lon: 1.843,
  },
  {
    name: "Wissant",
    slug: "wissant",
    dept: "Pas-de-Calais (62)",
    lat: 50.887,
    lon: 1.66,
  },

  // Pyrénées-Atlantiques (64)
  {
    name: "Boucau-Bayonne / Biarritz",
    slug: "boucau-bayonne-biarritz",
    dept: "Pyrénées-Atlantiques (64)",
    lat: 43.526,
    lon: -1.52,
  },

  // Seine-Maritime (76)
  {
    name: "Dieppe",
    slug: "dieppe",
    dept: "Seine-Maritime (76)",
    lat: 49.932,
    lon: 1.082,
  },
  {
    name: "Fécamp",
    slug: "fecamp",
    dept: "Seine-Maritime (76)",
    lat: 49.76,
    lon: 0.37,
  },
  {
    name: "Le Havre",
    slug: "le-havre",
    dept: "Seine-Maritime (76)",
    lat: 49.493,
    lon: 0.101,
  },
  {
    name: "Le Havre-Antifer",
    slug: "le-havre-antifer",
    dept: "Seine-Maritime (76)",
    lat: 49.658,
    lon: 0.155,
  },
  {
    name: "Le Tréport",
    slug: "le-treport",
    dept: "Seine-Maritime (76)",
    lat: 50.063,
    lon: 1.368,
  },
  {
    name: "Saint-Valery-en-Caux",
    slug: "saint-valery-en-caux",
    dept: "Seine-Maritime (76)",
    lat: 49.869,
    lon: 0.708,
  },
  {
    name: "Étretat",
    slug: "etretat",
    dept: "Seine-Maritime (76)",
    lat: 49.709,
    lon: 0.201,
  },

  // Somme (80)
  {
    name: "Cayeux-sur-mer",
    slug: "cayeux-sur-mer",
    dept: "Somme (80)",
    lat: 50.183,
    lon: 1.493,
  },

  // Vendée (85)
  {
    name: "Fromentine",
    slug: "fromentine",
    dept: "Vendée (85)",
    lat: 46.89,
    lon: -2.14,
  },
  {
    name: "Les Sables-d'Olonne",
    slug: "les-sables-d-olonne",
    dept: "Vendée (85)",
    lat: 46.496,
    lon: -1.789,
  },
  {
    name: "Noirmoutier (L'Herbaudière)",
    slug: "noirmoutier-l-herbaudiere",
    dept: "Vendée (85)",
    lat: 47.022,
    lon: -2.298,
  },
  {
    name: "Île d'Yeu",
    slug: "ile-d-yeu",
    dept: "Vendée (85)",
    lat: 46.726,
    lon: -2.348,
  },
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

// Trouver la clé (slug) du port le plus proche des coordonnées GPS données
function findNearestPort(userLat, userLon) {
  let closestPortSlug = null;
  let minDistance = Infinity;

  // On boucle directement sur chaque port du tableau PORTS_DATA
  for (const port of PORTS_DATA) {
    // Sécurité : on passe au port suivant s'il n'a pas de coordonnées GPS renseignées
    if (port.lat === undefined || port.lon === undefined) continue;

    const dist = getDistanceInKm(userLat, userLon, port.lat, port.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closestPortSlug = port.slug; // On récupère bien le slug attendu par l'API
    }
  }

  return closestPortSlug;
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
  weekContent.innerHTML =
    "<p style='text-align:center;'>Calcul des marées en cours... ⏳</p>";
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
    weekContent.innerHTML =
      "<p style='color:red;'>Erreur lors du chargement des prévisions.</p>";
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
    const dayKey = dateObj.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    // Analyse des marées de la journée
    dayData.extrema.forEach((item) => {
      const timeStr = item.time || "--:--";
      const isHigh = item.type === "PM";
      const icon = isHigh ? "🏔️" : "🌊";
      const heightStr =
        item.height !== undefined ? item.height.toFixed(2) + "m" : "";

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
