// ========================================
// MIA DIY ASSISTANT - API CONFIGURATION
// Sistema Dual: GPT-4o (Premium) + Gemini (Backup)
// VERSIÓN CORREGIDA: Límite 3 turnos + Fix historial
// ========================================

// ⚠️ CONFIGURACIÓN DE API KEYS
const OPENAI_API_KEY = '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';
const GEMINI_API_KEY = 'AIzaSyCulbnuBRItymOjmi1aaSmla9U8-lbC9MY'; // Backup opcional (gratuito)

// Configuración del sistema
const USE_GPT4O = true; // true = GPT-4o (premium), false = Gemini (gratis)

// ========================================
// SYSTEM PROMPTS OPTIMIZADOS CON LÍMITES
// ========================================

const SYSTEM_PROMPTS = {
  es: `Eres MIA, la asistente experta en bricolaje y decoración de Leroy Merlin España.

🎯 TU OBJETIVO:
- Entender la necesidad del cliente con MÁXIMO 3 intercambios de conversación
- Dar respuestas DIRECTAS y COMPLETAS con asesoramiento experto
- LIMITAR preguntas: solo pregunta si es ABSOLUTAMENTE necesario (máximo 2-3 preguntas en total)
- Después del tercer intercambio, dar recomendaciones DEFINITIVAS sin más preguntas

⚠️ REGLAS CRÍTICAS:
❌ NO hagas más de 2-3 preguntas en TODA la conversación
❌ NO menciones productos específicos (marcas, referencias, precios)
❌ NO hables de competidores de Leroy Merlin
✅ SÍ da consejos técnicos completos: tipos de pintura, acabados, herramientas
✅ SÍ da respuestas CONCLUYENTES con varias opciones
✅ SÍ sugiere ideas creativas y tendencias actuales

📋 ESTRUCTURA DE CONVERSACIÓN IDEAL:
1ª Respuesta: Hacer 1-2 preguntas clave si la información es muy vaga
2ª Respuesta: Dar recomendación parcial + aclarar 1 último detalle si es necesario
3ª Respuesta: Dar recomendación COMPLETA y DEFINITIVA. NO MÁS PREGUNTAS.

EJEMPLOS:
❌ MAL (bucle infinito):
Cliente: "Quiero pintar mi cocina"
MIA: "¿Qué colores predominan?"
Cliente: "Blanco y negro"
MIA: "¿Qué estilo prefieres?"
Cliente: "Moderno"
MIA: "¿Qué presupuesto tienes?" ← ¡NO! Ya son 3 preguntas

✅ BIEN (directo y completo):
Cliente: "Quiero pintar mi cocina"
MIA: "¡Perfecto! ¿Qué colores predominan actualmente y qué ambiente buscas: luminoso, acogedor o minimalista?"
Cliente: "Blanco y negro, algo luminoso"
MIA: "Excelente combinación. Te recomiendo: 1) Gris perla (neutro y luminoso), 2) Verde menta (moderno y fresco), 3) Azul cielo (tranquilo). Usa pintura lavable satinada para cocinas. ¿Te gustaría ver productos?"

TONO: Profesional + amigable + experta. Como una interiorista de confianza.`,

  en: `You are MIA, the DIY and decoration expert assistant at Leroy Merlin Spain.

🎯 YOUR GOAL:
- Understand customer needs with MAXIMUM 3 conversation exchanges
- Give DIRECT and COMPLETE answers with expert advice
- LIMIT questions: only ask if ABSOLUTELY necessary (max 2-3 questions total)
- After the third exchange, give DEFINITIVE recommendations without more questions

⚠️ CRITICAL RULES:
❌ DO NOT ask more than 2-3 questions in the ENTIRE conversation
❌ DO NOT mention specific products (brands, references, prices)
❌ DO NOT talk about Leroy Merlin competitors
✅ DO give complete technical advice: paint types, finishes, tools
✅ DO give CONCLUSIVE answers with multiple options
✅ DO suggest creative ideas and current trends

📋 IDEAL CONVERSATION STRUCTURE:
1st Response: Ask 1-2 key questions if information is very vague
2nd Response: Give partial recommendation + clarify 1 last detail if needed
3rd Response: Give COMPLETE and DEFINITIVE recommendation. NO MORE QUESTIONS.

TONE: Professional + friendly + expert. Like a trusted interior designer.`,

  fr: `Tu es MIA, l'assistante experte en bricolage et décoration de Leroy Merlin Espagne.

🎯 TON OBJECTIF:
- Comprendre les besoins avec MAXIMUM 3 échanges de conversation
- Donner des réponses DIRECTES et COMPLÈTES avec conseils d'expert
- LIMITER les questions: demande seulement si ABSOLUMENT nécessaire (max 2-3 questions total)
- Après le troisième échange, donner recommandations DÉFINITIVES sans plus de questions

⚠️ RÈGLES CRITIQUES:
❌ NE pose PAS plus de 2-3 questions dans TOUTE la conversation
❌ NE mentionne PAS de produits spécifiques
✅ DONNE des conseils techniques complets
✅ DONNE des réponses CONCLUSIVES avec plusieurs options

TONE: Professionnel + amical + expert.`,

  de: `Du bist MIA, die Expertin für Heimwerken und Dekoration bei Leroy Merlin Spanien.

🎯 DEIN ZIEL:
- Kundenbedürfnisse mit MAXIMUM 3 Gesprächsaustauschen verstehen
- DIREKTE und VOLLSTÄNDIGE Antworten mit Expertenberatung geben
- Fragen BEGRENZEN: nur wenn ABSOLUT notwendig fragen (max 2-3 Fragen insgesamt)
- Nach dem dritten Austausch DEFINITIVE Empfehlungen ohne weitere Fragen geben

⚠️ KRITISCHE REGELN:
❌ Stelle NICHT mehr als 2-3 Fragen im GESAMTEN Gespräch
❌ Erwähne KEINE spezifischen Produkte
✅ Gib vollständige technische Ratschläge
✅ Gib ABSCHLIESSENDE Antworten mit mehreren Optionen

TONE: Professionell + freundlich + Experte.`,

  it: `Sei MIA, l'assistente esperta in fai-da-te e decorazione di Leroy Merlin Spagna.

🎯 IL TUO OBIETTIVO:
- Capire le esigenze con MASSIMO 3 scambi di conversazione
- Dare risposte DIRETTE e COMPLETE con consulenza esperta
- LIMITARE domande: chiedi solo se ASSOLUTAMENTE necessario (max 2-3 domande totali)
- Dopo il terzo scambio, dare raccomandazioni DEFINITIVE senza più domande

⚠️ REGOLE CRITICHE:
❌ NON fare più di 2-3 domande in TUTTA la conversazione
❌ NON menzionare prodotti specifici
✅ DAI consigli tecnici completi
✅ DAI risposte CONCLUSIVE con più opzioni

TONE: Professionale + amichevole + esperto.`,

  sv: `Du är MIA, experten på gör-det-själv och inredning på Leroy Merlin Spanien.

🎯 DITT MÅL:
- Förstå kundbehov med MAXIMUM 3 samtalsutbyten
- Ge DIREKTA och KOMPLETTA svar med expertrådgivning
- BEGRÄNSA frågor: fråga bara om ABSOLUT nödvändigt (max 2-3 frågor totalt)
- Efter tredje utbytet, ge DEFINITIVA rekommendationer utan fler frågor

⚠️ KRITISKA REGLER:
❌ Ställ INTE mer än 2-3 frågor i HELA samtalet
❌ Nämn INTE specifika produkter
✅ GE fullständig teknisk rådgivning
✅ GE AVSLUTANDE svar med flera alternativ

TONE: Professionell + vänlig + expert.`
};

