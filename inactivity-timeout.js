// ========================================
// MIA DIY ASSISTANT - INACTIVITY TIMEOUT
// Redirige a video-intro.html después de 45s sin interacción
// ========================================

(function() {
    // Configuración
    const TIMEOUT_SECONDS = 45; // 45 segundos de inactividad
    const REDIRECT_URL = 'video-intro.html';
    
    // Variables globales
    let inactivityTimer;
    let currentLang = new URLSearchParams(window.location.search).get('lang') || 'es';
    
    // Eventos que resetean el timer
    const ACTIVITY_EVENTS = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click'
    ];
    
    // Iniciar el timer de inactividad
    function startInactivityTimer() {
        // Limpiar timer existente
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        
        // Crear nuevo timer
        inactivityTimer = setTimeout(() => {
            console.log(`⏰ 45 segundos de inactividad - Redirigiendo a ${REDIRECT_URL}`);
            window.location.href = `${REDIRECT_URL}?lang=${currentLang}`;
        }, TIMEOUT_SECONDS * 1000);
        
        console.log(`⏱️ Timer de inactividad iniciado (${TIMEOUT_SECONDS}s)`);
    }
    
    // Resetear el timer cuando hay actividad
    function resetInactivityTimer() {
        console.log('🔄 Actividad detectada - Timer reseteado');
        startInactivityTimer();
    }
    
    // Inicializar cuando el DOM esté listo
    function init() {
        console.log('✅ Inactivity timeout inicializado');
        
        // Registrar todos los eventos de actividad
        ACTIVITY_EVENTS.forEach(event => {
            document.addEventListener(event, resetInactivityTimer, true);
        });
        
        // Iniciar el timer
        startInactivityTimer();
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
