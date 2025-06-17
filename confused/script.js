// Deck-o-Rama Interactive Script with Sound Effects

// Audio Setup
const audio = {
    mainTracks: [
        new Audio('../assets/confused/deck-main-1.mp3'),
        new Audio('../assets/confused/deck-main-2.mp3'),
        new Audio('../assets/confused/deck-main-3.mp3')
    ],
    openModal: new Audio('../assets/confused/open-modal.mp3'),
    finishDeck: new Audio('../assets/confused/finish-deck.mp3'),
    currentTrack: 0
};

// Initialize audio settings
audio.mainTracks.forEach(track => {
    track.volume = 0.7; // Adjust volume as needed
});
audio.openModal.volume = 0.8;
audio.finishDeck.volume = 0.9;

// Function to play background music sequentially
function playBackgroundMusic() {
    const currentAudio = audio.mainTracks[audio.currentTrack];
    
    currentAudio.play().catch(e => {
        console.log('Audio autoplay blocked. User needs to interact first.');
    });
    
    currentAudio.addEventListener('ended', () => {
        audio.currentTrack = (audio.currentTrack + 1) % audio.mainTracks.length;
        playBackgroundMusic();
    });
}

// Start background music when page loads (or on first user interaction)
document.addEventListener('DOMContentLoaded', () => {
    // Try to play immediately
    playBackgroundMusic();
    
    // Backup: play on first user interaction if autoplay is blocked
    document.addEventListener('click', function startAudio() {
        if (audio.mainTracks[0].paused) {
            playBackgroundMusic();
        }
        document.removeEventListener('click', startAudio);
    }, { once: true });
});

// Product-specific mad lib templates
const productTemplates = {
    'cbd-sanitizer': {
        title: 'CBD SANITIZER REVOLUTION',
        template: 'Our {adjective1} CBD Hand Sanitizer disrupts the {industry} industry by combining {buzzword} technology with pure {vegetable} extract. Studies show {number}% of {pluralNoun} experience immediate {emotion} after use. Kill germs AND anxiety!'
    },
    'marshmallow-shoes': {
        title: 'MARSHMALLOW FOOTWEAR 3.0',
        template: 'Introducing {adjective1} Marshmallow Shoes - the {industry} industry\'s first {buzzword}-powered footwear made from compressed {vegetable}! {number}% of {pluralNoun} report feeling pure {emotion} with every squishy step.'
    },
    'salty-skittles': {
        title: 'SALTY SKITTLES PARADIGM',
        template: 'Taste the {adjective1} rainbow of the {industry} sector! Our {buzzword}-enhanced Salty Skittles contain real {vegetable} crystals. {number}% of {pluralNoun} say they\'ve never experienced such {emotion} in candy form!'
    },
    'glow-cds': {
        title: 'LUMINOUS UBER DISC TECH',
        template: 'Our {adjective1} Glow-in-Dark Uber CDs revolutionize the {industry} space using {buzzword} algorithms and {vegetable}-based phosphorescence. {number}% of {pluralNoun} report {emotion} when their rides glow!'
    },
    'horoscope-ice': {
        title: 'COSMIC ICE CUBE MATRIX',
        template: 'Experience {adjective1} hydration! Our Horoscope Ice Cubes predict your {industry} future using {buzzword} and frozen {vegetable} essence. {number}% of {pluralNoun} achieve {emotion} through astrological cooling!'
    },
    'brain-smoothie': {
        title: 'NEURAL SMOOTHIE SYNERGY',
        template: 'Unlock your {adjective1} potential! Brain Smoothies blend {industry} expertise with {buzzword} and organic {vegetable} neurons. {number}% of {pluralNoun} report maximum {emotion} after consumption!'
    }
};

// State management
let selectedProduct = null;
let madLibData = {};

// DOM elements
const productCards = document.querySelectorAll('.product-card');
const modalOverlay = document.getElementById('modalOverlay');
const madLibsModal = document.getElementById('madLibsModal');
const madLibsForm = document.getElementById('madLibsForm');
const finalDeck = document.getElementById('finalDeck');
const closeDeckBtn = document.getElementById('closeDeck');
const lotionTony = document.getElementById('lotionTony');

