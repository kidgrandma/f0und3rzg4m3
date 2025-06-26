// Audio setup
const audio = {
    start: new Audio('../assets/gallery/gallery-start.mp3'),
    background: new Audio('../assets/gallery/gallery.mp3'),
    openPing: new Audio('../assets/gallery/gallery-open-default-ping.mp3'),
    random1: new Audio('../assets/gallery/gallery-1-random.mp3'),
    random2: new Audio('../assets/gallery/gallery-2-random.mp3'),
    random3: new Audio('../assets/gallery/gallery-3-random.mp3')
};

// Configure audio
audio.background.loop = true;
audio.background.volume = 0.3;

// Bear data
const bears = [
    {
        id: 'adderall-bear',
        name: "Adderall Shortage Bear",
        price: 50,
        power: "UR ADDY DADDY IS OUT FOR THE NITE - Blocks another player for 6 hours",
        image: "adderall-bear.png"
    },
    {
        id: 'ayahuasca-bear-bundle',
        name: "Ayahuasca Bear Bundle",
        price: 100,
        power: "THE BEAR IS JUST A BB SHAMAN - Includes: BUDDY™️ + Revival + Visine-Vision",
        image: "ayahuasca-bear-bundle.png",
        isBundle: true
    },
    {
        id: 'buddy-bear',
        name: "BUDDY™️ Bear",
        price: 40,
        power: "BUDDY™️ SYSTEM 5.0 - Attach yourself to another player for 24 hours",
        image: "buddy-bear.png"
    },
    {
        id: 'mcafee-bear',
        name: "McAfee Cafe Bear",
        price: 50,
        power: "WE DON'T HAVE OAT MILK ONLY SPYWARE IS THAT OK? - Drop into other teams' group chats",
        image: "mcafee-bear.png"
    },
    {
        id: 'revival-bear',
        name: "Revival Bear",
        price: 50,
        power: "THE HERPES OF BEARS - Resurrect after elimination",
        image: "revival-bear.png"
    },
    {
        id: 'sugar-bear',
        name: "Sugar Bby Bear",
        price: 40,
        power: "SHE WILL CALL - Steal from another player",
        image: "sugar-bear.png"
    },
    {
        id: 'twitter-bear',
        name: "Twitter Shield Bear",
        price: 20,
        power: "SCRUB DADDY BUT FOR YOUR POOR LIFE CHOICES - Un-cancel your player",
        image: "twitter-bear.png"
    }
];

// Temporary bear selection
let selectedBears = [];
let currentFounder = null;

