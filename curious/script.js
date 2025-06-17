// Bedroom Builder Interactive Script with Enhanced Features

// Audio Setup
const audio = {
    background: new Audio('../assets/curious/bedroom.mp3'),
    placement: [
        new Audio('../assets/curious/ruby-1.mp3'),
        new Audio('../assets/curious/ruby-2.mp3'),
        new Audio('../assets/curious/ruby-3.mp3'),
        new Audio('../assets/curious/ruby-4.mp3'),
        new Audio('../assets/curious/ruby-5.mp3')
    ]
};

// Configure background music
audio.background.loop = true;
audio.background.volume = 0.5;

// Touch tracking variables for mobile
let touchStartX = 0;
let touchStartY = 0;
let lastTapTime = 0;

// Welcome Modal Handler
document.addEventListener('DOMContentLoaded', () => {
    const welcomeModal = document.getElementById('welcomeModal');
    const closeWelcome = document.getElementById('closeWelcome');
    const startBtn = document.getElementById('startBuilding');
    const welcomeNameInput = document.getElementById('welcomeNameInput');
    const playerNameInput = document.getElementById('playerNameInput');
    
    // Handle welcome modal
    if (welcomeModal) {
        // Focus on name input
        welcomeNameInput.focus();
        
        // Close button
        closeWelcome.addEventListener('click', closeWelcomeModal);
        
        // Start button
        startBtn.addEventListener('click', () => {
            const handle = welcomeNameInput.value.trim();
            if (handle) {
                // Transfer to main input
                playerName = handle.replace('@', ''); // Remove @ if included
                playerNameInput.value = playerName;
                closeWelcomeModal();
            } else {
                welcomeNameInput.style.border = '2px solid #ff0000';
                welcomeNameInput.placeholder = 'Please enter handle!';
            }
        });
        
        // Enter key to start
        welcomeNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                startBtn.click();
            }
        });
    }
    
    function closeWelcomeModal() {
        welcomeModal.style.display = 'none';
        // Start background music after interaction
        audio.background.play().catch(e => console.log('Audio autoplay blocked'));
    }
});

// Start background music on first interaction (backup)
document.addEventListener('click', function startMusic() {
    audio.background.play().catch(e => console.log('Audio autoplay blocked'));
    document.removeEventListener('click', startMusic);
}, { once: true });

// Function to play random placement sound
function playPlacementSound() {
    const randomSound = audio.placement[Math.floor(Math.random() * audio.placement.length)];
    randomSound.currentTime = 0;
    randomSound.volume = 0.7;
    randomSound.play().catch(e => console.log('Sound play failed'));
}

// State management
let currentBed = 'bunk';
let currentWallpaper = null;
let roomItems = [];
let draggedItem = null;
let itemIdCounter = 0;
let playerName = '';
let highestZIndex = 20;

// DOM Elements
const wallpaperLayer = document.getElementById('wallpaperLayer');
const bedContainer = document.getElementById('bedContainer');
const bedImage = document.getElementById('bedImage');
const itemsLayer = document.getElementById('itemsLayer');
const roomBase = document.getElementById('roomBase');
const instructionsModal = document.getElementById('instructionsModal');
const roomNumber = document.getElementById('roomNumber');

// Initialize room number
roomNumber.textContent = Math.floor(Math.random() * 900) + 100;