// Product card click handlers
productCards.forEach(card => {
    card.addEventListener('click', function() {
        selectedProduct = this.dataset.product;
        showMadLibsModal();
        
        // Make Lotion Tony excited (switch to sweating version)
        const tonyImage = document.getElementById('tonyImage');
        tonyImage.src = '../assets/confused/lotion-tony-sweating.png';
        
        setTimeout(() => {
            tonyImage.src = '../assets/confused/lotion-tony.png';
        }, 2000);
    });
});

// Show mad libs modal
function showMadLibsModal() {
    // Play modal open sound
    audio.openModal.currentTime = 0; // Reset to start
    audio.openModal.play().catch(e => console.log('Modal sound blocked'));
    
    modalOverlay.style.display = 'block';
    madLibsModal.style.display = 'block';
    
    // Reset form
    madLibsForm.reset();
    
    // Add entrance animation
    madLibsModal.style.animation = 'modalBounce 0.5s ease-out';
}

// Hide mad libs modal
function hideMadLibsModal() {
    modalOverlay.style.display = 'none';
    madLibsModal.style.display = 'none';
}

// Handle form submission
madLibsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(this);
    madLibData = {};
    for (let [key, value] of formData.entries()) {
        madLibData[key] = value.toUpperCase();
    }
    
    // Generate and show deck
    generateDeck();
    hideMadLibsModal();
});

// Generate the final deck
function generateDeck() {
    // Play finish deck sound
    audio.finishDeck.currentTime = 0; // Reset to start
    audio.finishDeck.play().catch(e => console.log('Finish sound blocked'));
    
    const template = productTemplates[selectedProduct];
    
    // Set headline
    document.getElementById('deckHeadline').textContent = template.title;
    
    // Generate text from template
    let deckText = template.template;
    for (let [key, value] of Object.entries(madLibData)) {
        deckText = deckText.replace(`{${key}}`, value);
    }
    document.getElementById('deckText').textContent = deckText;
    
    // Add product to showcase
    const showcase = document.getElementById('productShowcase');
    const productImageMap = {
        'cbd-sanitizer': 'product-cbd.png',
        'marshmallow-shoes': 'product-shoes.png',
        'salty-skittles': 'product-skittles.png',
        'glow-cds': 'product-cds.png',
        'horoscope-ice': 'product-ice.png',
        'brain-smoothie': 'product-smoothie.png'
    };
    
    showcase.innerHTML = `<img src="../assets/confused/${productImageMap[selectedProduct]}" alt="Product" style="width: 100%; height: 100%; object-fit: contain;">`;
    
    // Show deck with animation
    finalDeck.style.display = 'block';
    finalDeck.style.animation = 'deckSlideIn 0.8s ease-out';
    
    // Celebrate with Lotion Tony
    makeTonyDance();
}

// Get product class for styling
function getProductClass(product) {
    const classes = {
        'cbd-sanitizer': 'cbd',
        'marshmallow-shoes': 'shoes',
        'salty-skittles': 'skittles',
        'glow-cds': 'cds',
        'horoscope-ice': 'ice',
        'brain-smoothie': 'smoothie'
    };
    return classes[product];
}

// Get product label
function getProductLabel(product) {
    const labels = {
        'cbd-sanitizer': 'CBD',
        'marshmallow-shoes': 'SHOES',
        'salty-skittles': 'SALTY',
        'glow-cds': 'CDs',
        'horoscope-ice': 'ICE',
        'brain-smoothie': 'BRAIN'
    };
    return labels[product];
}

// Make Tony dance when deck is complete
function makeTonyDance() {
    const tonyImage = document.getElementById('tonyImage');
    
    // Switch to thumbs up Tony
    tonyImage.src = '../assets/confused/lotion-tony-thumbsup.png';
    tonyImage.style.animation = 'tonyDance 1s ease-in-out';
    
    // Update speech bubble
    const speechBubble = document.querySelector('.speech-bubble p');
    speechBubble.textContent = 'WOW! That\'s some premium synergy right there!';
    
    setTimeout(() => {
        tonyImage.style.animation = '';
        tonyImage.src = '../assets/confused/lotion-tony.png';
        speechBubble.textContent = 'Hi there, Bright Mind™! Ready to disrupt the future of electrolytes?';
    }, 5000);
}

