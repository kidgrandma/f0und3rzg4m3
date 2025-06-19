// Y2K Chaos Bedroom Builder - Mobile Optimized
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
    currentWallpaper: 'clouds',
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

// UI Controller with Mobile Enhancements
const UIController = {
    elements: {},
    scrollPosition: 0,
    
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
        
        // Mobile-specific enhancements
        this.setupMobileEnhancements();
    },
    
    setupMobileEnhancements() {
        // Improve touch scrolling for tab content
        const tabContent = document.querySelector('.tab-content');
        if (tabContent && 'ontouchstart' in window) {
            let startY = 0;
            let startScrollTop = 0;
            
            tabContent.addEventListener('touchstart', (e) => {
                startY = e.touches[0].pageY;
                startScrollTop = tabContent.scrollTop;
            }, { passive: true });
            
            tabContent.addEventListener('touchmove', (e) => {
                const deltaY = startY - e.touches[0].pageY;
                tabContent.scrollTop = startScrollTop + deltaY;
            }, { passive: true });
        }
        
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.adjustLayoutForOrientation();
            }, 100);
        });
        
        // Improve tab switching on mobile
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.click();
            });
        });
        
        // Prevent iOS bounce scrolling
        document.body.addEventListener('touchmove', (e) => {
            if (!e.target.closest('.tab-content') && !e.target.closest('.modal-overlay')) {
                e.preventDefault();
            }
        }, { passive: false });
    },
    
    adjustLayoutForOrientation() {
        const roomPreview = document.querySelector('.room-preview');
        const controlPanel = document.querySelector('.control-panel');
        
        if (!roomPreview || !controlPanel) return;
        
        if (window.innerHeight < window.innerWidth) {
            // Landscape
            roomPreview.style.flex = '0 0 55%';
            controlPanel.style.flex = '1';
        } else {
            // Portrait
            roomPreview.style.flex = '0 0 35vh';
            controlPanel.style.flex = '1';
        }
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
        if (modal) {
            // Save scroll position and prevent body scroll
            this.scrollPosition = window.pageYOffset;
            document.body.classList.add('modal-open');
            document.body.style.top = `-${this.scrollPosition}px`;
            
            modal.style.display = 'block';
            
            // Center modal on mobile
            if (window.innerWidth <= 768) {
                const modalWindow = modal.querySelector('.welcome-window, .instructions-window');
                if (modalWindow) {
                    modalWindow.style.position = 'fixed';
                    modalWindow.style.top = '50%';
                    modalWindow.style.left = '50%';
                    modalWindow.style.transform = 'translate(-50%, -50%)';
                }
            }
        }
    },
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            
            // Restore body scroll
            document.body.classList.remove('modal-open');
            document.body.style.top = '';
            window.scrollTo(0, this.scrollPosition);
        }
    }
};

// Enhanced Drag and Drop Manager for Mobile
const DragDropManager = {
    draggedElement: null,
    touchData: {
        startX: 0,
        startY: 0,
        lastTap: 0,
        identifier: null
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
        
        // Touch events with better mobile support
        element.addEventListener('touchstart', (e) => this.handleStart(e, element), { passive: false });
        
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
            this.touchData.identifier = touch.identifier;
            
            // Add touch event listeners
            document.addEventListener('touchmove', element._boundHandleMove, { passive: false });
            document.addEventListener('touchend', element._boundHandleEnd, { passive: false });
            document.addEventListener('touchcancel', element._boundHandleEnd, { passive: false });
        } else {
            // Mouse move/up listeners
            document.addEventListener('mousemove', element._boundHandleMove);
            document.addEventListener('mouseup', element._boundHandleEnd);
        }
        
        UIController.updateStatus('Dragging item...');
    },
    
    handleMove(e) {
        if (!this.draggedElement) return;
        e.preventDefault();
        
        let touch;
        if (e.touches) {
            // Find the correct touch point
            touch = Array.from(e.touches).find(t => t.identifier === this.touchData.identifier);
            if (!touch) return;
        } else {
            touch = e;
        }
        
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
            const touch = Array.from(e.changedTouches).find(t => t.identifier === this.touchData.identifier);
            if (touch) {
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
            }
            
            // Remove touch listeners
            document.removeEventListener('touchmove', element._boundHandleMove);
            document.removeEventListener('touchend', element._boundHandleEnd);
            document.removeEventListener('touchcancel', element._boundHandleEnd);
        } else {
            // Desktop - remove listeners
            document.removeEventListener('mousemove', element._boundHandleMove);
            document.removeEventListener('mouseup', element._boundHandleEnd);
            AudioManager.playPlacement();
        }
        
        this.draggedElement = null;
        this.touchData.identifier = null;
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