// ========================================
// FUNCIÓN PRINCIPAL: LLAMADA A GPT-4o
// ========================================

async function callGPT4o(message, language, conversationHistory = []) {
  try {
    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS['es'];
    
    // Construir historial de mensajes para GPT-4o
    const messages = [
      { role: 'system', content: systemPrompt }
    ];
    
    // ✅ FIX: Añadir historial con formato correcto
    conversationHistory.forEach(item => {
      if (item.role === 'user') {
        messages.push({ role: 'user', content: item.content });
      } else if (item.role === 'assistant') {
        messages.push({ role: 'assistant', content: item.content });
      }
    });
    
    // Añadir mensaje actual
    messages.push({ role: 'user', content: message });
    
    console.log('📊 Historial GPT-4o:', messages.length, 'mensajes');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('Error calling GPT-4o:', error);
    throw error;
  }
}

// ========================================
// FUNCIÓN BACKUP: LLAMADA A GEMINI
// ========================================

async function callGemini(message, language, conversationHistory = []) {
  try {
    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS['es'];
    
    // Construir prompt con historial
    let fullPrompt = systemPrompt + '\n\n';
    
    // ✅ FIX: Usar formato correcto para historial
    conversationHistory.forEach(item => {
      if (item.role === 'user') {
        fullPrompt += `Usuario: ${item.content}\n`;
      } else if (item.role === 'assistant') {
        fullPrompt += `MIA: ${item.content}\n\n`;
      }
    });
    
    fullPrompt += `Usuario: ${message}\nMIA:`;
    
    console.log('📊 Historial Gemini:', conversationHistory.length, 'mensajes');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300
          }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
    
  } catch (error) {
    console.error('Error calling Gemini:', error);
    throw error;
  }
}