// Tab System
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // Update active states
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${targetTab}Tab`).classList.add('active');
    });
});

// Bed Selection - now adds bed as draggable item
document.querySelectorAll('[data-bed]').forEach(btn => {
    btn.addEventListener('click', () => {
        currentBed = btn.dataset.bed;
        addBedToRoom();
        playPlacementSound();
    });
});

function addBedToRoom() {
    // Remove existing bed if any
    const existingBed = document.querySelector('.room-item[data-type="bed"]');
    if (existingBed) {
        existingBed.remove();
        roomItems = roomItems.filter(id => id !== existingBed.id);
    }
    
    // Add new bed as draggable item
    const bedElement = document.createElement('div');
    bedElement.className = 'room-item';
    bedElement.id = `bed-${currentBed}`;
    bedElement.dataset.type = 'bed';
    bedElement.dataset.rotation = '0';
    
    // Set bed size (larger than other items)
    bedElement.style.width = '240px';
    bedElement.style.height = '180px';
    
    // Position bed in center-bottom of room
    const roomRect = roomBase.getBoundingClientRect();
    const x = (roomRect.width - 240) / 2;
    const y = roomRect.height - 240;
    
    bedElement.style.left = `${x}px`;
    bedElement.style.top = `${y}px`;
    
    // Create bed image
    const img = document.createElement('img');
    img.src = `../assets/curious/bed-${currentBed}.png`;
    img.alt = currentBed + ' bed';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    bedElement.appendChild(img);
    
    // Make draggable and rotatable
    makeDraggable(bedElement);
    makeRotatable(bedElement);
    
    itemsLayer.appendChild(bedElement);
    roomItems.push(bedElement.id);
    
    // Create particles at bed position
    createParticles(x + 120, y + 90);
    
    // Add bounce animation
    bedElement.style.animation = 'itemBounce 0.5s ease-out';
}

// Wallpaper Selection with lighting effects
document.querySelectorAll('[data-wallpaper]').forEach(btn => {
    btn.addEventListener('click', () => {
        currentWallpaper = btn.dataset.wallpaper;
        updateWallpaper();
        playPlacementSound();
        
        // Update active state
        document.querySelectorAll('[data-wallpaper]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

function updateWallpaper() {
    wallpaperLayer.className = 'wallpaper-layer';
    if (currentWallpaper) {
        wallpaperLayer.classList.add(currentWallpaper);
        updateRoomLighting();
    }
}

// Room lighting based on wallpaper
function updateRoomLighting() {
    const lightingEffects = {
        pink: 'rgba(255, 192, 203, 0.2)',
        space: 'rgba(0, 0, 139, 0.2)',
        wood: 'rgba(139, 69, 19, 0.2)',
        clouds: 'rgba(135, 206, 235, 0.2)'
    };
    
    // Apply to room base with stronger effect
    roomBase.style.boxShadow = `inset 0 0 150px ${lightingEffects[currentWallpaper]}`;
    
    // Also add a subtle overlay for more visible effect
    const existingOverlay = document.getElementById('lightingOverlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    if (currentWallpaper) {
        const overlay = document.createElement('div');
        overlay.id = 'lightingOverlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${lightingEffects[currentWallpaper]};
            pointer-events: none;
            mix-blend-mode: screen;
            z-index: 1;
        `;
        roomBase.appendChild(overlay);
    }
}

// Item Addition with particles and shadows
document.querySelectorAll('[data-item]').forEach(btn => {
    btn.addEventListener('click', () => {
        addItemToRoom(btn.dataset.item);
    });
});

function addItemToRoom(itemType) {
    const itemData = {
        water: { src: 'item-water.png', size: 120, label: 'Aquafina Case' },
        batteries: { src: 'item-batteries.png', size: 100, label: 'Car Batteries' },
        nsync: { src: 'item-nsync.png', size: 150, label: 'Ricky Martin' },
        lamp: { src: 'item-lamp.png', size: 110, label: 'IKEA Lamp' },
        juice: { src: 'item-juice.png', size: 100, label: 'Sunny D' },
        disco: { src: 'item-disco.png', size: 140, label: 'Disco Lighter' }
    };
    
    const item = itemData[itemType];
    const itemElement = document.createElement('div');
    itemElement.className = 'room-item';
    itemElement.id = `item-${itemIdCounter++}`;
    itemElement.dataset.type = itemType;
    itemElement.dataset.rotation = '0';
    
    // Set size
    itemElement.style.width = `${item.size}px`;
    itemElement.style.height = `${item.size}px`;
    
    // Random position
    const roomRect = roomBase.getBoundingClientRect();
    const x = Math.random() * (roomRect.width - item.size);
    const y = Math.random() * (roomRect.height - item.size - 100) + 50;
    
    itemElement.style.left = `${x}px`;
    itemElement.style.top = `${y}px`;
    
    // Create image with shadow
    const img = document.createElement('img');
    img.src = `../assets/curious/${item.src}`;
    img.alt = item.label;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    itemElement.appendChild(img);
    
    // Make draggable and rotatable
    makeDraggable(itemElement);
    makeRotatable(itemElement);
    
    itemsLayer.appendChild(itemElement);
    roomItems.push(itemElement.id);
    
    // Play sound and create particles
    playPlacementSound();
    createParticles(x + item.size/2, y + item.size/2);
    
    // Add bounce animation
    itemElement.style.animation = 'itemBounce 0.5s ease-out';
    
    // Update profile stats
    updateProfileStats();
}

// Enhanced Particle effects - bigger and more visible
function createParticles(x, y) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const angle = (Math.PI * 2 * i) / 12;
        const velocity = 80 + Math.random() * 80;
        particle.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
        particle.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
        
        roomBase.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Make items rotatable on double-click
function makeRotatable(element) {
    element.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const currentRotation = parseInt(element.dataset.rotation) || 0;
        const newRotation = (currentRotation + 45) % 360;
        element.dataset.rotation = newRotation;
        element.style.transform = `rotate(${newRotation}deg)`;
        playPlacementSound();
    });
}