// Room Builder with Mobile Optimizations
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
        
        // Adjust mobile bed sizes based on screen
        this.adjustMobileItemSizes();
    },
    
    adjustMobileItemSizes() {
        if (window.innerWidth <= 768) {
            // Dynamically adjust item sizes for small screens
            const roomBase = UIController.elements.roomBase;
            const baseWidth = roomBase ? roomBase.offsetWidth : window.innerWidth;
            
            // Store adjusted sizes
            this.mobileItemScale = Math.min(1, baseWidth / 400);
        }
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
                
                // Scroll tab into view on mobile
                if (window.innerWidth <= 768) {
                    btn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                }
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
            // Focus input after a delay for mobile keyboards
            setTimeout(() => {
                if (welcomeNameInput && window.innerWidth > 768) {
                    welcomeNameInput.focus();
                }
            }, 100);
            
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
                if (e.key === 'Enter') {
                    e.preventDefault();
                    startBtn.click();
                }
            });
        }
        
        // Instructions modal
        document.getElementById('closeInstructions').addEventListener('click', () => {
            UIController.hideModal('instructionsModal');
        });
        
        // Close modal on outside click
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
        
        // Adjust bed size for mobile
        let bedWidth = 240;
        let bedHeight = 180;
        
        if (window.innerWidth <= 768) {
            bedWidth = 160;
            bedHeight = 120;
        }
        
        // Create new bed
        const bedElement = this.createElement('bed', bedType, {
            width: bedWidth,
            height: bedHeight,
            src: `../assets/curious/bed-${bedType}.png`,
            label: bedType + ' bed'
        });
        
        // Position in center-bottom
        const roomRect = UIController.elements.roomBase.getBoundingClientRect();
        bedElement.style.left = `${(roomRect.width - bedWidth) / 2}px`;
        bedElement.style.top = `${roomRect.height - bedHeight - 40}px`;
        
        UIController.elements.itemsLayer.appendChild(bedElement);
        RoomState.currentBed = bedType;
        RoomState.addItem(bedElement.id);
        
        AudioManager.playPlacement();
        this.createParticles(parseFloat(bedElement.style.left) + bedWidth/2, 
                           parseFloat(bedElement.style.top) + bedHeight/2);
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
            water: { src: 'item-water.png', size: 120, mobileSize: 60, label: 'Aquafina Case' },
            batteries: { src: 'item-batteries.png', size: 100, mobileSize: 45, label: 'Car Batteries' },
            nsync: { src: 'item-nsync.png', size: 150, mobileSize: 70, label: 'Ricky Martin' },
            lamp: { src: 'item-lamp.png', size: 110, mobileSize: 50, label: 'IKEA Lamp' },
            juice: { src: 'item-juice.png', size: 100, mobileSize: 45, label: 'Sunny D' },
            disco: { src: 'item-disco.png', size: 140, mobileSize: 65, label: 'Disco Lighter' }
        };
        
        const data = itemData[itemType];
        const isMobile = window.innerWidth <= 768;
        const itemSize = isMobile ? data.mobileSize : data.size;
        
        const itemElement = this.createElement('item', itemType, {
            width: itemSize,
            height: itemSize,
            src: `../assets/curious/${data.src}`,
            label: data.label
        });
        
        // Random position with mobile considerations
        const roomRect = UIController.elements.roomBase.getBoundingClientRect();
        const maxX = roomRect.width - itemSize - 10;
        const maxY = roomRect.height - itemSize - 60;
        
        const x = Math.random() * maxX + 5;
        const y = Math.random() * (maxY - 50) + 50;
        
        itemElement.style.left = `${x}px`;
        itemElement.style.top = `${y}px`;
        
        UIController.elements.itemsLayer.appendChild(itemElement);
        RoomState.addItem(itemElement.id);
        
        AudioManager.playPlacement();
        this.createParticles(x + itemSize/2, y + itemSize/2);
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
        // Reduce particles on mobile for performance
        const particleCount = window.innerWidth <= 768 ? 6 : 12;
        
        for (let i = 0; i < particleCount; i++) {
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
            
            const angle = (Math.PI * 2 * i) / particleCount;
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
    
    // Also start on first touch for mobile
    document.addEventListener('touchstart', function startMusic() {
        AudioManager.playBackground();
    }, { once: true });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            RoomBuilder.adjustMobileItemSizes();
            UIController.adjustLayoutForOrientation();
        }, 250);
    });
    
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

// Prevent pull-to-refresh on mobile
let lastY = 0;
document.addEventListener('touchstart', (e) => {
    lastY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    const y = e.touches[0].clientY;
    const scrolling = document.body.scrollTop || document.documentElement.scrollTop;
    
    // Prevent overscroll when at the top
    if (scrolling === 0 && y > lastY) {
        e.preventDefault();
    }
}, { passive: false });