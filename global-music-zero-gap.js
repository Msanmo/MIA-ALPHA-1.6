// ========================================
// SISTEMA DE MÚSICA GLOBAL - ZERO GAP
// Audio compartido que nunca se destruye
// ========================================

(function() {
    'use strict';
    
    const MUSIC_CONFIG = {
        url: '/background-music.mp3',
        normalVolume: 0.3,
        duckedVolume: 0.1,
        mutedKey: 'mia_music_muted_v2'
    };
    
    let isMuted = false;
    let currentVolume = MUSIC_CONFIG.normalVolume;
    
    // Obtener o crear el audio global único
    function getGlobalAudio() {
        // Verificar si ya existe en window.top
        if (window.top._MIA_GLOBAL_AUDIO) {
            console.log('🎵 Reutilizando audio global existente');
            return window.top._MIA_GLOBAL_AUDIO;
        }
        
        console.log('🎵 Creando audio global único...');
        
        // Crear elemento de audio único
        const audio = new Audio(MUSIC_CONFIG.url);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = MUSIC_CONFIG.normalVolume;
        
        // Guardar en window.top para que persista
        window.top._MIA_GLOBAL_AUDIO = audio;
        window.top._MIA_AUDIO_READY = false;
        
        // Marcar como listo cuando cargue
        audio.addEventListener('canplaythrough', function() {
            window.top._MIA_AUDIO_READY = true;
            console.log('🎵 Audio global listo');
        }, { once: true });
        
        return audio;
    }
    
    // Reproducir música
    function play() {
        const audio = getGlobalAudio();
        
        // Restaurar estado de mute
        const savedMuted = localStorage.getItem(MUSIC_CONFIG.mutedKey);
        if (savedMuted === 'true') {
            isMuted = true;
            audio.muted = true;
        }
        
        if (audio.paused) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('🎵 Música reproduciéndose (0ms gap)');
                    })
                    .catch(error => {
                        console.log('🎵 Autoplay bloqueado, esperando interacción');
                        // Reproducir al primer click/touch
                        const startMusic = function() {
                            audio.play().then(() => {
                                console.log('🎵 Música iniciada por usuario');
                            });
                            document.removeEventListener('click', startMusic);
                            document.removeEventListener('touchstart', startMusic);
                        };
                        document.addEventListener('click', startMusic);
                        document.addEventListener('touchstart', startMusic);
                    });
            }
        } else {
            console.log('🎵 Audio ya reproduciéndose');
        }
        
        updateMuteIcon();
    }
    
    // Atenuar música (durante conversación)
    function duck() {
        const audio = getGlobalAudio();
        if (audio && !isMuted) {
            currentVolume = MUSIC_CONFIG.duckedVolume;
            audio.volume = MUSIC_CONFIG.duckedVolume;
            console.log('🎵 Música atenuada (10%)');
        }
    }
    
    // Restaurar volumen
    function unduck() {
        const audio = getGlobalAudio();
        if (audio && !isMuted) {
            currentVolume = MUSIC_CONFIG.normalVolume;
            audio.volume = MUSIC_CONFIG.normalVolume;
            console.log('🎵 Música restaurada (30%)');
        }
    }
    
    // Toggle mute
    function toggleMute() {
        const audio = getGlobalAudio();
        
        isMuted = !isMuted;
        audio.muted = isMuted;
        
        localStorage.setItem(MUSIC_CONFIG.mutedKey, isMuted.toString());
        updateMuteIcon();
        
        console.log(isMuted ? '🔇 Música silenciada' : '🔊 Música activada');
        return isMuted;
    }
    
    // Actualizar icono de mute
    function updateMuteIcon() {
        const icon = document.getElementById('soundIcon');
        if (!icon) return;
        
        if (isMuted) {
            icon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        } else {
            icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
        }
    }
    
    // API pública
    window.MIAMusic = {
        play: play,
        duck: duck,
        unduck: unduck,
        toggleMute: toggleMute,
        isMuted: () => isMuted,
        getAudio: getGlobalAudio  // Para debugging
    };
    
    // Auto-inicializar en páginas que no sean index
    const currentPath = window.location.pathname;
    if (!currentPath.includes('index.html') && currentPath !== '/') {
        // Inicializar inmediatamente
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                play();
            });
        } else {
            play();
        }
        console.log('🎵 Sistema de música ZERO GAP inicializado');
    }
    
})();
