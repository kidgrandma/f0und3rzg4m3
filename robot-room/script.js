// Digital Garden Observatory - Where emotions bloom into stars

// State management
let gardenCount = 42; // Starting count
let soundEnabled = true;
let currentGardens = [];

// Emotion to tree mapping
const emotionTrees = {
    joy: 'emotion-joy.png',
    happy: 'emotion-joy.png',
    happiness: 'emotion-joy.png',
    love: 'emotion-love.png',
    loved: 'emotion-love.png',
    loving: 'emotion-love.png',
    sad: 'emotion-sadness.png',
    sadness: 'emotion-sadness.png',
    crying: 'emotion-sadness.png',
    anger: 'emotion-anger.png',
    angry: 'emotion-anger.png',
    mad: 'emotion-anger.png',
    peace: 'emotion-peace.png',
    peaceful: 'emotion-peace.png',
    calm: 'emotion-peace.png',
    hope: 'emotion-hope.png',
    hopeful: 'emotion-hope.png',
    optimistic: 'emotion-hope.png'
};

// DOM Elements
const emotionInput = document.getElementById('emotionInput');
const plantBtn = document.getElementById('plantBtn');
const gardenArea = document.getElementById('gardenArea');
const constellationArea = document.getElementById('constellationArea');
const gardenCountDisplay = document.getElementById('gardenCount');
const soundToggle = document.getElementById('soundToggle');
const particleContainer = document.getElementById('particleContainer');
const cursorTrail = document.getElementById('cursorTrail');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateGardenCount();
    initializeCursorTrail();
    initializeBackgroundParticles();
    
    // Load saved gardens from memory
    loadExistingGardens();
    
    // Start my theme music when entering the room
    const robotTheme = document.getElementById('robotRoomTheme');
    if (robotTheme && soundEnabled) {
        robotTheme.volume = 0.2; // Soft background volume
        robotTheme.play().catch(e => {
            console.log('Autoplay blocked, will play on first interaction');
            // Autoplay might be blocked, play on first interaction
            document.addEventListener('click', () => {
                if (soundEnabled) {
                    robotTheme.play().catch(err => console.log('Theme play failed:', err));
                }
            }, { once: true });
        });
    }
});

// Plant button click
plantBtn.addEventListener('click', plantEmotion);
emotionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') plantEmotion();
});

// Plant emotion function
function plantEmotion() {
    const emotion = emotionInput.value.toLowerCase().trim();
    
    if (!emotion) {
        shakeInput();
        return;
    }
    
    // Easter egg - love transforms the dome
    if (emotion === 'love') {
        activateLoveMode();
    }
    
    // Find matching tree or use default
    let treeImage = emotionTrees[emotion] || 'emotion-hope.png'; // Default to hope
    
    // Create chrome orb first
    createChromeOrb(treeImage);
    
    // Clear input
    emotionInput.value = '';
    
    // Update count
    gardenCount++;
    updateGardenCount();
    
    // Play sound
    if (soundEnabled) {
        playPlantSound();
    }
}

// Adjust tree positioning for mobile
function getTreeSize() {
    if (window.innerWidth <= 480) {
        return { width: 100, height: 133 };
    } else if (window.innerWidth <= 768) {
        return { width: 120, height: 160 };
    } else if (window.innerWidth <= 1024) {
        return { width: 150, height: 200 };
    }
    return { width: 180, height: 240 };
}

// Create chrome orb that transforms into tree
function createChromeOrb(treeImage) {
    const orb = document.createElement('div');
    orb.className = 'chrome-orb';
    
    const treeSize = getTreeSize();
    const padding = Math.max(50, treeSize.width / 2);
    
    // Random position in garden area - adjusted for screen size
    const x = Math.random() * (gardenArea.offsetWidth - treeSize.width - padding) + padding;
    const y = Math.random() * (gardenArea.offsetHeight - treeSize.height - 50) + 50;
    
    orb.style.left = x + 'px';
    orb.style.top = y + 'px';
    
    gardenArea.appendChild(orb);
    
    // Transform orb into tree after animation
    setTimeout(() => {
        orb.remove();
        createTree(treeImage, x, y);
        createStarParticles(x, y - 50); // Adjusted for tree center
    }, 2000);
}