// Mobile-optimized draggable function with proper desktop support
function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let isTouch = false;
    
    // Touch events for mobile
    element.addEventListener('touchstart', (e) => {
        isTouch = true;
        e.preventDefault();
        startDrag(e);
    }, { passive: false });
    
    element.addEventListener('touchmove', (e) => {
        if (isTouch) {
            e.preventDefault();
            drag(e);
        }
    }, { passive: false });
    
    element.addEventListener('touchend', (e) => {
        if (isTouch) {
            e.preventDefault();
            endDrag(e);
            isTouch = false;
        }
    }, { passive: false });
    
    // Mouse events for desktop
    element.addEventListener('mousedown', (e) => {
        if (!isTouch) {
            startDrag(e);
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isTouch) {
            drag(e);
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (!isTouch) {
            endDrag(e);
        }
    });
    
    function startDrag(e) {
        isDragging = true;
        element.classList.add('dragging');
        element.style.zIndex = ++highestZIndex;
        
        const touch = e.touches ? e.touches[0] : e;
        const rect = element.getBoundingClientRect();
        const parentRect = roomBase.getBoundingClientRect();
        
        startX = touch.clientX;
        startY = touch.clientY;
        initialX = rect.left - parentRect.left;
        initialY = rect.top - parentRect.top;
        
        // Store for double-tap detection (mobile only)
        if (e.touches) {
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }
        
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const touch = e.touches ? e.touches[0] : e;
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        const newX = initialX + deltaX;
        const newY = initialY + deltaY;
        
        const roomRect = roomBase.getBoundingClientRect();
        const maxX = roomRect.width - element.offsetWidth;
        const maxY = roomRect.height - element.offsetHeight;
        
        element.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        element.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
        
        e.preventDefault();
    }
    
    function endDrag(e) {
        if (!isDragging) return;
        
        isDragging = false;
        element.classList.remove('dragging');
        
        // Only check for tap on touch devices
        if (e.changedTouches) {
            const touch = e.changedTouches[0];
            const moveDistance = Math.abs(touch.clientX - touchStartX) + Math.abs(touch.clientY - touchStartY);
            
            if (moveDistance < 10) {
                // It was a tap, not a drag
                handleDoubleTap(element);
            } else {
                // It was a drag
                playPlacementSound();
            }
        } else {
            // Desktop - always play sound after drag
            playPlacementSound();
        }
    }
}

// Double-tap detection for rotation
function handleDoubleTap(element) {
    const currentTime = new Date().getTime();
    const tapDelay = currentTime - lastTapTime;
    
    if (tapDelay < 500 && tapDelay > 0) {
        // Double tap detected - rotate
        const currentRotation = parseInt(element.dataset.rotation) || 0;
        const newRotation = (currentRotation + 45) % 360;
        element.dataset.rotation = newRotation;
        element.style.transform = `rotate(${newRotation}deg)`;
        playPlacementSound();
    }
    
    lastTapTime = currentTime;
}

// Update profile stats
function updateProfileStats() {
    const itemCount = roomItems.length;
    const vibe = calculateVibe();
    const survivalRating = calculateSurvivalRating();
    
    // Update individual elements
    document.getElementById('suppliesCount').textContent = itemCount;
    document.getElementById('vibeText').textContent = vibe;
    document.getElementById('survivalRating').textContent = survivalRating;
}

// Initialize name input listener
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('playerNameInput');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            playerName = e.target.value;
        });
    }
});

function calculateVibe() {
    if (!currentWallpaper) return 'EMPTY';
    const vibes = {
        pink: 'KAWAII',
        space: 'COSMIC',
        wood: 'RUSTIC',
        clouds: 'DREAMY'
    };
    return vibes[currentWallpaper] || 'UNIQUE';
}

function calculateSurvivalRating() {
    const items = roomItems.length;
    if (items >= 10) return '⭐⭐⭐⭐⭐';
    if (items >= 7) return '⭐⭐⭐⭐';
    if (items >= 5) return '⭐⭐⭐';
    if (items >= 3) return '⭐⭐';
    if (items >= 1) return '⭐';
    return '☠️';
}

// Clear Items with enhanced shake effect
document.getElementById('clearItems').addEventListener('click', () => {
    itemsLayer.innerHTML = '';
    roomItems = [];
    itemIdCounter = 0;
    highestZIndex = 20;
    
    playPlacementSound();
    
    // Enhanced shake effect on the whole room
    roomBase.style.animation = 'roomShake 0.5s ease-out';
    setTimeout(() => {
        roomBase.style.animation = '';
    }, 500);
    
    updateProfileStats();
});