// Close deck handler
closeDeckBtn.addEventListener('click', function() {
    finalDeck.style.animation = 'deckSlideOut 0.5s ease-in';
    setTimeout(() => {
        finalDeck.style.display = 'none';
        finalDeck.style.animation = '';
    }, 500);
});

// Modal overlay click to close
modalOverlay.addEventListener('click', hideMadLibsModal);

// Add required animations to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes modalBounce {
        0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes deckSlideIn {
        0% { transform: translate(-50%, -50%) scale(0.5) rotate(-10deg); opacity: 0; }
        100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
    }
    
    @keyframes deckSlideOut {
        0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0.5) rotate(10deg); opacity: 0; }
    }
    
    @keyframes tonyDance {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
    }
    
    .tony-placeholder.excited {
        animation: bounce 0.5s ease-out !important;
    }
`;
document.head.appendChild(styleSheet);

// Add some extra polish
document.addEventListener('DOMContentLoaded', function() {
    // Add floating bubbles in background
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.style.position = 'fixed';
        bubble.style.width = Math.random() * 60 + 20 + 'px';
        bubble.style.height = bubble.style.width;
        bubble.style.background = 'rgba(255,255,255,0.1)';
        bubble.style.borderRadius = '50%';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.bottom = '-100px';
        bubble.style.animation = `float ${Math.random() * 10 + 5}s linear`;
        bubble.style.pointerEvents = 'none';
        document.body.appendChild(bubble);
        
        setTimeout(() => bubble.remove(), 15000);
    }
    
    // Create float animation
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            to { transform: translateY(-120vh); }
        }
    `;
    document.head.appendChild(floatStyle);
    
    // Generate bubbles periodically
    setInterval(createBubble, 3000);
    
    // Initial bubbles
    for (let i = 0; i < 5; i++) {
        setTimeout(createBubble, i * 500);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        if (madLibsModal.style.display === 'block') {
            hideMadLibsModal();
        }
        if (finalDeck.style.display === 'block') {
            closeDeckBtn.click();
        }
    }
});

// Console easter egg
console.log('%c🧴 LOTION TONY™ SAYS: "Stay moisturized, stay disruptive!" 🧴', 
    'font-size: 20px; color: #FF69B4; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');

// Add Y2K floating orbs
function createFloatingOrb() {
    const orb = document.createElement('div');
    orb.className = 'floating-orb';
    orb.style.left = Math.random() * 100 + '%';
    orb.style.animationDuration = (Math.random() * 10 + 10) + 's';
    orb.style.animationDelay = Math.random() * 5 + 's';
    document.querySelector('.deck-container').appendChild(orb);
}

// Create initial orbs
for (let i = 0; i < 5; i++) {
    createFloatingOrb();
}

// Enhanced marquee - add more copies for seamless scroll
document.addEventListener('DOMContentLoaded', function() {
    const marquee = document.querySelector('.title-marquee');
    if (marquee) {
        // Add 2 more copies for seamless scrolling
        for (let i = 0; i < 2; i++) {
            const titleClone = document.querySelector('.deck-title').cloneNode(true);
            titleClone.setAttribute('aria-hidden', 'true');
            marquee.appendChild(titleClone);
        }
    }
});

// Add CSS for floating orbs
const orbStyle = document.createElement('style');
orbStyle.textContent = `
    .floating-orb {
        position: absolute;
        width: 60px;
        height: 60px;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(0,255,255,0.3));
        border-radius: 50%;
        bottom: -60px;
        animation: floatUp 15s linear infinite;
        pointer-events: none;
        filter: blur(1px);
        mix-blend-mode: screen;
    }
    
    @keyframes floatUp {
        to {
            bottom: 110%;
            transform: translateX(100px) rotate(360deg);
        }
    }
`;
document.head.appendChild(orbStyle);

// Audio controls helper (for debugging/testing)
console.log('Audio Controls: audio.mainTracks[0].pause() to pause music');
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