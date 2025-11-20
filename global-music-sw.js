// 🎵 GLOBAL MUSIC MANAGER CON SERVICE WORKER (0ms GAP)

class GlobalMusicManagerSW {
    constructor() {
        this.registration = null;
        this.currentTime = 0;
        this.isMuted = false;
        this.volume = 0.3;
        
        console.log('🎵 Sistema inicializado con Service Worker');
    }
    
    async init() {
        console.log('🎵 Inicializando Service Worker...');
        
        // Registrar Service Worker
        if ('serviceWorker' in navigator) {
            try {
                this.registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('✅ Service Worker registrado:', this.registration.scope);
                
                // Esperar a que esté activo
                await navigator.serviceWorker.ready;
                console.log('✅ Service Worker activo');
                
                // Inicializar audio en Service Worker
                navigator.serviceWorker.controller.postMessage({
                    command: 'INIT_AUDIO'
                });
                
                // Restaurar posición guardada
                const savedTime = parseFloat(sessionStorage.getItem('musicTimestamp') || '0');
                this.currentTime = savedTime;
                
                // Restaurar estado de mute
                const savedMuted = localStorage.getItem('musicMuted') === 'true';
                this.isMuted = savedMuted;
                
                if (!this.isMuted) {
                    // Reproducir automáticamente
                    this.play();
                }
                
                // Guardar posición cada 100ms
                setInterval(() => {
                    this.savePosition();
                }, 100);
                
            } catch (error) {
                console.error('❌ Error al registrar Service Worker:', error);
                // Fallback al sistema anterior
                this.fallbackToOldSystem();
            }
        } else {
            console.warn('⚠️ Service Worker no soportado, usando sistema anterior');
            this.fallbackToOldSystem();
        }
    }
    
    async play() {
        if (!navigator.serviceWorker.controller) {
            console.warn('⚠️ Service Worker no disponible');
            return;
        }
        
        // Obtener tiempo actual del Service Worker
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
            this.currentTime = event.data.currentTime;
        };
        
        navigator.serviceWorker.controller.postMessage({
            command: 'GET_TIME'
        }, [messageChannel.port2]);
        
        // Esperar un poco para obtener el tiempo
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Reproducir
        navigator.serviceWorker.controller.postMessage({
            command: 'PLAY',
            data: { currentTime: this.currentTime }
        });
        
        console.log('🎵 Reproduciendo desde', this.currentTime.toFixed(2), 's');
    }
    
    pause() {
        if (!navigator.serviceWorker.controller) return;
        
        navigator.serviceWorker.controller.postMessage({
            command: 'PAUSE'
        });
        
        console.log('⏸️ Música pausada');
    }
    
    duck() {
        this.setVolume(0.1);
        console.log('🎵 Duck activado - Volumen: 10%');
    }
    
    unduck() {
        this.setVolume(0.3);
        console.log('🎵 Unduck activado - Volumen: 30%');
    }
    
    setVolume(volume) {
        if (!navigator.serviceWorker.controller) return;
        
        this.volume = volume;
        
        navigator.serviceWorker.controller.postMessage({
            command: 'SET_VOLUME',
            data: { volume: this.isMuted ? 0 : volume }
        });
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('musicMuted', this.isMuted.toString());
        
        this.setVolume(this.volume);
        
        console.log('🔇 Música muteada:', this.isMuted);
    }
    
    async savePosition() {
        if (!navigator.serviceWorker.controller) return;
        
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
            this.currentTime = event.data.currentTime;
            sessionStorage.setItem('musicTimestamp', this.currentTime.toFixed(3));
        };
        
        navigator.serviceWorker.controller.postMessage({
            command: 'GET_TIME'
        }, [messageChannel.port2]);
    }
    
    // Fallback al sistema anterior si Service Worker falla
    fallbackToOldSystem() {
        console.log('🔄 Usando sistema de música anterior (con gap)');
        
        // Crear instancia de Audio normal
        this.musicAudio = new Audio('background-music.mp3');
        this.musicAudio.loop = true;
        this.musicAudio.volume = 0.3;
        this.musicAudio.preload = 'auto';
        
        // Restaurar posición
        const savedTime = sessionStorage.getItem('musicTimestamp');
        if (savedTime) {
            this.musicAudio.currentTime = parseFloat(savedTime);
        }
        
        // Reproducir
        this.musicAudio.play().catch(e => console.log('⚠️ Autoplay bloqueado:', e));
        
        // Guardar posición cada 100ms
        setInterval(() => {
            if (this.musicAudio && !this.musicAudio.paused) {
                sessionStorage.setItem('musicTimestamp', 
                    this.musicAudio.currentTime.toString());
            }
        }, 100);
        
        // Reasignar métodos para usar Audio API
        this.duck = () => {
            if (this.musicAudio) this.musicAudio.volume = 0.1;
        };
        
        this.unduck = () => {
            if (this.musicAudio) this.musicAudio.volume = 0.3;
        };
        
        this.toggleMute = () => {
            if (this.musicAudio) {
                this.musicAudio.muted = !this.musicAudio.muted;
                localStorage.setItem('musicMuted', this.musicAudio.muted.toString());
            }
        };
    }
}

// Crear instancia global
window.MIAMusic = new GlobalMusicManagerSW();

// Inicializar al cargar página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.MIAMusic.init();
    });
} else {
    window.MIAMusic.init();
}