// Enhanced Screenshot Button for Mobile
document.getElementById('screenshotBtn').addEventListener('click', () => {
    const modal = instructionsModal;
    const content = modal.querySelector('.window-content');
    
    // Update content to be clearer for mobile
    content.innerHTML = `
        <h2>📸 SCREENSHOT TIME! 📸</h2>
        <p>Your apocalyptic bedroom is ready!</p>
        <br>
        <p><strong>NOW DO THIS:</strong></p>
        <ol>
            <li>Take a screenshot of your room</li>
            <li>Open Instagram</li>
            <li>DM it to <a href="https://instagram.com/kidgrandma" target="_blank" style="color: #ff00ff; font-weight: bold;">@kidgrandma</a></li>
            <li>Wait for game instructions</li>
        </ol>
        <br>
        <p class="blink">ROOM SAVED TO ARCHIVE ✓</p>
        <br>
        <button class="close-btn" style="width: 100%; padding: 10px; background: #4ecdc4; border: 2px solid #000; font-weight: bold;" onclick="document.getElementById('instructionsModal').style.display='none'">
            GOT IT! 👍
        </button>
    `;
    
    modal.style.display = 'block';
    
    // Flash effect
    const flash = document.createElement('div');
    flash.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; opacity: 0.8; pointer-events: none; z-index: 999;';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 200);
});

// Close instructions
document.getElementById('closeInstructions').addEventListener('click', () => {
    instructionsModal.style.display = 'none';
});

instructionsModal.addEventListener('click', (e) => {
    if (e.target === instructionsModal) {
        instructionsModal.style.display = 'none';
    }
});

// Initialize
addBedToRoom(); // Add default bunk bed
updateProfileStats();

// Add all styles at once
const allStyles = document.createElement('style');
allStyles.textContent = `
    /* Enhanced particle styles */
    .particle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: #ffff00;
        border-radius: 50%;
        pointer-events: none;
        animation: particleFly 1s ease-out forwards;
        box-shadow: 0 0 6px #ffff00;
        z-index: 1000;
    }
    
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
    
    /* Enhanced room shake */
    @keyframes roomShake {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-15px) rotate(-1deg); }
        20% { transform: translateX(15px) rotate(1deg); }
        30% { transform: translateX(-15px) rotate(-1deg); }
        40% { transform: translateX(15px) rotate(1deg); }
        50% { transform: translateX(-10px) rotate(-0.5deg); }
        60% { transform: translateX(10px) rotate(0.5deg); }
        70% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
        90% { transform: translateX(-2px); }
    }
    
    /* Item shadows */
    .room-item img {
        filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.8)) !important;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    
    .room-item[data-type="bed"] img {
        filter: drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.9)) !important;
    }
    
    /* Ensure items are above lighting overlay */
    .items-layer {
        position: relative;
        z-index: 10;
    }
    
    /* Name input styles */
    .name-input {
        background: transparent;
        border: none;
        border-bottom: 2px solid #00ff00;
        color: #00ff00;
        font-family: inherit;
        font-size: inherit;
        width: 150px;
        text-align: center;
        outline: none;
    }
    
    .profile-header {
        margin-bottom: 5px;
    }
    
    .profile-stats {
        font-size: 0.8rem;
        opacity: 0.8;
    }
`;
document.head.appendChild(allStyles);

// Easter egg: Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activatePartyMode();
    }
});

function activatePartyMode() {
    document.body.style.animation = 'partyMode 1s ease-in-out infinite';
    
    const partyStyle = document.createElement('style');
    partyStyle.textContent = `
        @keyframes partyMode {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(180deg); }
        }
    `;
    document.head.appendChild(partyStyle);
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => addItemToRoom('disco'), i * 200);
    }
    
    alert('🎉 PARTY MODE ACTIVATED! 🎉');
}

// Prevent zoom on double tap
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Mobile-friendly console message
if (/Mobile|Android|iPhone/i.test(navigator.userAgent)) {
    console.log('📱 Mobile user detected! Double-tap items to rotate!');
} else {
    console.log('%c🛏️ Welcome to the Apocalyptic Bedroom Builder! 🛏️', 
        'font-size: 20px; color: #ff6b9d; font-weight: bold;');
    console.log('Pro tip: Try the Konami code for a surprise! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA');
}
function goHome() {
    // Clean up before leaving
    if (typeof soundEnabled !== 'undefined') {
        // Stop all audio
        const allAudio = document.querySelectorAll('audio');
        allAudio.forEach(audio => {
            audio.pause();
            audio.src = '';
        });
    }
    
    // Navigate to home
    window.location.href = '../index.html';
}