// Founder data - reordered to put recognizable names at top
const founders = [
    // Top tier - most recognizable (keeping original order within tiers)
    { id: '08_elon_musk', name: 'Elon Musk', price: 100, company: 'Space X', warning: 'WARNING: Wants to literally go to space without me' },
    { id: '09_jeff_bezos', name: 'Jeff Bezos', price: 100, company: 'Amazon' },
    { id: '10_marc_zuckerberg', name: 'Mark Zuckerberg', price: 50, company: 'Meta' },
    { id: '12_bill_gates', name: 'Bill Gates', price: 50, company: 'Microsoft' },
    { id: '18_steve_jobs', name: 'Steve Jobs', price: 50, company: 'Apple' },
    { id: '11_google_founders', name: 'Larry Page & Sergey Brin', price: 75, company: 'Google', twins: true },
    
    // Second tier - well known
    { id: '17_sam_altman', name: 'Sam Altman', price: 50, company: 'OpenAI' },
    { id: '13_jensen_huang', name: 'Jensen Huang', price: 50, company: 'NVIDIA' },
    { id: '20_jack_dorsey', name: 'Jack Dorsey', price: 25, company: 'Twitter' },
    { id: '14_peter_thiel', name: 'Peter Thiel', price: 50, company: 'Palantir' },
    { id: '53_youtube', name: 'Chad Hurley & Steve Chen', price: 75, company: 'YouTube', twins: true },
    { id: '49_reed_hastings', name: 'Reed Hastings', price: 25, company: 'Netflix' },
    
    // Mix the rest randomly throughout
    { id: '15_jack_ma', name: 'Jack Ma', price: 25, company: 'Alibaba' },
    { id: '25_elizabeth_holmes', name: 'Elizabeth Holmes', price: 25, company: 'Theranos', warning: 'May bite' },
    { id: '06_brian_chesky', name: 'Brian Chesky', price: 25, company: 'Airbnb' },
    { id: '47_daniel_ek', name: 'Daniel Ek', price: 25, company: 'Spotify' },
    { id: '02_sheryl_sandberg', name: 'Sheryl Sandberg', price: 25, company: 'Meta' },
    { id: '48_sam_bankman-fried', name: 'Sam Bankman-Fried', price: 25, company: 'FTX', warning: 'Previous adoption fell through' },
    { id: '32_kevin_systrom', name: 'Kevin Systrom', price: 25, company: 'Instagram' },
    { id: '38_juul', name: 'James Monsees & Adam Bowen', price: 75, company: 'Juul', twins: true, warning: 'Package deal - both extremely vapey' },
    { id: '01_marc_andreessen', name: 'Marc Andreessen', price: 25, company: 'a16z' },
    { id: '27_travis_kalanick', name: 'Travis Kalanick', price: 25, company: 'Uber' },
    { id: '19_vitalik_buterin', name: 'Vitalik Buterin', price: 25, company: 'Ethereum' },
    { id: '28_adam_neumann', name: 'Adam Neumann', price: 25, company: 'WeWork', warning: 'Requires constant supervision' },
    { id: '50_jessica_alba', name: 'Jessica Alba', price: 25, company: 'Honest Co.' },
    { id: '04_brian_armstrong', name: 'Brian Armstrong', price: 25, company: 'Coinbase' },
    { id: '26_evan_spiegel', name: 'Evan Spiegel', price: 25, company: 'Snapchat' },
    { id: '33_martin_shkreli', name: 'Martin Shkreli', price: 25, company: 'Pharma', warning: 'No returns accepted' },
    { id: '05_keith_rabois', name: 'Keith Rabois', price: 25, company: 'PayPal' },
    { id: '51_zhang_yiming', name: 'Zhang Yiming', price: 25, company: 'TikTok' },
    { id: '31_whitney_wolfe_herd', name: 'Whitney Wolfe Herd', price: 25, company: 'Bumble' },
    { id: '30_john_mckafee', name: 'John McAfee', price: 25, company: 'McAfee', warning: 'VERY BITEY' },
    { id: '16_sudnar_pichai', name: 'Sundar Pichai', price: 25, company: 'Google' },
    { id: '07_tobias_lutke', name: 'Tobias Lütke', price: 25, company: 'Shopify' },
    { id: '45_sean_rad', name: 'Sean Rad', price: 25, company: 'Tinder' },
    { id: '24_larry_ellison', name: 'Larry Ellison', price: 25, company: 'Oracle' },
    { id: '36_alexis_ohanian', name: 'Alexis Ohanian', price: 25, company: 'Reddit' },
    { id: '22_pavel_durov', name: 'Pavel Durov', price: 25, company: 'Telegram' },
    { id: '52_palmer_luckey', name: 'Palmer Luckey', price: 25, company: 'Oculus' },
    { id: '03_dom_hofmann', name: 'Dom Hofmann', price: 25, company: 'Vine' },
    { id: '39_ariana_huffington', name: 'Arianna Huffington', price: 25, company: 'HuffPost' },
    { id: '37_steve_wozniak', name: 'Steve Wozniak', price: 25, company: 'Apple' },
    { id: '23_drew_houston', name: 'Drew Houston', price: 25, company: 'Dropbox' },
    { id: '41_lucy_guo', name: 'Lucy Guo', price: 25, company: 'Scale AI' },
    { id: '29_sean_parker', name: 'Sean Parker', price: 25, company: 'Napster' },
    { id: '34_meg_whitman', name: 'Meg Whitman', price: 25, company: 'eBay' },
    { id: '42_jonah_peretti', name: 'Jonah Peretti', price: 25, company: 'BuzzFeed' },
    { id: '46_dread_pirate', name: 'Ross Ulbricht', price: 25, company: 'Silk Road', warning: 'Currently grounded' },
    { id: '43_sophia_amoruso', name: 'Sophia Amoruso', price: 25, company: 'Nasty Gal' },
    { id: '35_tom_anderson', name: 'Tom Anderson', price: 25, company: 'MySpace' },
    { id: '44_kevin_rose', name: 'Kevin Rose', price: 25, company: 'Digg' },
    { id: '40_craig_newmark', name: 'Craig Newmark', price: 25, company: 'Craigslist' },
    { id: '21_jimmy_wales', name: 'Jimmy Wales', price: 1, company: 'Wikipedia' }
];

