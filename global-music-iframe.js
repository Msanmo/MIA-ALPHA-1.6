// ========================================
// SISTEMA DE MÚSICA GLOBAL CON IFRAME
// Música 100% continua - 0ms gap
// ========================================

(function() {
    'use strict';
    
    const MUSIC_CONFIG = {
        normalVolume: 0.3,
        duckedVolume: 0.1
    };
    
    let musicFrame = null;
    let isMuted = false;
    let currentVolume = MUSIC_CONFIG.normalVolume;
    
    // Inicializar iframe de música
    function initMusicFrame() {
        // Verificar si ya existe el iframe global
        if (window.top.document.getElementById('globalMusicFrame')) {
            musicFrame = window.top.document.getElementById('globalMusicFrame');
            console.log('🎵 Iframe de música encontrado (reutilizando)');
            return musicFrame;
        }
        
        console.log('🎵 Creando iframe de música...');
        
        // Crear iframe oculto
        musicFrame = document.createElement('iframe');
        musicFrame.id = 'globalMusicFrame';
        musicFrame.src = 'music-player.html';
        musicFrame.style.display = 'none';
        musicFrame.style.position = 'fixed';
        musicFrame.style.top = '-1000px';
        musicFrame.style.left = '-1000px';
        
        // Agregar al top window para que persista
        window.top.document.body.appendChild(musicFrame);
        
        // Esperar a que cargue
        musicFrame.onload = function() {
            console.log('🎵 Iframe de música cargado');
            
            // Restaurar estado de mute
            const savedMute = localStorage.getItem('musicMuted');
            if (savedMute === 'true') {
                isMuted = true;
                sendCommand('mute', true);
                updateMuteIcon();
            }
            
            // Intentar reproducir
            setTimeout(() => {
                sendCommand('play');
                console.log('🎵 Música iniciada');
            }, 500);
        };
        
        return musicFrame;
    }
    
    // Enviar comando al iframe
    function sendCommand(command, value) {
        if (!musicFrame || !musicFrame.contentWindow) {
            console.warn('⚠️ Iframe no disponible');
            return;
        }
        
        musicFrame.contentWindow.postMessage({
            command: command,
            value: value
        }, '*');
    }
    
    // Reproducir música
    function playMusic() {
        const frame = initMusicFrame();
        
        // Si el iframe ya está listo, reproducir inmediatamente
        if (frame.contentWindow) {
            sendCommand('play');
        }
    }
    
    // Atenuar música (durante conversación)
    function duckMusic() {
        if (isMuted) return;
        currentVolume = MUSIC_CONFIG.duckedVolume;
        sendCommand('setVolume', MUSIC_CONFIG.duckedVolume);
        console.log('🎵 Música atenuada (10%)');
    }
    
    // Restaurar volumen
    function unduckMusic() {
        if (isMuted) return;
        currentVolume = MUSIC_CONFIG.normalVolume;
        sendCommand('setVolume', MUSIC_CONFIG.normalVolume);
        console.log('🎵 Música restaurada (30%)');
    }
    
    // Toggle mute
    function toggleMute() {
        isMuted = !isMuted;
        
        if (isMuted) {
            sendCommand('mute', true);
        } else {
            sendCommand('mute', false);
            sendCommand('setVolume', currentVolume);
        }
        
        localStorage.setItem('musicMuted', isMuted ? 'true' : 'false');
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
        play: playMusic,
        duck: duckMusic,
        unduck: unduckMusic,
        toggleMute: toggleMute,
        isMuted: () => isMuted
    };
    
    // Auto-inicializar en todas las páginas excepto index
    const currentPath = window.location.pathname;
    if (!currentPath.includes('index.html') && currentPath !== '/') {
        // Esperar un momento para que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(playMusic, 100);
            });
        } else {
            setTimeout(playMusic, 100);
        }
        console.log('🎵 Sistema de música con iframe inicializado');
    }
    
})();