// Create tree
function createTree(treeImage, x, y) {
    const tree = document.createElement('div');
    tree.className = 'emotion-tree';
    
    const treeSize = getTreeSize();
    tree.style.left = x - (treeSize.width / 2) + 'px';
    tree.style.top = y - (treeSize.height / 2) + 'px';
    
    const img = document.createElement('img');
    img.src = 'assets/' + treeImage;
    tree.appendChild(img);
    
    gardenArea.appendChild(tree);
    
    // Store tree data
    currentGardens.push({ tree: treeImage, x: x, y: y });
    
    // Add click interaction
    tree.addEventListener('click', () => {
        createStarBurst(x, y - 50);
    });
}

// Create star particles that float up
function createStarParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'star-particle';
            star.style.left = (x + (Math.random() - 0.5) * 50) + 'px';
            star.style.top = y + 'px';
            
            particleContainer.appendChild(star);
            
            // Add to constellation
            setTimeout(() => {
                addToConstellation();
            }, 7000);
            
            // Remove after animation
            setTimeout(() => {
                star.remove();
            }, 8000);
        }, i * 200);
    }
}

// Create star burst effect
function createStarBurst(x, y) {
    for (let i = 0; i < 10; i++) {
        const star = document.createElement('div');
        star.className = 'star-particle';
        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.animation = `starBurst 1s ease-out forwards`;
        
        const angle = (360 / 10) * i;
        star.style.setProperty('--burst-x', Math.cos(angle * Math.PI / 180) * 100 + 'px');
        star.style.setProperty('--burst-y', Math.sin(angle * Math.PI / 180) * 100 + 'px');
        
        particleContainer.appendChild(star);
        
        setTimeout(() => star.remove(), 1000);
    }
}

// Add custom starBurst animation
const style = document.createElement('style');
style.textContent = `
    @keyframes starBurst {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--burst-x), var(--burst-y)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add star to constellation
function addToConstellation() {
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.top = Math.random() * (window.innerHeight * 0.3) + 'px';
    star.style.animation = 'none';
    star.style.opacity = '0.8';
    star.style.transform = 'scale(0.5)';
    
    constellationArea.appendChild(star);
}

// Shake input on error
function shakeInput() {
    emotionInput.style.animation = 'shake 0.5s';
    setTimeout(() => {
        emotionInput.style.animation = '';
    }, 500);
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// Update garden count display
function updateGardenCount() {
    gardenCountDisplay.textContent = String(gardenCount).padStart(5, '0');
}

// Easter egg - love mode
function activateLoveMode() {
    document.body.classList.add('love-mode');
    
    // Switch to geodesic dome
    const domeOverlay = document.querySelector('.dome-overlay');
    domeOverlay.style.backgroundImage = "url('assets/robot-globe-2.png')";
    
    // Create rainbow explosion
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createRainbowParticle();
        }, i * 100);
    }
    
    // Revert after 10 seconds
    setTimeout(() => {
        document.body.classList.remove('love-mode');
        domeOverlay.style.backgroundImage = "url('assets/robot-globe.png')";
    }, 10000);
}

// Create rainbow particle
function createRainbowParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '30px';
    particle.style.height = '30px';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    particle.style.boxShadow = '0 0 20px currentColor';
    particle.style.animation = 'floatAway 3s ease-out forwards';
    
    particleContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 3000);
}

// Add float away animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes floatAway {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-200px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatStyle);

// Sound toggle - updated to include theme music
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.querySelector('img').src = soundEnabled ? 
        'assets/sound-icon-on.png' : 'assets/sound-icon-off.png';
    
    // Toggle theme music
    const robotTheme = document.getElementById('robotRoomTheme');
    if (robotTheme) {
        if (soundEnabled) {
            robotTheme.play().catch(e => console.log('Theme play failed:', e));
        } else {
            robotTheme.pause();
        }
    }
});

// Play plant sound
function playPlantSound() {
    const audio = document.getElementById('plantSound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Cursor trail effect
function initializeCursorTrail() {
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create sparkle occasionally
        if (Math.random() < 0.1) {
            createCursorSparkle(mouseX, mouseY);
        }
    });
}

// Create cursor sparkle
function createCursorSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
}

// Initialize background particles
function initializeBackgroundParticles() {
    // Create ambient floating particles
    setInterval(() => {
        if (Math.random() < 0.3) {
            createAmbientParticle();
        }
    }, 2000);
}

// Create ambient particle
function createAmbientParticle() {
    const particle = document.createElement('div');
    particle.className = 'star-particle';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';
    particle.style.animation = 'ambientFloat 15s ease-out forwards';
    particle.style.opacity = '0.3';
    
    particleContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 15000);
}

// Add ambient float animation
const ambientStyle = document.createElement('style');
ambientStyle.textContent = `
    @keyframes ambientFloat {
        0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-${window.innerHeight + 100}px) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(ambientStyle);