// Check if Steve Jobs is already adopted
const adoptedFounders = [
    '15_jack_ma',
    '03_dom_hofmann',
    '23_drew_houston',
    '45_sean_rad',
    '29_sean_parker',
    '11_google_founders',
    '21_jimmy_wales',
    '24_larry_ellison',
    '50_jessica_alba',
    '34_meg_whitman',
    '27_travis_kalanick',
    '25_elizabeth_holmes',
    '43_sophia_amoruso',
    '31_whitney_wolfe_herd',
    '49_reed_hastings',
    '47_daniel_ek',
    '53_youtube',
    '13_jensen_huang',
    '51_zhang_yiming',
    '20_jack_dorsey',
    '30_john_mckafee',
    '40_craig_newmark',
    '48_sam_bankman-fried',
    '36_alexis_ohanian',
    '46_dread_pirate',
    '35_tom_anderson',
    '17_sam_altman',
];

// Scatter positions for organic layout
function getScatterPosition(index, total) {
    const container = document.getElementById('orphanageContainer');
    const containerWidth = container.offsetWidth;
    const isMobile = containerWidth < 768;
    
    // Calculate dynamic container height based on number of founders
    const rowHeight = isMobile ? 180 : 280;
    const columnsPerRow = isMobile ? 3 : 5;
    const totalRows = Math.ceil(total / columnsPerRow);
    const containerHeight = totalRows * rowHeight + 200;
    
    // Create zones for better distribution
    const zone = index % columnsPerRow;
    const row = Math.floor(index / columnsPerRow);
    
    // Calculate base position
    const cardWidth = isMobile ? 100 : 150;
    const horizontalSpacing = containerWidth / columnsPerRow;
    const baseX = zone * horizontalSpacing + horizontalSpacing / 2;
    const baseY = row * rowHeight + 100;
    
    // Add random offset for organic feel
    const maxOffsetX = isMobile ? 20 : 40;
    const maxOffsetY = isMobile ? 15 : 30;
    const offsetX = (Math.random() - 0.5) * maxOffsetX;
    const offsetY = (Math.random() - 0.5) * maxOffsetY;
    
    // Random rotation
    const rotation = (Math.random() - 0.5) * 10;
    
    // Ensure cards don't go off screen
    const finalX = Math.max(cardWidth/2, Math.min(containerWidth - cardWidth/2, baseX + offsetX));
    
    return {
        x: finalX,
        y: baseY + offsetY,
        rotation: rotation,
        containerHeight: containerHeight
    };
}

// Start experience function called by intro button
function startExperience() {
    // Hide intro modal
    document.getElementById('introModal').classList.add('hidden');
    
    // Play start sound
    audio.start.play();
    
    // Start background music after 1 second
    setTimeout(() => {
        audio.background.play();
    }, 1000);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    // Clear any old cart data for fresh start
    Cart.clearCart();
    
    renderFounders();
    updateFounderDisplay();
    
    // Re-render on window resize for responsive layout
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderFounders();
        }, 250);
    });
});

