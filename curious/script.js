// Y2K Chaos Bedroom Builder - Now with Random Sounds!
'use strict';

// Audio Configuration with Random Playback
const AudioManager = {
    sounds: {
        background: null,
        placement: []
    },
    
    init() {
        // Background music
        this.sounds.background = new Audio('../assets/curious/bedroom.mp3');
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.5;
        
        // Placement sounds
        for (let i = 1; i <= 5; i++) {
            this.sounds.placement.push(new Audio(`../assets/curious/ruby-${i}.mp3`));
        }
    },
    
    playBackground() {
        this.sounds.background.play().catch(e => console.log('Audio autoplay blocked'));
    },
    
    playPlacement() {
        // 40% chance to play a sound
        if (Math.random() < 0.4) {
            const sound = this.sounds.placement[Math.floor(Math.random() * this.sounds.placement.length)];
            sound.currentTime = 0;
            sound.volume = 0.5 + (Math.random() * 0.3); // Random volume between 0.5-0.8
            sound.play().catch(e => console.log('Sound play failed'));
        }
    },
    
    playRandomSound() {
        // 30% chance for truly random sound at random times
        if (Math.random() < 0.3) {
            const sound = this.sounds.placement[Math.floor(Math.random() * this.sounds.placement.length)];
            sound.currentTime = 0;
            sound.volume = 0.3 + (Math.random() * 0.4); // Random volume between 0.3-0.7
            sound.play().catch(e => console.log('Random sound failed'));
        }
    },
    
    cleanup() {
        this.sounds.background.pause();
        this.sounds.background.src = '';
        this.sounds.placement.forEach(sound => {
            sound.pause();
            sound.src = '';
        });
    }
};

// Room State Manager
const RoomState = {
    currentBed: 'bunk',
    currentWallpaper: 'clouds', // Changed default to clouds
    roomItems: [],
    itemIdCounter: 0,
    playerName: '',
    highestZIndex: 20,
    
    addItem(id) {
        this.roomItems.push(id);
        this.updateStats();
    },
    
    removeItem(id) {
        this.roomItems = this.roomItems.filter(item => item !== id);
        this.updateStats();
    },
    
    clearItems() {
        this.roomItems = [];
        this.itemIdCounter = 0;
        this.highestZIndex = 20;
        this.updateStats();
    },
    
    updateStats() {
        document.getElementById('suppliesCount').textContent = this.roomItems.length;
        document.getElementById('vibeText').textContent = this.calculateVibe();
        document.getElementById('survivalRating').textContent = this.calculateSurvivalRating();
        document.getElementById('itemStatus').textContent = `Items: ${this.roomItems.length}`;
    },
    
    calculateVibe() {
        if (!this.currentWallpaper) return 'EMPTY';
        const vibes = {
            pink: 'FUCKED',
            space: 'LIT',
            wood: 'OD',
            clouds: 'FIRE'
        };
        return vibes[this.currentWallpaper] || 'CHAOS';
    },
    
    calculateSurvivalRating() {
        const count = this.roomItems.length;
        if (count >= 10) return '⭐⭐⭐⭐⭐';
        if (count >= 7) return '⭐⭐⭐⭐';
        if (count >= 5) return '⭐⭐⭐';
        if (count >= 3) return '⭐⭐';
        if (count >= 1) return '⭐';
        return '☠️';
    }
};

// UI Controller
const UIController = {
    elements: {},
    
    init() {
        // Cache DOM elements
        this.elements = {
            wallpaperLayer: document.getElementById('wallpaperLayer'),
            itemsLayer: document.getElementById('itemsLayer'),
            roomBase: document.getElementById('roomBase'),
            roomNumber: document.getElementById('roomNumber'),
            playerNameInput: document.getElementById('playerNameInput'),
            statusText: document.getElementById('statusText'),
            timeStatus: document.getElementById('timeStatus'),
            welcomeModal: document.getElementById('welcomeModal'),
            instructionsModal: document.getElementById('instructionsModal')
        };
        
        // Initialize room number
        this.elements.roomNumber.textContent = Math.floor(Math.random() * 900) + 100;
        
        // Update time
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);
        
        // Random sounds at random intervals
        setInterval(() => AudioManager.playRandomSound(), 5000 + Math.random() * 10000);
    },
    
    updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        this.elements.timeStatus.textContent = `${displayHours}:${minutes} ${ampm}`;
    },
    
    updateStatus(text) {
        this.elements.statusText.textContent = text;
    },
    
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'block';
    },
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    }
};