// Load existing gardens (simulated)
function loadExistingGardens() {
    // Start with fewer gardens and stagger them more
    const existingEmotions = ['hope', 'joy'];
    existingEmotions.forEach((emotion, index) => {
        setTimeout(() => {
            const tree = emotionTrees[emotion];
            const x = 100 + (index * 200) + Math.random() * 100;
            const y = Math.random() * 100 + 50;
            createTree(tree, x + 45, y + 100);
        }, index * 1000);
    });
}

// Console Easter egg
console.log('%c🌟 Welcome to the Digital Garden Observatory 🌟', 
    'font-size: 20px; color: #FFD700; text-shadow: 0 0 10px #FFD700;');
console.log('%cPlant your emotions and watch them bloom into stars...', 
    'font-style: italic; color: #87CEEB;');

// Window resize handler
window.addEventListener('resize', () => {
    // Adjust garden positions if needed
    const treeSize = getTreeSize();
    
    currentGardens.forEach((garden, index) => {
        const treeElements = gardenArea.querySelectorAll('.emotion-tree');
        const tree = treeElements[index];
        if (tree) {
            const maxX = gardenArea.offsetWidth - treeSize.width;
            const maxY = gardenArea.offsetHeight - treeSize.height;
            tree.style.left = Math.min(garden.x - (treeSize.width / 2), maxX) + 'px';
            tree.style.top = Math.min(garden.y - (treeSize.height / 2), maxY) + 'px';
        }
    });
});

// Touch support for mobile
let touchStartTime = 0;
emotionInput.addEventListener('touchstart', () => {
    touchStartTime = Date.now();
});

emotionInput.addEventListener('touchend', (e) => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration < 200) { // Quick tap
        e.preventDefault();
        emotionInput.focus();
    }
});

// Creator Note Modal Functions
window.addEventListener('load', () => {
    // Show creator note on first visit
    const hasVisited = sessionStorage.getItem('robotRoomVisited');
    if (!hasVisited) {
        const creatorNote = document.getElementById('creatorNote');
        if (creatorNote) {
            creatorNote.style.display = 'flex';
            sessionStorage.setItem('robotRoomVisited', 'true');
            
            // Theme music already playing from DOMContentLoaded
        }
    }
});

// Show creator note
function showCreatorNote() {
    const creatorNote = document.getElementById('creatorNote');
    
    if (creatorNote) {
        creatorNote.style.display = 'flex';
        
        // Theme is already playing in background, maybe increase volume slightly
        const robotTheme = document.getElementById('robotRoomTheme');
        if (robotTheme && soundEnabled) {
            robotTheme.volume = 0.3; // Slightly louder for the note
        }
    }
}

// Close creator note
function closeCreatorNote() {
    const creatorNote = document.getElementById('creatorNote');
    
    if (creatorNote) {
        creatorNote.style.display = 'none';
        
        // Return theme to background volume
        const robotTheme = document.getElementById('robotRoomTheme');
        if (robotTheme) {
            robotTheme.volume = 0.2; // Back to soft background volume
        }
    }
}

// Make functions globally available
window.showCreatorNote = showCreatorNote;
window.closeCreatorNote = closeCreatorNote;