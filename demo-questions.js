// ========================================
// MIA DIY ASSISTANT - PREGUNTAS DEMO
// Preguntas hardcoded que siempre devuelven productos con fotos reales
// ========================================

// Productos con fotos reales (image_source: "product_real")
const PRODUCTOS_CON_FOTOS = [
  "LM-81880755", // Taladro BOSCH 800W
  "LM-82489168", // Taladro MAKITA 18V
  "LM-81976529", // Sierra DEWALT 18V
  "LM-89166416", // Amoladora BLACK+DECKER 760W
  "LM-82950324"  // Lijadora STANLEY 280W
];

// Preguntas demo con sus productos asociados
const DEMO_QUESTIONS = {
  // ESPAÑOL
  'necesito un taladro profesional': ['LM-81880755', 'LM-82489168'],
  'quiero un taladro potente': ['LM-81880755', 'LM-82489168'],
  'busco un taladro para obras': ['LM-81880755', 'LM-82489168'],
  'necesito herramientas bosch': ['LM-81880755'],
  'quiero herramientas makita': ['LM-82489168'],
  
  'necesito una sierra circular': ['LM-81976529'],
  'quiero una sierra para madera': ['LM-81976529'],
  'busco una sierra dewalt': ['LM-81976529'],
  
  'necesito una amoladora económica': ['LM-89166416'],
  'quiero una amoladora barata': ['LM-89166416'],
  'busco una amoladora para bricolaje': ['LM-89166416'],
  
  'necesito una lijadora orbital': ['LM-82950324'],
  'quiero una lijadora stanley': ['LM-82950324'],
  'busco una lijadora para madera': ['LM-82950324'],
  
  'necesito herramientas para carpintería': ['LM-81976529', 'LM-82950324'],
  'quiero herramientas profesionales': ['LM-81880755', 'LM-82489168', 'LM-81976529'],
  'busco herramientas eléctricas': PRODUCTOS_CON_FOTOS,
  
  // ENGLISH
  'i need a professional drill': ['LM-81880755', 'LM-82489168'],
  'i want a powerful drill': ['LM-81880755', 'LM-82489168'],
  'i need a circular saw': ['LM-81976529'],
  'i want an affordable grinder': ['LM-89166416'],
  'i need an orbital sander': ['LM-82950324'],
  'i need carpentry tools': ['LM-81976529', 'LM-82950324'],
  
  // FRANÇAIS
  'j\'ai besoin d\'une perceuse professionnelle': ['LM-81880755', 'LM-82489168'],
  'je veux une perceuse puissante': ['LM-81880755', 'LM-82489168'],
  'j\'ai besoin d\'une scie circulaire': ['LM-81976529'],
  'je veux une meuleuse économique': ['LM-89166416'],
  'j\'ai besoin d\'une ponceuse orbitale': ['LM-82950324'],
  
  // DEUTSCH
  'ich brauche einen professionellen bohrer': ['LM-81880755', 'LM-82489168'],
  'ich möchte einen leistungsstarken bohrer': ['LM-81880755', 'LM-82489168'],
  'ich brauche eine kreissäge': ['LM-81976529'],
  'ich möchte einen günstigen winkelschleifer': ['LM-89166416'],
  
  // ITALIANO
  'ho bisogno di un trapano professionale': ['LM-81880755', 'LM-82489168'],
  'voglio un trapano potente': ['LM-81880755', 'LM-82489168'],
  'ho bisogno di una sega circolare': ['LM-81976529'],
  'voglio una smerigliatrice economica': ['LM-89166416'],
  
  // SVENSKA
  'jag behöver en professionell borr': ['LM-81880755', 'LM-82489168'],
  'jag vill ha en kraftfull borr': ['LM-81880755', 'LM-82489168'],
  'jag behöver en cirkelsåg': ['LM-81976529']
};

/**
 * Verifica si una query del usuario coincide con una pregunta demo
 * @param {string} userQuery - Query del usuario (normalizada a minúsculas)
 * @returns {Array|null} - Array de IDs de productos o null si no es demo
 */
function checkDemoQuestion(userQuery) {
  const normalized = userQuery.toLowerCase().trim();
  
  // Búsqueda exacta
  if (DEMO_QUESTIONS[normalized]) {
    return DEMO_QUESTIONS[normalized];
  }
  
  // Búsqueda parcial (contiene)
  for (const [demoQuery, productIds] of Object.entries(DEMO_QUESTIONS)) {
    if (normalized.includes(demoQuery) || demoQuery.includes(normalized)) {
      return productIds;
    }
  }
  
  return null;
}

/**
 * Obtiene todos los productos con fotos reales
 * @returns {Array} - Array de IDs de productos con fotos
 */
function getAllProductsWithPhotos() {
  return PRODUCTOS_CON_FOTOS;
}

// Exportar para uso en Node.js o navegador
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEMO_QUESTIONS,
    PRODUCTOS_CON_FOTOS,
    checkDemoQuestion,
    getAllProductsWithPhotos
  };
}
