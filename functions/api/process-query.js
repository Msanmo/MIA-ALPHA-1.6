// ========================================
// MIA DIY ASSISTANT - CLOUDFLARE API FUNCTION
// Sistema Dual: OpenAI GPT-4o + Google Gemini
// CON BÚSQUEDA OPTIMIZADA DE PRODUCTOS
// VERSIÓN CORREGIDA - RESPUESTAS JSON LIMPIAS
// ========================================

// MIA API v2.1 - With Environment Variables
export async function onRequest(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log('📥 Request received');
    
    // Parse request body
    const body = await request.json();
    console.log('📝 Body parsed:', { query: body.query?.substring(0, 50), language: body.language });
    
    const { query, language = 'es', conversationHistory = [] } = body;

    if (!query) {
      console.error('❌ Missing query parameter');
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Cargar catálogo de productos - HYBRID: Catálogo completo + productos populares hardcodeados
    console.log('📦 Loading product catalog...');
    
    // Productos populares hardcodeados (siempre disponibles)
    const popularProducts = [

        {"id":"82685513","name":"Taladro percutor inalámbrico BOSCH PSB 1800 LI-2 18V","brand":"BOSCH","price":89.99,"category":"Herramientas eléctricas","subcategory":"Taladros","keywords":["taladro","percutor","inalámbrico","batería","18v","bosch","barato"],"description_short":"Taladro percutor inalámbrico de 18V con batería de litio","description_long":"Taladro percutor inalámbrico de 18V con batería de litio de 2.0Ah, ideal para trabajos de bricolaje. Incluye función percutora para trabajar en mampostería, 2 velocidades mecánicas y regulación electrónica de velocidad.","use_recommendation":"Perfecto para taladrar en madera, metal y mampostería. Ideal para bricolaje en casa.","image":"https://media.leroymerlin.es/product/82685513/82685513_001.jpg","rating":5,"reviews":245,"inStock":true,"features":["Potencia 18V","Batería de litio 2.0Ah","Función percutora","2 velocidades","Luz LED integrada"]},
        {"id":"15256987","name":"Taladro atornillador DEXTER POWER 12V","brand":"DEXTER","price":34.99,"category":"Herramientas eléctricas","subcategory":"Taladros","keywords":["taladro","atornillador","12v","económico","barato","dexter"],"description_short":"Taladro atornillador compacto de 12V perfecto para bricolaje básico","description_long":"Taladro atornillador inalámbrico de 12V con diseño compacto y ligero. Incluye batería de 1.5Ah y cargador rápido. Perfecto para tareas de bricolaje básicas en el hogar.","use_recommendation":"Ideal para montaje de muebles, pequeñas reparaciones y bricolaje ocasional.","image":"https://media.leroymerlin.es/product/15256987/15256987_001.jpg","rating":4,"reviews":128,"inStock":true,"features":["Potencia 12V","Batería 1.5Ah incluida","Diseño compacto","Cargador rápido","Mandril automático"]},
        {"id":"17889452","name":"Juego de brocas y puntas BOSCH 103 piezas","brand":"BOSCH","price":24.99,"category":"Accesorios herramientas","subcategory":"Brocas","keywords":["brocas","puntas","accesorios","taladro","bosch","juego"],"description_short":"Set completo de 103 piezas con brocas y puntas para todo tipo de trabajos","description_long":"Juego profesional de 103 piezas que incluye brocas para madera, metal y mampostería, puntas de atornillar, adaptadores y llaves de vaso. Todo organizado en maletín compacto.","use_recommendation":"Complemento perfecto para cualquier taladro. Cubre todas las necesidades básicas de bricolaje.","image":"https://media.leroymerlin.es/product/17889452/17889452_001.jpg","rating":5,"reviews":567,"inStock":true,"features":["103 piezas","Brocas para madera, metal y mampostería","Puntas de atornillar","Maletín organizador","Calidad profesional"]},
        {"id":"81473621","name":"Lijadora orbital BOSCH PSM 200 AES 200W","brand":"BOSCH","price":69.99,"category":"Herramientas eléctricas","subcategory":"Lijadoras","keywords":["lijadora","orbital","bosch","madera","pintura"],"description_short":"Lijadora orbital de 200W con sistema antivibraciones","description_long":"Lijadora orbital de 200W con sistema antivibraciones AES, perfecto para lijar grandes superficies de madera. Incluye microfiltro para trabajo sin polvo y empuñadura ergonómica Softgrip.","use_recommendation":"Ideal para preparar superficies antes de pintar, renovar muebles o trabajos de carpintería.","image":"https://media.leroymerlin.es/product/81473621/81473621_001.jpg","rating":5,"reviews":312,"inStock":true,"features":["Potencia 200W","Sistema antivibraciones AES","Microfiltro incluido","Empuñadura Softgrip","Cambio rápido de lija"]},
        {"id":"16584239","name":"Martillo de carpintero STANLEY 450g mango fibra","brand":"STANLEY","price":12.99,"category":"Herramientas manuales","subcategory":"Martillos","keywords":["martillo","carpintero","stanley","manual","barato"],"description_short":"Martillo de carpintero con mango de fibra de vidrio","description_long":"Martillo de carpintero de 450g con mango de fibra de vidrio que absorbe vibraciones. Cabeza forjada en acero de alta calidad con tratamiento antioxidante.","use_recommendation":"Herramienta básica para clavar, extraer clavos y trabajos generales de carpintería.","image":"https://media.leroymerlin.es/product/16584239/16584239_001.jpg","rating":4,"reviews":89,"inStock":true,"features":["Peso 450g","Mango fibra de vidrio","Cabeza de acero forjado","Agarre ergonómico","Extractor de clavos"]},
        {"id":"82461573","name":"Sierra circular BOSCH PKS 55 A 1200W","brand":"BOSCH","price":119.99,"category":"Herramientas eléctricas","subcategory":"Sierras","keywords":["sierra","circular","bosch","cortar","madera"],"description_short":"Sierra circular de 1200W para cortes precisos en madera","description_long":"Sierra circular de 1200W con disco de 160mm, ideal para cortes rectos en madera. Incluye guía paralela, profundidad de corte hasta 55mm y sistema de soplado para línea de corte visible.","use_recommendation":"Perfecta para cortar tableros, listones y todo tipo de maderas en proyectos de bricolaje.","image":"https://media.leroymerlin.es/product/82461573/82461573_001.jpg","rating":5,"reviews":428,"inStock":true,"features":["Potencia 1200W","Disco 160mm","Profundidad corte 55mm","Guía paralela incluida","Sistema de soplado"]},
        {"id":"15982347","name":"Destornillador eléctrico DEXTER 3.6V","brand":"DEXTER","price":19.99,"category":"Herramientas eléctricas","subcategory":"Destornilladores","keywords":["destornillador","eléctrico","dexter","barato","económico"],"description_short":"Destornillador eléctrico compacto de 3.6V ideal para tareas ligeras","description_long":"Destornillador eléctrico de 3.6V con batería de litio integrada. Diseño compacto y ligero, perfecto para atornillar muebles y pequeños trabajos. Incluye 6 puntas intercambiables.","use_recommendation":"Ideal para montaje de muebles IKEA, pequeñas reparaciones y bricolaje ocasional.","image":"https://media.leroymerlin.es/product/15982347/15982347_001.jpg","rating":4,"reviews":156,"inStock":true,"features":["Batería 3.6V integrada","6 puntas incluidas","Diseño compacto","Luz LED","Cable USB de carga"]},
        {"id":"17325648","name":"Pintura plástica blanca LUXENS 15L interior","brand":"LUXENS","price":39.99,"category":"Pinturas","subcategory":"Pintura interior","keywords":["pintura","blanca","interior","pared","luxens"],"description_short":"Pintura plástica blanca mate para interiores, gran cubrimiento","description_long":"Pintura plástica blanca mate de alta calidad para interiores. Excelente cubrimiento y rendimiento de hasta 75m² con una sola mano. Secado rápido y sin olor.","use_recommendation":"Perfecta para pintar paredes y techos de salones, dormitorios y pasillos.","image":"https://media.leroymerlin.es/product/17325648/17325648_001.jpg","rating":5,"reviews":892,"inStock":true,"features":["15 litros","Acabado mate","Rendimiento 75m²","Secado rápido","Sin olor"]},
        {"id":"14785692","name":"Rodillo de pintura DEXTER 18cm con bandeja","brand":"DEXTER","price":7.99,"category":"Accesorios pintura","subcategory":"Rodillos","keywords":["rodillo","pintura","brocha","accesorios","dexter"],"description_short":"Kit completo con rodillo de 18cm y bandeja para pintura","description_long":"Set de pintura con rodillo de 18cm de pelo medio, mango telescópico y bandeja de plástico resistente. Ideal para pintar paredes y techos con pinturas plásticas.","use_recommendation":"Herramienta básica para pintar cualquier superficie interior lisa.","image":"https://media.leroymerlin.es/product/14785692/14785692_001.jpg","rating":4,"reviews":234,"inStock":true,"features":["Rodillo 18cm","Mango extensible","Bandeja incluida","Pelo medio","Fácil limpieza"]},
        {"id":"16984523","name":"Escalera aluminio HAILO 3 peldaños","brand":"HAILO","price":49.99,"category":"Escaleras y andamios","subcategory":"Escaleras","keywords":["escalera","aluminio","peldaños","hailo","doméstica"],"description_short":"Escalera doméstica de aluminio con 3 peldaños antideslizantes","description_long":"Escalera de aluminio de 3 peldaños con sistema de seguridad, peldaños antideslizantes extra anchos y bandeja superior para herramientas. Soporta hasta 150kg.","use_recommendation":"Ideal para trabajos en altura como pintar techos, cambiar bombillas o acceder a armarios altos.","image":"https://media.leroymerlin.es/product/16984523/16984523_001.jpg","rating":5,"reviews":345,"inStock":true,"features":["3 peldaños","Aluminio ligero","Carga máxima 150kg","Peldaños antideslizantes","Bandeja porta-herramientas"]},
        {"id":"82547893","name":"Cinta métrica STANLEY 5m FatMax magnética","brand":"STANLEY","price":16.99,"category":"Herramientas de medición","subcategory":"Cintas métricas","keywords":["cinta","métrica","medición","stanley","fatmax"],"description_short":"Cinta métrica profesional de 5m con gancho magnético","description_long":"Cinta métrica FatMax de 5m con cinta de 32mm de ancho para mayor rigidez. Gancho magnético y protección BladeArmor que duplica su vida útil.","use_recommendation":"Herramienta esencial para cualquier trabajo de bricolaje, construcción o carpintería.","image":"https://media.leroymerlin.es/product/82547893/82547893_001.jpg","rating":5,"reviews":678,"inStock":true,"features":["Longitud 5m","Cinta 32mm ancha","Gancho magnético","Protección BladeArmor","Freno de seguridad"]},
        {"id":"15874236","name":"Nivel láser BOSCH Quigo Plus con soporte","brand":"BOSCH","price":89.99,"category":"Herramientas de medición","subcategory":"Niveles láser","keywords":["nivel","láser","bosch","medición","alineación"],"description_short":"Nivel láser de líneas cruzadas con soporte y alcance 7m","description_long":"Nivel láser Quigo Plus que proyecta líneas horizontales y verticales cruzadas con precisión de ±0.8mm/m. Incluye soporte MM2 y alcance de hasta 7m.","use_recommendation":"Perfecto para colgar cuadros, instalar estanterías o cualquier trabajo que requiera alineación precisa.","image":"https://media.leroymerlin.es/product/15874236/15874236_001.jpg","rating":5,"reviews":423,"inStock":true,"features":["Líneas cruzadas","Alcance 7m","Precisión ±0.8mm/m","Soporte MM2 incluido","Autonivelación"]}
    ];
    
    let allProducts = [...popularProducts]; // Empezar con productos populares
    
    // Intentar cargar catálogo completo y MEZCLAR
    try {
      const catalogUrl = new URL('/products-catalog.json', request.url);
      console.log('🔗 Catalog URL:', catalogUrl.toString());
      
      const catalogResponse = await fetch(catalogUrl.toString());
      if (catalogResponse.ok) {
        const catalogData = await catalogResponse.json();
        const catalogProducts = catalogData.products || catalogData;
        
        // MEZCLAR: productos populares + catálogo completo
        allProducts = [...popularProducts, ...catalogProducts];
        console.log('✅ HYBRID catalog loaded: ', popularProducts.length, 'popular +', catalogProducts.length, 'from file =', allProducts.length, 'total');
      } else {
        throw new Error('Catalog file not found, using popular products only');
      }
    } catch (error) {
      console.log('⚠️ Using popular products only (', popularProducts.length, 'products)');
    }

    // 🚀 OPTIMIZACIÓN: Buscar productos relevantes por keywords
    const relevantProducts = searchRelevantProducts(query, conversationHistory, allProducts);

    // System prompts por idioma - AHORA CON PRODUCTOS FILTRADOS
    const systemPrompts = {
      es: `Eres MIA, asistente bricolaje de Leroy Merlin España.

🎯 REGLAS CRÍTICAS:
1. Si el usuario menciona un PRODUCTO ESPECÍFICO (taladro, sierra, martillo, etc.) → PUEDES recomendar productos YA
2. Si la consulta es VAGA ("necesito herramientas", "algo para la casa") → HAZ PREGUNTAS para entender qué necesita
3. Puedes hacer preguntas para REFINAR (presupuesto, marca preferida), pero NO es obligatorio
4. NUNCA respondas con texto tipo "Voy a buscar..." - haz pregunta O devuelve JSON
5. Máximo 4 preguntas antes de recomendar
6. SIEMPRE usar productos reales del catálogo

📋 PRODUCTOS RELEVANTES (${relevantProducts.length} disponibles):
${JSON.stringify(relevantProducts)}

💬 DECISIÓN INTELIGENTE:

PUEDE RECOMENDAR YA (producto específico mencionado):
✅ "taladro" → JSON con 3 taladros variados (PUEDES preguntar presupuesto, pero NO es obligatorio)
✅ "sierra" → JSON con 3 sierras (PUEDES preguntar tipo de sierra, pero NO es obligatorio)
✅ "pintura" → JSON con 3 pinturas (PUEDES preguntar color/uso, pero NO es obligatorio)
✅ "taladro inalámbrico" → JSON YA (tiene producto + característica)
✅ "taladro económico" → JSON YA (tiene producto + precio)
✅ "taladro BOSCH" → JSON YA (tiene producto + marca)

DEBE PREGUNTAR (consulta vaga):
❌ "necesito herramientas" → Pregunta: ¿Qué tipo de herramientas? ¿Para qué proyecto?
❌ "quiero algo para la casa" → Pregunta: ¿Qué tipo de trabajo vas a hacer?
❌ "dame algo" → Pregunta: ¿Qué necesitas exactamente?

💡 FILOSOFÍA: Si mencionan un producto concreto, ya puedes ayudar mostrando opciones. Las preguntas son para REFINAR, no para retrasar.

🎯 FORMATO DE RESPUESTA CUANDO HAY PRODUCTOS (USA ESTE FORMATO INMEDIATAMENTE):
Responde ÚNICAMENTE el JSON LIMPIO (sin markdown, sin backticks, sin texto adicional):
{
  "ready": true,
  "recommendations": [
    {"id": "ID_REAL", "name": "Nombre exacto", "price": precio_real, "category": "Categoría", "image": "url_imagen", "rating": rating_producto, "reviews": num_reviews, "brand": "Marca", "description_short": "descripción_corta", "description_long": "descripción_larga", "use_recommendation": "recomendación_uso", "features": ["lista", "características"], "reason": "Por qué encaja (1 línea)"},
    {"id": "ID_REAL", "name": "Nombre exacto", "price": precio_real, "category": "Categoría", "image": "url_imagen", "rating": rating_producto, "reviews": num_reviews, "brand": "Marca", "description_short": "descripción_corta", "description_long": "descripción_larga", "use_recommendation": "recomendación_uso", "features": ["lista", "características"], "reason": "Alternativa (1 línea)"},
    {"id": "ID_REAL", "name": "Nombre exacto", "price": precio_real, "category": "Categoría", "image": "url_imagen", "rating": rating_producto, "reviews": num_reviews, "brand": "Marca", "description_short": "descripción_corta", "description_long": "descripción_larga", "use_recommendation": "recomendación_uso", "features": ["lista", "características"], "reason": "Tercera opción (1 línea)"}
  ]
}

⚠️ IMPORTANTE: 
- Usa SOLO productos del catálogo con TODOS sus datos EXACTOS
- NO uses markdown en respuestas JSON
- NUNCA respondas con texto conversacional si puedes recomendar productos
- Si el usuario pregunta por un producto específico → JSON INMEDIATO`,
      en: `You are MIA, Leroy Merlin Spain's DIY assistant.

🎯 CRITICAL RULES:
1. If user mentions a SPECIFIC PRODUCT (drill, saw, hammer, etc.) → YOU CAN recommend products NOW
2. If query is VAGUE ("I need tools", "something for home") → ASK QUESTIONS to understand what they need
3. You can ask questions to REFINE (budget, preferred brand), but it's NOT mandatory
4. NEVER respond with text like "I'll search..." - ask question OR return JSON
5. Maximum 4 questions before recommending
6. ALWAYS use real products from catalog

📋 RELEVANT PRODUCTS (${relevantProducts.length} available):
${JSON.stringify(relevantProducts)}

💬 SMART DECISION:

CAN RECOMMEND NOW (specific product mentioned):
✅ "drill" → JSON with 3 varied drills (CAN ask budget, but NOT required)
✅ "saw" → JSON with 3 saws (CAN ask type, but NOT required)
✅ "paint" → JSON with 3 paints (CAN ask color/use, but NOT required)
✅ "cordless drill" → JSON NOW (has product + feature)
✅ "cheap drill" → JSON NOW (has product + price)
✅ "BOSCH drill" → JSON NOW (has product + brand)

MUST ASK (vague query):
❌ "I need tools" → Ask: What type of tools? For what project?
❌ "I want something for home" → Ask: What kind of work will you do?
❌ "give me something" → Ask: What exactly do you need?

💡 PHILOSOPHY: If they mention a concrete product, you can already help by showing options. Questions are to REFINE, not to delay.

🎯 RESPONSE FORMAT WHEN PRODUCTS AVAILABLE (USE THIS FORMAT IMMEDIATELY):
Respond ONLY clean JSON (no markdown, no backticks, no additional text):
{
  "ready": true,
  "recommendations": [
    {"id": "REAL_ID", "name": "Exact name", "price": real_price, "category": "Category", "image": "image_url", "rating": product_rating, "reviews": num_reviews, "brand": "Brand", "description_short": "short_description", "description_long": "long_description", "use_recommendation": "usage_recommendation", "features": ["feature", "list"], "reason": "Why it fits (1 line)"},
    {"id": "REAL_ID", "name": "Exact name", "price": real_price, "category": "Category", "image": "image_url", "rating": product_rating, "reviews": num_reviews, "brand": "Brand", "description_short": "short_description", "description_long": "long_description", "use_recommendation": "usage_recommendation", "features": ["feature", "list"], "reason": "Alternative (1 line)"},
    {"id": "REAL_ID", "name": "Exact name", "price": real_price, "category": "Category", "image": "image_url", "rating": product_rating, "reviews": num_reviews, "brand": "Brand", "description_short": "short_description", "description_long": "long_description", "use_recommendation": "usage_recommendation", "features": ["feature", "list"], "reason": "Third option (1 line)"}
  ]
}

⚠️ IMPORTANT: 
- Use ONLY products from catalog with ALL exact data
- DO NOT use markdown in JSON responses
- NEVER respond with conversational text if you can recommend products
- If user asks for specific product → IMMEDIATE JSON`
    };

    const systemPrompt = systemPrompts[language] || systemPrompts.es;

    // 🚀 ANÁLISIS DE CONTEXTO: Decidir si forzar recomendación
    const fullContext = [...conversationHistory.map(m => m.content), query].join(' ').toLowerCase();
    
    // Contar cuántas interacciones del usuario han habido
    const userInteractions = conversationHistory.filter(m => m.role === 'user').length + 1;
    
    // 🎯 DETECCIÓN INTELIGENTE: ¿Menciona un producto concreto?
    
    // ✅ PRODUCTO ESPECÍFICO (suficiente para recomendar)
    const hasSpecificProduct = /taladro|sierra|martillo|llave|destornillador|atornillador|lijadora|pintura|rodillo|brocha|nivel|cinta métrica|escalera|drill|saw|hammer|screwdriver|sander|paint|ladder/.test(fullContext);
    
    // ❌ CONSULTA GENÉRICA (necesita aclaración)
    const isVagueQuery = /^(necesito|quiero|busco|dame|recomienda|ayuda|algo)\s+(algo|cosas?|herramientas?|productos?)$/i.test(query.trim()) ||
                        /^(i need|i want|help|something|recommend)\s+(something|things?|tools?|products?)$/i.test(query.trim());
    
    // 🎯 Criterios adicionales (mejoran la recomendación pero NO son necesarios)
    let refinementCriteria = 0;
    
    // Precio/Presupuesto
    if (/(barato|económico|cheap|budget|presupuesto|caro|premium|€|euros?|dollars?)/.test(fullContext)) {
      refinementCriteria++;
    }
    
    // Uso específico
    if (/(casa|hogar|profesional|bricolaje|construcción|taller|ocasional|frecuente|home|professional|diy|workshop)/.test(fullContext)) {
      refinementCriteria++;
    }
    
    // Características técnicas
    if (/(inalámbrico|cable|batería|potencia|voltios|v|w|rpm|cordless|wired|battery|power)/.test(fullContext)) {
      refinementCriteria++;
    }
    
    // Marca específica
    if (/(bosch|dexter|stanley|makita|dewalt|black\+?decker|einhell)/.test(fullContext)) {
      refinementCriteria++;
    }
    
    // 🎯 LÓGICA SIMPLIFICADA:
    // - Producto específico mencionado → PUEDE recomendar (deja que GPT decida si pregunta para refinar)
    // - Consulta vaga ("necesito algo") → DEBE preguntar
    const hasSpecificRequest = hasSpecificProduct && !isVagueQuery;

    // Construir mensajes para la API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: query }
    ];

    // 🚀 LÓGICA DE FORZADO DE RECOMENDACIÓN
    let shouldForceRecommendation = false;
    let forceReason = '';

    // CASO 1: Producto específico mencionado desde el inicio
    if (userInteractions === 1 && hasSpecificRequest && relevantProducts.length > 0) {
      shouldForceRecommendation = true;
      forceReason = `Consulta inicial con producto específico (${refinementCriteria} criterios de refinamiento)`;
      console.log(`🎯 Producto específico detectado + ${refinementCriteria} criterios adicionales - Permitiendo recomendación`);
    }
    // CASO 2: Usuario ya respondió a preguntas de aclaración (1-3 preguntas)
    else if (userInteractions >= 2 && userInteractions <= 4 && hasSpecificRequest && relevantProducts.length > 0) {
      shouldForceRecommendation = true;
      forceReason = `Suficiente información después de ${userInteractions - 1} pregunta(s)`;
    }
    // CASO 3: LÍMITE MÁXIMO alcanzado (4+ interacciones) - FORZAR SÍ O SÍ
    else if (userInteractions >= 4 && relevantProducts.length > 0) {
      shouldForceRecommendation = true;
      forceReason = 'Límite máximo de 4 preguntas alcanzado - FORZANDO recomendación';
    }

    // Añadir mensaje de forzado si aplica
    if (shouldForceRecommendation) {
      const forceMessages = {
        es: `⚠️⚠️⚠️ OBLIGATORIO: ${forceReason}. 

Responde AHORA MISMO con el JSON completo de 3 productos del catálogo. 

NO escribas texto conversacional como "Voy a buscar..." o "Déjame ver..."
NO hagas más preguntas.
NO envíes markdown.

Respuesta esperada: Únicamente el JSON con estructura:
{
  "ready": true,
  "recommendations": [{...}, {...}, {...}]
}

Es OBLIGATORIO responder con JSON de productos AHORA.`,
        en: `⚠️⚠️⚠️ MANDATORY: ${forceReason}.

Respond RIGHT NOW with complete JSON of 3 products from catalog.

DO NOT write conversational text like "I'll search..." or "Let me see..."
DO NOT ask more questions.
DO NOT send markdown.

Expected response: Only the JSON with structure:
{
  "ready": true,
  "recommendations": [{...}, {...}, {...}]
}

It is MANDATORY to respond with product JSON NOW.`
      };
      
      messages.push({ role: 'system', content: forceMessages[language] || forceMessages.es });
      console.log(`🚀 FORZANDO RECOMENDACIÓN: ${forceReason} (Interacción ${userInteractions})`);
    } else {
      console.log(`💬 Permitiendo pregunta de aclaración (Interacción ${userInteractions}/4)`);
    }

    // API Keys - SOLO desde environment variables
    console.log('🔑 Checking env object:', {
      hasEnv: !!env,
      envKeys: env ? Object.keys(env) : 'NO ENV',
      openaiInEnv: env && 'OPENAI_API_KEY' in env,
      googleInEnv: env && 'GOOGLE_API_KEY' in env
    });
    
    const OPENAI_API_KEY = env?.OPENAI_API_KEY;
    const GOOGLE_API_KEY = env?.GOOGLE_API_KEY;
    
    console.log('🔑 API Keys status:', {
      openai: OPENAI_API_KEY ? `Available (${OPENAI_API_KEY.length} chars)` : 'MISSING',
      google: GOOGLE_API_KEY ? `Available (${GOOGLE_API_KEY.length} chars)` : 'MISSING'
    });
    
    // Validar que tengamos al menos una API key
    if (!OPENAI_API_KEY && !GOOGLE_API_KEY) {
      console.error('❌ NO API KEYS CONFIGURED');
      throw new Error('API keys not configured. Please set OPENAI_API_KEY or GOOGLE_API_KEY in Cloudflare environment variables.');
    }

    // Intentar con OpenAI primero
    let response;
    let usedModel = 'openai';

    if (OPENAI_API_KEY) {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.3,  // Reducido para más determinismo y mejor seguimiento de instrucciones
            max_tokens: 2000  // Aumentado para asegurar JSON completo sin truncamiento
          })
        });

        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          response = data.choices[0].message.content;
        } else {
          throw new Error('OpenAI API failed');
        }
      } catch (error) {
        console.error('OpenAI error, falling back to Gemini:', error);
        usedModel = 'gemini';
      }
    } else {
      usedModel = 'gemini';
    }

    // Fallback a Gemini si OpenAI falla o no está disponible
    if (!response && GOOGLE_API_KEY) {
      try {
        const geminiMessages = messages
          .filter(m => m.role !== 'system')
          .map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }));

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: geminiMessages,
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: {
                temperature: 0.3,  // Reducido para más determinismo
                maxOutputTokens: 2000  // Aumentado para asegurar JSON completo
              }
            })
          }
        );

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          response = data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Gemini API failed');
        }
      } catch (error) {
        console.error('Gemini error:', error);
        throw new Error('All AI providers failed');
      }
    }

    if (!response) {
      throw new Error('No AI response generated');
    }

    console.log('🤖 Raw AI response:', response);

    // ✅ LIMPIEZA MEJORADA DE RESPUESTA JSON
    let cleanResponse = response.trim();
    
    // Remover markdown code blocks si existen
    cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/\s*```/g, '');
    
    // Remover cualquier texto antes del JSON
    const jsonStartIndex = cleanResponse.indexOf('{');
    if (jsonStartIndex > 0) {
      cleanResponse = cleanResponse.substring(jsonStartIndex);
    }
    
    // Remover cualquier texto después del JSON
    const jsonEndIndex = cleanResponse.lastIndexOf('}');
    if (jsonEndIndex >= 0 && jsonEndIndex < cleanResponse.length - 1) {
      cleanResponse = cleanResponse.substring(0, jsonEndIndex + 1);
    }

    // Detectar si es una respuesta con recomendaciones (JSON)
    let parsedResponse;
    let isRecommendation = false;
    
    try {
      parsedResponse = JSON.parse(cleanResponse);
      if (parsedResponse.ready && parsedResponse.recommendations && Array.isArray(parsedResponse.recommendations)) {
        console.log('✅ JSON válido detectado con', parsedResponse.recommendations.length, 'recomendaciones');
        isRecommendation = true;
        
        return new Response(JSON.stringify({
          response: cleanResponse, // Devolver el JSON limpio como string
          isRecommendation: true,
          recommendations: parsedResponse.recommendations,
          model: usedModel
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (jsonError) {
      console.log('📝 No es JSON válido, tratando como respuesta de texto:', jsonError.message);
      // Es una respuesta de texto normal
    }

    // Respuesta de texto normal
    return new Response(JSON.stringify({
      response: response, // Respuesta original sin modificar
      isRecommendation: false,
      model: usedModel
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error stack:', error.stack);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n') // Primeras 3 líneas del stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// 🚀 FUNCIÓN DE BÚSQUEDA OPTIMIZADA CON FILTROS DE PRECIO
function searchRelevantProducts(query, conversationHistory, allProducts) {
  // Combinar query actual + historial para contexto completo
  const fullContext = [
    ...conversationHistory.map(m => m.content),
    query
  ].join(' ').toLowerCase();

  // 💰 DETECTAR FILTROS DE PRECIO
  const priceFilters = {
    barato: fullContext.includes('barato') || fullContext.includes('económico') || fullContext.includes('cheap'),
    caro: fullContext.includes('caro') || fullContext.includes('premium') || fullContext.includes('expensive'),
    presupuesto: fullContext.includes('presupuesto') || fullContext.includes('budget')
  };

  // Keywords por categoría MEJORADOS
  const categoryKeywords = {
    taladro: ['taladro', 'taladra', 'drill', 'percutor', 'atornillador', 'destornillador', 'screwdriver', 'perforar', 'agujero', 'tornillo'],
    sierra: ['sierra', 'serrar', 'saw', 'cortar', 'corte', 'madera', 'cutting'],
    martillo: ['martillo', 'hammer', 'clavo', 'golpe', 'nail'],
    pintura: ['pintura', 'pintar', 'paint', 'rodillo', 'brocha', 'color', 'esmalte', 'pared', 'decorar'],
    jardín: ['jardín', 'garden', 'planta', 'césped', 'riego', 'maceta', 'tierra', 'jardinería'],
    iluminación: ['luz', 'lámpara', 'bombilla', 'led', 'foco', 'light', 'downlight', 'iluminar'],
    baño: ['baño', 'bathroom', 'ducha', 'grifo', 'lavabo', 'inodoro', 'toilet', 'azulejo'],
    cocina: ['cocina', 'kitchen', 'encimera', 'fregadero', 'mueble cocina', 'cocinar'],
    herramientas: ['herramienta', 'tool', 'llave', 'nivel', 'metro', 'caja herramientas'],
    electricidad: ['cable', 'enchufe', 'interruptor', 'eléctrico', 'electric', 'instalación', 'corriente'],
    fontanería: ['tubería', 'tubo', 'plumbing', 'fontanería', 'desagüe', 'agua', 'cañería'],
    materiales: ['cemento', 'ladrillo', 'madera', 'tornillo', 'clavo', 'silicona', 'construcción'],
    decoración: ['decoración', 'decoration', 'cuadro', 'espejo', 'cortina', 'alfombra', 'decorar'],
    limpieza: ['limpieza', 'fregona', 'cubo', 'cleaning', 'mopa', 'escoba', 'limpiar'],
    seguridad: ['cerradura', 'candado', 'alarma', 'security', 'seguridad', 'protección']
  };

  // Detectar categorías relevantes
  const relevantCategories = [];
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => fullContext.includes(keyword))) {
      relevantCategories.push(category);
    }
  }

  // Si no hay categorías detectadas, usar productos populares
  if (relevantCategories.length === 0) {
    return allProducts.slice(0, 30); // Top 30 productos
  }

  // Filtrar productos por categoría y keywords
  let filtered = allProducts.filter(product => {
    const productText = `${product.name} ${product.category} ${product.description || ''}`.toLowerCase();
    
    // Buscar coincidencias con keywords de categorías relevantes
    for (const category of relevantCategories) {
      const keywords = categoryKeywords[category];
      if (keywords.some(keyword => productText.includes(keyword))) {
        return true;
      }
    }
    
    return false;
  });

  // 💰 APLICAR FILTROS DE PRECIO
  if (priceFilters.barato || priceFilters.presupuesto) {
    // Ordenar por precio ascendente y tomar los más baratos
    filtered = filtered
      .sort((a, b) => a.price - b.price)
      .filter(product => product.price <= 60); // Máximo 60€ para "barato"
  } else if (priceFilters.caro) {
    // Productos premium (más caros)
    filtered = filtered
      .sort((a, b) => b.price - a.price)
      .filter(product => product.price >= 150);
  } else {
    // Sin filtro específico, ordenar por popularidad/rating
    filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Limitar a 40 productos para mantener velocidad
  const limitedResults = filtered.slice(0, 40);
  
  // Si encontramos muy pocos, añadir productos populares
  if (limitedResults.length < 20) {
    const additionalProducts = allProducts
      .filter(p => !limitedResults.find(r => r.id === p.id))
      .slice(0, 20 - limitedResults.length);
    return [...limitedResults, ...additionalProducts];
  }

  return limitedResults;
}