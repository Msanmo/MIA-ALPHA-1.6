// ========================================
// SISTEMA DE MÚSICA GLOBAL SIMPLE
// Música continua con mínimo gap (~100ms)
// ========================================

(function() {
    'use strict';
    
    const MUSIC_CONFIG = {
        url: '/background-music.mp3',
        normalVolume: 0.3,
        duckedVolume: 0.1,
        storageKey: 'mia_music_time',
        mutedKey: 'mia_music_muted'
    };
    
    let audio = null;
    let isMuted = false;
    let isInitialized = false;
    
    // Inicializar audio
    function initAudio() {
        if (isInitialized) return audio;
        
        console.log('🎵 Inicializando sistema de música...');
        
        // Crear elemento de audio
        audio = new Audio(MUSIC_CONFIG.url);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = MUSIC_CONFIG.normalVolume;
        
        // Restaurar tiempo guardado
        const savedTime = localStorage.getItem(MUSIC_CONFIG.storageKey);
        if (savedTime) {
            const time = parseFloat(savedTime);
            if (!isNaN(time) && time > 0) {
                audio.currentTime = time;
                console.log('🎵 Restaurando desde', time.toFixed(2), 's');
            }
        }
        
        // Restaurar estado de mute
        const savedMuted = localStorage.getItem(MUSIC_CONFIG.mutedKey);
        if (savedMuted === 'true') {
            isMuted = true;
            audio.muted = true;
        }
        
        // Guardar posición continuamente
        audio.addEventListener('timeupdate', function() {
            if (!audio.paused) {
                localStorage.setItem(MUSIC_CONFIG.storageKey, audio.currentTime.toFixed(3));
            }
        });
        
        // Guardar antes de salir de la página
        window.addEventListener('beforeunload', function() {
            if (audio && !audio.paused) {
                localStorage.setItem(MUSIC_CONFIG.storageKey, audio.currentTime.toFixed(3));
            }
        });
        
        isInitialized = true;
        updateMuteIcon();
        
        return audio;
    }
    
    // Reproducir música
    function play() {
        const player = initAudio();
        
        if (player.paused) {
            const playPromise = player.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('🎵 Música reproduciéndose');
                    })
                    .catch(error => {
                        console.log('🎵 Autoplay bloqueado, esperando interacción');
                        // Reproducir al primer click
                        document.addEventListener('click', function playOnClick() {
                            player.play().then(() => {
                                console.log('🎵 Música iniciada por interacción');
                            });
                        }, { once: true });
                    });
            }
        } else {
            console.log('🎵 Música ya reproduciéndose');
        }
    }
    
    // Atenuar música (durante conversación)
    function duck() {
        if (audio && !isMuted) {
            audio.volume = MUSIC_CONFIG.duckedVolume;
            console.log('🎵 Música atenuada (10%)');
        }
    }
    
    // Restaurar volumen
    function unduck() {
        if (audio && !isMuted) {
            audio.volume = MUSIC_CONFIG.normalVolume;
            console.log('🎵 Música restaurada (30%)');
        }
    }
    
    // Toggle mute
    function toggleMute() {
        const player = initAudio();
        
        isMuted = !isMuted;
        player.muted = isMuted;
        
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
        isMuted: () => isMuted
    };
    
    // Auto-inicializar en páginas que no sean index
    const currentPath = window.location.pathname;
    if (!currentPath.includes('index.html') && currentPath !== '/') {
        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(play, 200);
            });
        } else {
            setTimeout(play, 200);
        }
        console.log('🎵 Sistema de música inicializado');
    }
    
})();