// Update founder display
function updateFounderDisplay() {
    const cart = Cart.getCart();
    const hasFounders = cart.founders && cart.founders.length > 0;
    
    // Update founder cards to show which are in cart
    const cards = document.querySelectorAll('.founder-card');
    cards.forEach(card => {
        const portrait = card.querySelector('.portrait img');
        if (portrait) {
            const founderId = portrait.src.match(/\/([^\/]+)\.png$/)?.[1];
            if (founderId && cart.founders?.some(f => f.id === founderId)) {
                card.classList.add('in-cart');
            } else {
                card.classList.remove('in-cart');
            }
        }
    });
}

// Render founders with scattered layout
function renderFounders() {
    const container = document.getElementById('orphanageContainer');
    container.innerHTML = '';
    
    let maxHeight = 0;
    
    founders.forEach((founder, index) => {
        const card = document.createElement('div');
        card.className = 'founder-card';
        
        // Check if adopted
        if (adoptedFounders.includes(founder.id)) {
            card.classList.add('unavailable');
        }
        
        // Get scatter position
        const pos = getScatterPosition(index, founders.length);
        card.style.left = `${pos.x}px`;
        card.style.top = `${pos.y}px`;
        card.style.transform = `translate(-50%, -50%) rotate(${pos.rotation}deg)`;
        card.style.setProperty('--base-rotate', `${pos.rotation}deg`);
        card.style.setProperty('--hover-rotate', `${pos.rotation * 1.5}deg`);
        card.style.setProperty('--card-index', index);
        
        maxHeight = Math.max(maxHeight, pos.containerHeight);
        
        // Price to nameplate mapping
        const nameplateFile = `${founder.price}.png`;
        
        card.innerHTML = `
            <div class="portrait" onclick="${!adoptedFounders.includes(founder.id) ? `openTamaModal('${founder.id}')` : ''}">
                <img src="../assets/gallery/${founder.id}.png" alt="${founder.name}">
                ${adoptedFounders.includes(founder.id) ? '<div class="adopted-tag">ADOPTED</div>' : ''}
            </div>
            <div class="nameplate" onclick="${!adoptedFounders.includes(founder.id) ? `openTamaModal('${founder.id}')` : ''}">
                <img src="../assets/gallery/${nameplateFile}" alt="${founder.price}">
                <div class="company-name">${founder.company}</div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Set container height
    container.style.height = `${maxHeight}px`;
}

// Open Tamagotchi modal
function openTamaModal(founderId) {
    const founder = founders.find(f => f.id === founderId);
    if (!founder) return;
    
    // Play opening sound
    audio.openPing.play();
    
    // 30% chance to play random sound too
    if (Math.random() < 0.3) {
        setTimeout(() => {
            const randomSounds = [audio.random1, audio.random2, audio.random3];
            const randomSound = randomSounds[Math.floor(Math.random() * randomSounds.length)];
            randomSound.play();
        }, 100);
    }
    
    const modal = document.getElementById('tamaModal');
    const tamaScreen = document.querySelector('.tama-screen');
    
    // Check if already in cart
    const cart = Cart.getCart();
    const inCart = cart.founders && cart.founders.some(f => f.id === founder.id);
    
    tamaScreen.innerHTML = `
        <div class="tama-portrait">
            <img src="../assets/gallery/${founder.id}.png" alt="${founder.name}">
        </div>
        <div class="tama-name">${founder.name}</div>
        <div class="tama-company">${founder.company}</div>
        ${founder.twins ? '<div class="tama-twins">👯 TWINS</div>' : ''}
        <div class="tama-price">${founder.price}</div>
        ${founder.warning ? `<div class="tama-warning">${founder.warning}</div>` : ''}
    `;
    
    // Setup button
    const addBtn = document.getElementById('addToCartBtn');
    
    if (inCart) {
        addBtn.innerHTML = '✓';
        addBtn.classList.add('selected');
        addBtn.disabled = true;
    } else {
        addBtn.innerHTML = '+';
        addBtn.classList.remove('selected');
        addBtn.disabled = false;
        addBtn.onclick = () => adoptFounder(founder);
    }
    
    modal.style.display = 'block';
}

// Close modal when clicking outside
window.onclick = (event) => {
    const modal = document.getElementById('tamaModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

function adoptFounder(founder) {
    currentFounder = founder;
    Cart.addFounder(founder);
    
    // Update the card to show it's in cart
    const cards = document.querySelectorAll('.founder-card');
    cards.forEach(card => {
        const portrait = card.querySelector('.portrait img');
        if (portrait && portrait.src.includes(founder.id)) {
            card.classList.add('in-cart');
        }
    });
    
    // Close tama modal and open bear modal
    setTimeout(() => {
        document.getElementById('tamaModal').style.display = 'none';
        openBearModal();
    }, 300);
}

// Bear selection functions
function openBearModal() {
    // Play opening sound
    audio.openPing.play();
    
    selectedBears = [];
    const modal = document.getElementById('bearModal');
    const bearGrid = document.getElementById('bearGrid');
    
    // Update founder preview
    document.getElementById('founderNamePreview').textContent = currentFounder.name;
    document.getElementById('founderPreviewImg').src = `../assets/gallery/${currentFounder.id}.png`;
    document.getElementById('founderPreviewImg').alt = currentFounder.name;
    
    bearGrid.innerHTML = bears.map(bear => `
        <div class="bear-card" data-bear-id="${bear.id}" onclick="toggleBear('${bear.id}')">
            ${bear.isBundle ? '<span class="bear-bundle-tag">Bundle</span>' : ''}
            <div class="bear-image">
                <img src="../assets/gallery/${bear.image}" alt="${bear.name}">
            </div>
            <div class="bear-name">${bear.name}</div>
            <div class="bear-price">${bear.price}</div>
            <div class="bear-power">${bear.power}</div>
        </div>
    `).join('');
    
    updateBearTotal();
    modal.style.display = 'block';
}

function toggleBear(bearId) {
    const bear = bears.find(b => b.id === bearId);
    const bearCard = document.querySelector(`[data-bear-id="${bearId}"]`);
    
    const index = selectedBears.findIndex(b => b.id === bearId);
    if (index > -1) {
        selectedBears.splice(index, 1);
        bearCard.classList.remove('selected');
    } else {
        selectedBears.push(bear);
        bearCard.classList.add('selected');
    }
    
    updateBearTotal();
}

function updateBearTotal() {
    const total = selectedBears.reduce((sum, bear) => sum + bear.price, 0);
    document.getElementById('bearTotal').textContent = total;
}

function proceedToCheckout() {
    document.getElementById('bearModal').style.display = 'none';
    openCheckoutModal();
}

function closeBearModal() {
    document.getElementById('bearModal').style.display = 'none';
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const itemsContainer = document.getElementById('checkoutItems');
    const cart = Cart.getCart();
    
    // Build visual preview
    const founderPreview = document.getElementById('checkoutFounderPreview');
    const bearsPreview = document.getElementById('checkoutBearsPreview');
    
    // Add founder image
    founderPreview.innerHTML = `<img src="../assets/gallery/${currentFounder.id}.png" alt="${currentFounder.name}">`;
    
    // Add bear images
    if (selectedBears.length > 0) {
        bearsPreview.innerHTML = '<span class="checkout-plus">+</span>' + 
            selectedBears.map(bear => 
                `<img class="checkout-bear-img" src="../assets/gallery/${bear.image}" alt="${bear.name}">`
            ).join('');
    } else {
        bearsPreview.innerHTML = '';
    }
    
    // Build items list
    let itemsHtml = '';
    let total = 0;
    
    // Add founder
    if (currentFounder) {
        itemsHtml += `
            <div class="checkout-item">
                <div class="item-info">
                    <div class="item-name">${currentFounder.name}</div>
                    <div class="item-desc">${currentFounder.company}${currentFounder.twins ? ' (twins!)' : ''}</div>
                </div>
                <div class="item-price">${currentFounder.price}</div>
            </div>
        `;
        total += currentFounder.price;
    }
    
    // Add bears
    selectedBears.forEach(bear => {
        itemsHtml += `
            <div class="checkout-item">
                <div class="item-info">
                    <div class="item-name">${bear.name}</div>
                    <div class="item-desc">special gift</div>
                </div>
                <div class="item-price">${bear.price}</div>
            </div>
        `;
        total += bear.price;
    });
    
    itemsContainer.innerHTML = itemsHtml;
    document.getElementById('checkoutTotal').textContent = total;
    
    modal.style.display = 'block';
}

function backToBears() {
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('bearModal').style.display = 'block';
}

function startOver() {
    if (confirm('start fresh with a new founder?')) {
        currentFounder = null;
        selectedBears = [];
        
        // Close all modals
        document.getElementById('bearModal').style.display = 'none';
        document.getElementById('checkoutModal').style.display = 'none';
        
        // Clear cart and refresh
        Cart.clearCart();
        updateFounderDisplay();
    }
}
function selectPayment(method) {
    const total = currentFounder.price + selectedBears.reduce((sum, bear) => sum + bear.price, 0);
    const memo = `${currentFounder.name} adoption`;
    
    // Build payment URLs
    if (method === 'venmo') {
        // Try web URL first, then app URL
        const venmoWebUrl = `https://venmo.com/worksucksdotnet?txn=pay&amount=${total}&note=${encodeURIComponent(memo)}`;
        window.open(venmoWebUrl, '_blank');
        
        // Show instructions as fallback
        showPaymentInstructions('venmo', '@worksucksdotnet', total, memo);
    } else if (method === 'zelle') {
        showPaymentInstructions('zelle', 'ask kidgrandma DM', total, memo);
        // Show instructions as fallback
        showPaymentInstructions('paypal', 'paizley@worksucks.net', total, memo);
    }
}

function showPaymentInstructions(method, handle, total, memo) {
    const modal = document.getElementById('paymentModal');
    const title = document.getElementById('paymentTitle');
    const instructions = document.getElementById('paymentInstructions');
    
    const paymentInfo = {
        venmo: {
            title: 'venmo payment',
            instructions: `
                <p>send payment to:</p>
                <div class="payment-handle">@worksucksdotnet</div>
                <p>amount: <strong>${total}</strong></p>
                <p>add to memo: <strong>${memo}</strong></p>
            `
        },
        zelle: {
            title: 'zelle payment',
            instructions: `
                <p>send payment to:</p>
                <div class="payment-handle">ask kidgrandma DM</div>
                <p>amount: <strong>${total}</strong></p>
                <p>add to memo: <strong>${memo}</strong></p>
            `
        },
        paypal: {
            title: 'paypal payment',
            instructions: `
                <p>send donation to:</p>
                <div class="payment-handle">paizley@worksucks.net</div>
                <p>amount: <strong>${total}</strong></p>
                <p>note: <strong>${memo}</strong></p>
            `
        }
    };
    
    title.textContent = paymentInfo[method].title;
    instructions.innerHTML = paymentInfo[method].instructions;
    
    document.getElementById('checkoutModal').style.display = 'none';
    modal.style.display = 'block';
}

function completeOrder() {
    // Show confetti
    createConfetti();
    
    // Save the complete order
    const order = {
        founder: currentFounder,
        bears: selectedBears,
        total: currentFounder.price + selectedBears.reduce((sum, bear) => sum + bear.price, 0),
        timestamp: new Date().toISOString()
    };
    
    // Save to cart with bears
    Cart.addBears(currentFounder.id, selectedBears);
    
    // Clear current selection
    currentFounder = null;
    selectedBears = [];
    
    // Close all modals after delay
    setTimeout(() => {
        document.getElementById('paymentModal').style.display = 'none';
        alert('adoption complete! check your email for next steps.');
        updateFounderDisplay();
    }, 2000);
}

// Confetti animation
function createConfetti() {
    const container = document.getElementById('paymentModal');
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff0000'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Clear cart function
function clearCart() {
    if (confirm('Clear all adopted founders?')) {
        Cart.clearCart();
        updateFounderDisplay();
        renderFounders();
    }
}

// Admin function to manually clear cart (call from console if needed)
window.clearAllData = function() {
    localStorage.clear();
    location.reload();
};