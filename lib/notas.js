import {
  IconCitrico,
  IconFrutal,
  IconFloral,
  IconEspeciado,
  IconAmaderado,
  IconCuero,
  IconAmbar,
  IconGourmand,
  IconAlmizcle,
  IconAcuatico,
  IconHerbal,
  IconAromaGenerico,
} from "@/components/iconsNotas";

// Cada nota puntual (tal como aparece en data/perfumes.json) se agrupa en una
// familia olfativa para mostrar un ícono consistente. Si aparece una nota
// nueva que no está en el mapa, el fallback busca por palabra clave y, si
// tampoco matchea, usa un ícono genérico en vez de romper.
const NOTA_A_FAMILIA = {
  "azafrán": "especiado",
  "acorde a bourbon": "ambar",
  "cuero": "cuero",
  "cedro": "amaderado",
  "vainilla": "gourmand",
  "ámbar": "ambar",
  "ambar": "ambar",
  "haba tonka": "gourmand",
  "manzana": "frutal",
  "canela": "especiado",
  "rosa": "floral",
  "frutas tropicales": "frutal",
  "notas acuáticas": "acuatico",
  "notas acuaticas": "acuatico",
  "salvia": "herbal",
  "pimienta rosa": "especiado",
  "piña": "frutal",
  "pina": "frutal",
  "mango": "frutal",
  "cardamomo": "especiado",
  "especias": "especiado",
  "notas amaderadas": "amaderado",
  "almizcle": "almizcle",
  "bergamota": "citrico",
  "limón": "citrico",
  "limon": "citrico",
  "pomelo": "citrico",
  "mandarina": "citrico",
  "jazmín": "floral",
  "jazmin": "floral",
  "flor de azahar": "floral",
  "lavanda": "floral",
  "sándalo": "amaderado",
  "sandalo": "amaderado",
  "oud": "amaderado",
  "vetiver": "amaderado",
  "incienso": "ambar",
  "café": "gourmand",
  "cafe": "gourmand",
  "cacao": "gourmand",
  "almendra": "gourmand",
};

const FAMILIA_KEYWORDS = {
  citrico: ["limón", "limon", "citr", "pomelo", "mandarina", "bergamota"],
  frutal: ["fruta", "manzana", "piña", "pina", "mango", "pera", "grosella", "cassis"],
  floral: ["flor", "rosa", "jazm", "azahar", "lavanda", "tuberosa"],
  especiado: ["pimient", "canela", "azafrán", "azafran", "cardamomo", "especia", "nuez moscada", "jengibre"],
  amaderado: ["ceded", "cedro", "madera", "sándalo", "sandalo", "oud", "vetiver", "palo de rosa"],
  cuero: ["cuero"],
  ambar: ["ámbar", "ambar", "incienso", "bourbon", "resina"],
  gourmand: ["vainilla", "tonka", "cacao", "café", "cafe", "almendra", "miel"],
  almizcle: ["almizcle", "musc"],
  acuatico: ["acuátic", "acuatic", "marin", "menta"],
  herbal: ["salvia", "hierba", "geranio", "romero"],
};

const ICONOS = {
  citrico: IconCitrico,
  frutal: IconFrutal,
  floral: IconFloral,
  especiado: IconEspeciado,
  amaderado: IconAmaderado,
  cuero: IconCuero,
  ambar: IconAmbar,
  gourmand: IconGourmand,
  almizcle: IconAlmizcle,
  acuatico: IconAcuatico,
  herbal: IconHerbal,
};

export function iconoDeNota(nota) {
  const clave = nota.trim().toLowerCase();
  let familia = NOTA_A_FAMILIA[clave];

  if (!familia) {
    familia = Object.keys(FAMILIA_KEYWORDS).find((fam) =>
      FAMILIA_KEYWORDS[fam].some((kw) => clave.includes(kw))
    );
  }

  return ICONOS[familia] ?? IconAromaGenerico;
}
