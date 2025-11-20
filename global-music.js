// ========================================
// SISTEMA DE MÚSICA GLOBAL - MIA DIY
// Música continua con mínimo gap entre páginas
// ========================================

(function() {
    'use strict';

    // Configuración
    const MUSIC_CONFIG = {
        url: 'background-music.mp3',
        normalVolume: 0.3,      // 30% volumen normal
        duckedVolume: 0.1,      // 10% cuando se habla por micrófono
        fadeTime: 500           // 500ms para transiciones
    };

    let globalMusic = null;
    let isMuted = false;
    let isDucked = false;

    // Inicializar música global
    function initGlobalMusic() {
        console.log('🎵 Inicializando música...');
        
        // Crear elemento de audio
        if (!globalMusic) {
            globalMusic = new Audio();
            globalMusic.src = MUSIC_CONFIG.url;
            globalMusic.loop = true;
            globalMusic.volume = MUSIC_CONFIG.normalVolume;
            globalMusic.preload = 'auto'; // Precargar para reducir gap
            
            // Guardar currentTime cada 100ms para mejor precisión
            globalMusic.addEventListener('timeupdate', function() {
                if (!globalMusic.paused) {
                    sessionStorage.setItem('musicTime', globalMusic.currentTime.toFixed(3));
                }
            });
            
            // Restaurar currentTime inmediatamente
            const savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');
            if (savedTime > 0 && !isNaN(savedTime)) {
                globalMusic.currentTime = savedTime;
                console.log('🎵 Restaurando desde', savedTime.toFixed(2), 's');
            }
            
            window.globalMusicPlayer = globalMusic;
            console.log('🎵 Instancia creada');
        }
        
        return globalMusic;
    }

    // Reproducir música
    function playMusic() {
        const music = initGlobalMusic();
        
        // Verificar estado de mute
        const savedMute = sessionStorage.getItem('musicMuted');
        if (savedMute === 'true') {
            music.muted = true;
            isMuted = true;
            updateMuteIcon();
        }
        
        // Reproducir inmediatamente
        if (music.paused) {
            const playPromise = music.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('🎵 Música reproduciéndose');
                    })
                    .catch(e => {
                        console.log('🎵 Autoplay bloqueado, click para iniciar');
                        // Reproducir al primer click
                        document.addEventListener('click', function playOnClick() {
                            music.play();
                        }, { once: true });
                    });
            }
        }
    }

    // Atenuar música
    function duckMusic() {
        const music = globalMusic || window.globalMusicPlayer;
        if (!music || isMuted) return;
        
        isDucked = true;
        fadeVolume(music, MUSIC_CONFIG.duckedVolume, MUSIC_CONFIG.fadeTime);
        console.log('🎵 Atenuada');
    }

    // Restaurar volumen
    function unduckMusic() {
        const music = globalMusic || window.globalMusicPlayer;
        if (!music || isMuted) return;
        
        isDucked = false;
        fadeVolume(music, MUSIC_CONFIG.normalVolume, MUSIC_CONFIG.fadeTime);
        console.log('🎵 Restaurada');
    }

    // Toggle mute
    function toggleMute() {
        const music = globalMusic || window.globalMusicPlayer;
        if (!music) return;
        
        isMuted = !isMuted;
        music.muted = isMuted;
        
        sessionStorage.setItem('musicMuted', isMuted ? 'true' : 'false');
        updateMuteIcon();
        
        console.log(isMuted ? '🔇 Silenciada' : '🔊 Activada');
        return isMuted;
    }

    // Fade de volumen
    function fadeVolume(audio, targetVolume, duration) {
        const startVolume = audio.volume;
        const volumeChange = targetVolume - startVolume;
        const steps = 20;
        const stepTime = duration / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            audio.volume = Math.max(0, Math.min(1, startVolume + (volumeChange * (currentStep / steps))));
            
            if (currentStep >= steps) {
                audio.volume = targetVolume;
                clearInterval(fadeInterval);
            }
        }, stepTime);
    }

    // Actualizar icono
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
        play: playMusic,
        duck: duckMusic,
        unduck: unduckMusic,
        toggleMute: toggleMute,
        isMuted: () => isMuted,
        isDucked: () => isDucked
    };

    // Auto-inicializar
    const currentPath = window.location.pathname;
    if (!currentPath.includes('index.html') && currentPath !== '/') {
        // Iniciar lo antes posible
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', playMusic);
        } else {
            playMusic();
        }
        console.log('🎵 Sistema inicializado:', currentPath);
    }

})();