// Drag and Drop Manager
const DragDropManager = {
    draggedElement: null,
    touchData: {
        startX: 0,
        startY: 0,
        lastTap: 0
    },
    
    makeDraggable(element) {
        // Prevent default drag behavior
        element.ondragstart = () => false;
        
        // Bind methods to preserve 'this' context
        const boundHandleMove = (e) => this.handleMove(e);
        const boundHandleEnd = (e) => this.handleEnd(e);
        
        // Store bound functions on element for removal later
        element._boundHandleMove = boundHandleMove;
        element._boundHandleEnd = boundHandleEnd;
        
        // Mouse events
        element.addEventListener('mousedown', (e) => this.handleStart(e, element));
        
        // Touch events
        element.addEventListener('touchstart', (e) => this.handleStart(e, element), { passive: false });
        element.addEventListener('touchmove', boundHandleMove, { passive: false });
        element.addEventListener('touchend', boundHandleEnd, { passive: false });
        
        // Double-click/tap for rotation
        element.addEventListener('dblclick', () => this.rotate(element));
    },
    
    handleStart(e, element) {
        e.preventDefault();
        this.draggedElement = element;
        element.classList.add('dragging');
        element.style.zIndex = ++RoomState.highestZIndex;
        
        const touch = e.touches ? e.touches[0] : e;
        const rect = element.getBoundingClientRect();
        const parentRect = UIController.elements.roomBase.getBoundingClientRect();
        
        element.dataset.startX = touch.clientX;
        element.dataset.startY = touch.clientY;
        element.dataset.initialX = rect.left - parentRect.left;
        element.dataset.initialY = rect.top - parentRect.top;
        
        if (e.touches) {
            this.touchData.startX = touch.clientX;
            this.touchData.startY = touch.clientY;
        } else {
            // Mouse move/up listeners - bind to preserve context
            document.addEventListener('mousemove', element._boundHandleMove);
            document.addEventListener('mouseup', element._boundHandleEnd);
        }
        
        UIController.updateStatus('Dragging item...');
    },
    
    handleMove(e) {
        if (!this.draggedElement) return;
        e.preventDefault();
        
        const touch = e.touches ? e.touches[0] : e;
        const element = this.draggedElement;
        
        const deltaX = touch.clientX - parseFloat(element.dataset.startX);
        const deltaY = touch.clientY - parseFloat(element.dataset.startY);
        
        const newX = parseFloat(element.dataset.initialX) + deltaX;
        const newY = parseFloat(element.dataset.initialY) + deltaY;
        
        const roomRect = UIController.elements.roomBase.getBoundingClientRect();
        const maxX = roomRect.width - element.offsetWidth;
        const maxY = roomRect.height - element.offsetHeight;
        
        element.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        element.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    },
    
    handleEnd(e) {
        if (!this.draggedElement) return;
        e.preventDefault();
        
        const element = this.draggedElement;
        element.classList.remove('dragging');
        
        // Check for tap vs drag on touch devices
        if (e.changedTouches) {
            const touch = e.changedTouches[0];
            const moveDistance = Math.abs(touch.clientX - this.touchData.startX) + 
                               Math.abs(touch.clientY - this.touchData.startY);
            
            if (moveDistance < 10) {
                // Check for double tap
                const currentTime = Date.now();
                if (currentTime - this.touchData.lastTap < 500) {
                    this.rotate(element);
                }
                this.touchData.lastTap = currentTime;
            } else {
                AudioManager.playPlacement();
            }
        } else {
            // Desktop - remove listeners
            document.removeEventListener('mousemove', element._boundHandleMove);
            document.removeEventListener('mouseup', element._boundHandleEnd);
            AudioManager.playPlacement();
        }
        
        this.draggedElement = null;
        UIController.updateStatus('Ready');
    },
    
    rotate(element) {
        const currentRotation = parseInt(element.dataset.rotation) || 0;
        const newRotation = (currentRotation + 45) % 360;
        element.dataset.rotation = newRotation;
        element.style.transform = `rotate(${newRotation}deg)`;
        AudioManager.playPlacement();
        UIController.updateStatus('Item rotated!');
    }
};