// ========================================
// FUNCIÓN PÚBLICA: OBTENER RESPUESTA DE MIA
// ========================================

async function getMIAResponse(message, language, conversationHistory = []) {
  try {
    // 🚨 CONTROL DE TURNOS: MÁXIMO 3 INTERCAMBIOS
    const turnCount = conversationHistory.length / 2; // Cada turno = user + assistant
    
    console.log(`🔢 Turno actual: ${turnCount + 1}/3`);
    
    // Si ya hay 3 o más turnos, forzar respuesta concluyente
    if (turnCount >= 2) { // ✅ CAMBIO: >= 2 en vez de >= 3 para activar en el tercer turno
      const conclusivePrompt = {
        es: 'IMPORTANTE: Esta es tu ÚLTIMA respuesta. Da una recomendación DEFINITIVA y COMPLETA con todas las opciones. NO hagas más preguntas. Concluye el asesoramiento de forma profesional y completa.',
        en: 'IMPORTANT: This is your LAST response. Give a DEFINITIVE and COMPLETE recommendation with all options. DO NOT ask more questions. Conclude the consultation professionally and completely.',
        fr: 'IMPORTANT: C\'est ta DERNIÈRE réponse. Donne une recommandation DÉFINITIVE et COMPLÈTE avec toutes les options. NE pose PAS plus de questions. Conclus la consultation professionnellement.',
        de: 'WICHTIG: Dies ist deine LETZTE Antwort. Gib eine DEFINITIVE und VOLLSTÄNDIGE Empfehlung mit allen Optionen. Stelle KEINE weiteren Fragen. Schließe die Beratung professionell ab.',
        it: 'IMPORTANTE: Questa è la tua ULTIMA risposta. Dai una raccomandazione DEFINITIVA e COMPLETA con tutte le opzioni. NON fare più domande. Concludi la consulenza professionalmente.',
        sv: 'VIKTIGT: Detta är ditt SISTA svar. Ge en DEFINITIV och KOMPLETT rekommendation med alla alternativ. Ställ INGA fler frågor. Avsluta konsultationen professionellt.'
      };
      
      message = message + '\n\n[SYSTEM: ' + (conclusivePrompt[language] || conclusivePrompt['es']) + ']';
      console.log('⚠️ ÚLTIMO TURNO - Forzando respuesta concluyente');
    }
    
    // Intentar GPT-4o primero (motor principal)
    if (USE_GPT4O && OPENAI_API_KEY !== 'TU_OPENAI_KEY_AQUI') {
      try {
        return await callGPT4o(message, language, conversationHistory);
      } catch (error) {
        console.warn('GPT-4o falló, intentando Gemini backup...', error);
        // Si falla GPT-4o, intentar Gemini
        if (GEMINI_API_KEY !== 'TU_GEMINI_KEY_AQUI') {
          return await callGemini(message, language, conversationHistory);
        }
      }
    }
    
    // Usar Gemini si está configurado como principal o como backup
    if (GEMINI_API_KEY !== 'TU_GEMINI_KEY_AQUI') {
      return await callGemini(message, language, conversationHistory);
    }
    
    // Fallback si ninguna API está configurada
    throw new Error('No hay API configurada');
    
  } catch (error) {
    console.error('Error getting MIA response:', error);
    return getFallbackResponse(language);
  }
}

// ========================================
// RESPUESTAS DE FALLBACK (SI FALLA TODO)
// ========================================

function getFallbackResponse(language) {
  const fallbacks = {
    es: 'Disculpa, estoy teniendo problemas técnicos momentáneos. ¿Podrías repetir tu pregunta?',
    en: 'Sorry, I\'m experiencing temporary technical issues. Could you repeat your question?',
    fr: 'Désolé, je rencontre des problèmes techniques temporaires. Pourriez-vous répéter votre question?',
    de: 'Entschuldigung, ich habe vorübergehende technische Probleme. Könnten Sie Ihre Frage wiederholen?',
    it: 'Scusa, sto avendo problemi tecnici momentanei. Potresti ripetere la tua domanda?',
    sv: 'Ursäkta, jag har tillfälliga tekniska problem. Kan du upprepa din fråga?'
  };
  
  return fallbacks[language] || fallbacks['es'];
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getMIAResponse };
}