// Room Builder
const RoomBuilder = {
    init() {
        this.initializeTabs();
        this.initializeBedSelection();
        this.initializeWallpaperSelection();
        this.initializeItemSelection();
        this.initializeActionButtons();
        this.initializeModals();
        this.initializeNameInput();
        this.initializeKonamiCode();
        
        // Add default bed
        this.addBed('bunk');
        // Set default wallpaper to clouds
        this.updateWallpaper();
        RoomState.updateStats();
    },
    
    initializeTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Update active states
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`${targetTab}Tab`).classList.add('active');
            });
        });
    },
    
    initializeBedSelection() {
        document.querySelectorAll('[data-bed]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addBed(btn.dataset.bed);
            });
        });
    },
    
    initializeWallpaperSelection() {
        document.querySelectorAll('[data-wallpaper]').forEach(btn => {
            btn.addEventListener('click', () => {
                RoomState.currentWallpaper = btn.dataset.wallpaper;
                this.updateWallpaper();
                AudioManager.playPlacement();
                
                // Update active state
                document.querySelectorAll('[data-wallpaper]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },
    
    initializeItemSelection() {
        document.querySelectorAll('[data-item]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addItem(btn.dataset.item);
            });
        });
    },
    
    initializeActionButtons() {
        document.getElementById('clearItems').addEventListener('click', () => {
            this.clearAllItems();
        });
        
        document.getElementById('screenshotBtn').addEventListener('click', () => {
            this.showScreenshotInstructions();
        });
    },
    
    initializeModals() {
        // Welcome modal
        const welcomeModal = document.getElementById('welcomeModal');
        const closeWelcome = document.getElementById('closeWelcome');
        const startBtn = document.getElementById('startBuilding');
        const welcomeNameInput = document.getElementById('welcomeNameInput');
        
        // Show welcome modal on load
        UIController.showModal('welcomeModal');
        
        if (welcomeModal) {
            welcomeNameInput.focus();
            
            closeWelcome.addEventListener('click', () => this.closeWelcomeModal());
            
            startBtn.addEventListener('click', () => {
                const handle = welcomeNameInput.value.trim();
                if (handle) {
                    RoomState.playerName = handle.replace('@', '');
                    UIController.elements.playerNameInput.value = RoomState.playerName;
                    this.closeWelcomeModal();
                } else {
                    welcomeNameInput.style.border = '3px solid #ff0000';
                    welcomeNameInput.placeholder = 'NEED UR HANDLE!';
                    welcomeNameInput.style.background = '#ffcccc';
                }
            });
            
            welcomeNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') startBtn.click();
            });
        }
        
        // Instructions modal
        document.getElementById('closeInstructions').addEventListener('click', () => {
            UIController.hideModal('instructionsModal');
        });
        
        document.getElementById('instructionsModal').addEventListener('click', (e) => {
            if (e.target.id === 'instructionsModal') {
                UIController.hideModal('instructionsModal');
            }
        });
    },
    
    initializeNameInput() {
        UIController.elements.playerNameInput.addEventListener('input', (e) => {
            RoomState.playerName = e.target.value;
        });
    },
    
    initializeKonamiCode() {
        let konamiCode = [];
        const pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.key);
            konamiCode = konamiCode.slice(-10);
            
            if (konamiCode.join(',') === pattern.join(',')) {
                this.activatePartyMode();
            }
        });
    },
    
    closeWelcomeModal() {
        UIController.hideModal('welcomeModal');
        AudioManager.playBackground();
    },
    
    addBed(bedType) {
        // Remove existing bed
        const existingBed = document.querySelector('.room-item[data-type="bed"]');
        if (existingBed) {
            existingBed.remove();
            RoomState.removeItem(existingBed.id);
        }
        
        // Create new bed
        const bedElement = this.createElement('bed', bedType, {
            width: 240,
            height: 180,
            src: `../assets/curious/bed-${bedType}.png`,
            label: bedType + ' bed'
        });
        
        // Position in center-bottom
        const roomRect = UIController.elements.roomBase.getBoundingClientRect();
        bedElement.style.left = `${(roomRect.width - 240) / 2}px`;
        bedElement.style.top = `${roomRect.height - 240}px`;
        
        UIController.elements.itemsLayer.appendChild(bedElement);
        RoomState.currentBed = bedType;
        RoomState.addItem(bedElement.id);
        
        AudioManager.playPlacement();
        this.createParticles(parseFloat(bedElement.style.left) + 120, 
                           parseFloat(bedElement.style.top) + 90);
    },
    
    updateWallpaper() {
        const layer = UIController.elements.wallpaperLayer;
        layer.className = 'wallpaper-layer';
        if (RoomState.currentWallpaper) {
            layer.classList.add(RoomState.currentWallpaper);
            this.updateRoomLighting();
        }
    },
    
    updateRoomLighting() {
        const effects = {
            pink: 'rgba(255, 192, 203, 0.2)',
            space: 'rgba(0, 0, 139, 0.2)',
            wood: 'rgba(139, 69, 19, 0.2)',
            clouds: 'rgba(135, 206, 235, 0.2)'
        };
        
        UIController.elements.roomBase.style.boxShadow = 
            `inset 0 0 150px ${effects[RoomState.currentWallpaper]}`;
    },
    
    addItem(itemType) {
        const itemData = {
            water: { src: 'item-water.png', size: 120, label: 'Aquafina Case' },
            batteries: { src: 'item-batteries.png', size: 100, label: 'Car Batteries' },
            nsync: { src: 'item-nsync.png', size: 150, label: 'Ricky Martin' },
            lamp: { src: 'item-lamp.png', size: 110, label: 'IKEA Lamp' },
            juice: { src: 'item-juice.png', size: 100, label: 'Sunny D' },
            disco: { src: 'item-disco.png', size: 140, label: 'Disco Lighter' }
        };
        
        const data = itemData[itemType];
        const itemElement = this.createElement('item', itemType, {
            width: data.size,
            height: data.size,
            src: `../assets/curious/${data.src}`,
            label: data.label
        });
        
        // Random position
        const roomRect = UIController.elements.roomBase.getBoundingClientRect();
        const x = Math.random() * (roomRect.width - data.size);
        const y = Math.random() * (roomRect.height - data.size - 100) + 50;
        
        itemElement.style.left = `${x}px`;
        itemElement.style.top = `${y}px`;
        
        UIController.elements.itemsLayer.appendChild(itemElement);
        RoomState.addItem(itemElement.id);
        
        AudioManager.playPlacement();
        this.createParticles(x + data.size/2, y + data.size/2);
    },
    
    createElement(type, subtype, data) {
        const element = document.createElement('div');
        element.className = 'room-item';
        element.id = `${type}-${RoomState.itemIdCounter++}`;
        element.dataset.type = type === 'bed' ? 'bed' : subtype;
        element.dataset.rotation = '0';
        
        element.style.width = `${data.width}px`;
        element.style.height = `${data.height}px`;
        
        const img = document.createElement('img');
        img.src = data.src;
        img.alt = data.label;
        element.appendChild(img);
        
        DragDropManager.makeDraggable(element);
        
        // Add bounce animation
        element.style.animation = 'itemBounce 0.5s ease-out';
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        });
        
        return element;
    },
    
    createParticles(x, y) {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: #ffff00;
                border-radius: 50%;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                z-index: 1000;
                animation: particleFly 1s ease-out forwards;
                box-shadow: 0 0 6px #ffff00;
            `;
            
            const angle = (Math.PI * 2 * i) / 12;
            const velocity = 80 + Math.random() * 80;
            particle.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
            particle.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
            
            UIController.elements.roomBase.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    },
    
    clearAllItems() {
        UIController.elements.itemsLayer.innerHTML = '';
        RoomState.clearItems();
        
        // 70% chance to play sound on clear
        if (Math.random() < 0.7) {
            AudioManager.playPlacement();
        }
        
        UIController.elements.roomBase.style.animation = 'roomShake 0.5s ease-out';
        setTimeout(() => {
            UIController.elements.roomBase.style.animation = '';
        }, 500);
        
        UIController.updateStatus('Items cleared!');
    },
    
    showScreenshotInstructions() {
        UIController.showModal('instructionsModal');
        
        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            opacity: 0.8;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 200);
        
        // Random sound on screenshot
        AudioManager.playRandomSound();
        UIController.updateStatus('Screenshot ready!');
    },
    
    activatePartyMode() {
        document.body.style.animation = 'partyMode 1s ease-in-out infinite';
        
        // Add party style if not exists
        if (!document.getElementById('partyStyle')) {
            const style = document.createElement('style');
            style.id = 'partyStyle';
            style.textContent = `
                @keyframes partyMode {
                    0%, 100% { filter: hue-rotate(0deg); }
                    50% { filter: hue-rotate(180deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add disco balls with sounds
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.addItem('disco');
                // Force sound on party mode
                const sound = AudioManager.sounds.placement[Math.floor(Math.random() * AudioManager.sounds.placement.length)];
                sound.currentTime = 0;
                sound.volume = 0.8;
                sound.play().catch(e => console.log('Party sound failed'));
            }, i * 200);
        }
        
        alert('🎉 PARTY MODE ACTIVATED! 🎉');
    }
};

// Global functions
window.goHome = function() {
    AudioManager.cleanup();
    window.location.href = '../index.html';
};

// Particle animation styles
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFly {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--dx), var(--dy)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AudioManager.init();
    UIController.init();
    RoomBuilder.init();
    
    // Start background music on first interaction
    document.addEventListener('click', function startMusic() {
        AudioManager.playBackground();
    }, { once: true });
    
    // Console messages
    const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
    if (isMobile) {
        console.log('📱 Mobile user detected! Double-tap items to rotate!');
    } else {
        console.log('%c🛏️ Welcome to the Apocalyptic Bedroom Builder! 🛏️', 
            'font-size: 20px; color: #ff6b9d; font-weight: bold;');
        console.log('Pro tip: Try the Konami code! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA');
    }
});

// Prevent zoom on double tap
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });