// Fortune Selfie CCTV Script - Updated with brightness fixes

// State management
let cameraStream = null;
let userHandle = '';
let capturedImageData = null;

// Silver card images (replacing dog tags)
const silverCards = [
    '711.png',
    'hair.png',
    'jesus.png',
    'icecream.png',
    'judge.png',
    'you.png',
    'unforgivable.png',
    'scott.png'
];

// DOM Elements
const startBtn = document.getElementById('startBtn');
const startScreen = document.getElementById('startScreen');
const cameraFeed = document.getElementById('cameraFeed');
const uploadPreview = document.getElementById('uploadPreview');
const captureBtn = document.getElementById('captureBtn');
const fileInput = document.getElementById('fileInput');
const frozenCapture = document.getElementById('frozenCapture');
const etherealOverlay = document.getElementById('etherealOverlay');
const bgMusic = document.getElementById('bgMusic');
const captureSound = document.getElementById('captureSound');
const instructionsPopup = document.getElementById('instructionsPopup');
const continueBtn = document.getElementById('continueBtn');
const userHandleInput = document.getElementById('userHandle');
const resultPopup = document.getElementById('resultPopup');
const resultPhoto = document.getElementById('resultPhoto');
const resultCard = document.getElementById('resultCard');
const timestampDate = document.getElementById('timestampDate');
const timestampHandle = document.getElementById('timestampHandle');
const retakeBtn = document.getElementById('retakeBtn');
const paiBtn = document.getElementById('paiBtn');
const cameraWindow = document.querySelector('.camera-window');

// Initialize
window.addEventListener('load', () => {
    bgMusic.volume = 0.3;
    console.log('Fortune Selfie CCTV initialized');
});

// Continue button from instructions (play.png)
continueBtn.addEventListener('click', () => {
    userHandle = userHandleInput.value.trim();
    if (!userHandle) {
        userHandle = 'anonymous';
    }
    if (!userHandle.startsWith('@')) {
        userHandle = '@' + userHandle;
    }
    
    // Play music if not already playing
    bgMusic.play().catch(e => {
        console.log('Music will play on next interaction');
    });
    
    // Hide instructions popup with fade
    instructionsPopup.style.opacity = '0';
    setTimeout(() => {
        instructionsPopup.style.display = 'none';
    }, 300);
});

// Start button click (open-glen.png)
startBtn.addEventListener('click', async () => {
    console.log('Glen opened!');
    
    // Play music on user interaction
    bgMusic.play();
    
    // Add camera active class for mobile
    document.body.classList.add('camera-active');
    
    // Try camera access with better constraints
    try {
        console.log('Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        });
        
        console.log('Camera access granted');
        cameraStream = stream;
        cameraFeed.srcObject = stream;
        
        // Wait for video to load
        cameraFeed.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            // Show camera with filter
            startScreen.style.display = 'none';
            cameraFeed.style.display = 'block';
            etherealOverlay.style.display = 'block';
            captureBtn.style.display = 'block';
            
            // Add active glow to camera window
            cameraWindow.classList.add('active');
        };
        
    } catch (err) {
        // Camera denied - show file upload
        console.error('Camera access error:', err);
        document.body.classList.remove('camera-active');
        alert('Camera access denied. Please select a photo instead.');
        fileInput.click();
    }
});

// Pai button - Instagram link
paiBtn.addEventListener('click', () => {
    window.open('https://instagram.com/kidgrandma', '_blank');
});

// File upload fallback
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadPreview.src = e.target.result;
            startScreen.style.display = 'none';
            uploadPreview.style.display = 'block';
            etherealOverlay.style.display = 'block';
            captureBtn.style.display = 'block';
            
            // Add active glow to camera window
            cameraWindow.classList.add('active');
        };
        reader.readAsDataURL(file);
    }
});

// Capture button click
captureBtn.addEventListener('click', capturePhoto);

// UPDATED CAPTURE FUNCTION WITH BRIGHTNESS FIX
function capturePhoto() {
    console.log('Capturing photo...');
    
    // Select random silver card
    const randomCard = silverCards[Math.floor(Math.random() * silverCards.length)];
    
    // Create canvas to capture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (cameraStream) {
        // Capture from video
        canvas.width = cameraFeed.videoWidth || 640;
        canvas.height = cameraFeed.videoHeight || 480;
        
        // IMPORTANT: Save context state
        ctx.save();
        
        // Mirror the canvas for selfie (not the video element)
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        
        // Draw the video frame
        ctx.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);
        
        // Restore context
        ctx.restore();
        
        // Apply a LIGHTER blue filter (reduced opacity)
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgba(100, 150, 255, 0.25)'; // Reduced from 0.4 to 0.25
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add a slight brightness boost
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Slight white overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        capturedImageData = canvas.toDataURL('image/jpeg', 0.9);
        
    } else if (uploadPreview.src) {
        // Use uploaded image
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Mirror for consistency
            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-canvas.width, 0);
            ctx.drawImage(img, 0, 0);
            ctx.restore();
            
            // Apply LIGHTER blue filter
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(100, 150, 255, 0.25)'; // Lighter blue
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add brightness boost
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            capturedImageData = canvas.toDataURL('image/jpeg', 0.9);
            
            // Continue with capture process
            finishCapture(randomCard);
        };
        img.src = uploadPreview.src;
        return; // Exit here, finishCapture will be called after image loads
    }
    
    // Continue with capture process
    finishCapture(randomCard);
}

function finishCapture(randomCard) {
    // Freeze the capture in the media player
    frozenCapture.src = capturedImageData;
    frozenCapture.style.display = 'block';
    
    // Hide live feed
    if (cameraStream) {
        cameraFeed.style.display = 'none';
        // Stop camera stream
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    } else {
        uploadPreview.style.display = 'none';
    }
    
    // Hide capture button and overlay
    captureBtn.style.display = 'none';
    etherealOverlay.style.display = 'none';
    
    // Remove active glow
    cameraWindow.classList.remove('active');
    
    // Flash effect
    createFlashEffect();
    
    // Play capture sound
    captureSound.currentTime = 0;
    captureSound.play();
    
    // Show result popup after flash
    setTimeout(() => {
        showResultPopup(capturedImageData, randomCard);
    }, 500);
}

function showResultPopup(imageData, cardImage) {
    // Set the photo
    resultPhoto.src = imageData;
    
    // Set silver card
    resultCard.src = `../assets/resident/${cardImage}`;
    
    // Set timestamp
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    });
    
    timestampDate.textContent = `${dateStr} ${timeStr}`;
    timestampHandle.textContent = userHandle;
    
    // Show popup with smooth fade-in
    resultPopup.style.display = 'flex';
    resultPopup.style.opacity = '0';
    
    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
        resultPopup.style.transition = 'opacity 0.3s ease-in';
        resultPopup.style.opacity = '1';
    });
}

// Retake button (start-over.png)
retakeBtn.addEventListener('click', () => {
    console.log('Starting over...');
    
    // Fade out result popup
    resultPopup.style.opacity = '0';
    
    setTimeout(() => {
        // Reset everything
        resultPopup.style.display = 'none';
        resultPopup.style.opacity = '1'; // Reset opacity for next time
        startScreen.style.display = 'flex';
        cameraFeed.style.display = 'none';
        uploadPreview.style.display = 'none';
        frozenCapture.style.display = 'none';
        captureBtn.style.display = 'none';
        etherealOverlay.style.display = 'none';
        
        // Clear frozen capture
        frozenCapture.src = '';
        
        // Remove camera active class
        document.body.classList.remove('camera-active');
        
        // Reset camera stream
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
        
        // Reset file input
        fileInput.value = '';
        
        // Remove active class from camera window
        cameraWindow.classList.remove('active');
    }, 300);
});

function createFlashEffect() {
    const flash = document.createElement('div');
    flash.className = 'flash-effect';
    document.body.appendChild(flash);
    
    setTimeout(() => flash.remove(), 500);
}

// Prevent scrolling on mobile when camera is active
document.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('camera-active')) {
        e.preventDefault();
    }
}, { passive: false });

// Handle page visibility changes (pause camera when hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && cameraStream) {
        cameraStream.getTracks().forEach(track => track.enabled = false);
    } else if (!document.hidden && cameraStream) {
        cameraStream.getTracks().forEach(track => track.enabled = true);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
});

// Console easter egg
console.log('%c✨ Fortune Selfie CCTV Active ✨', 'color: #64c8ff; font-size: 20px; font-weight: bold;');
console.log('%cYour silver card fortune awaits...', 'color: #a0d0ff; font-style: italic;');
console.log('Send screenshots to @kidgrandma!');

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'C' to capture when camera is active
    if (e.key === 'c' || e.key === 'C') {
        if (captureBtn.style.display === 'block') {
            captureBtn.click();
        }
    }
    
    // Press 'R' to retake
    if (e.key === 'r' || e.key === 'R') {
        if (resultPopup.style.display === 'flex') {
            retakeBtn.click();
        }
    }
    
    // Press 'ESC' to go back
    if (e.key === 'Escape') {
        if (resultPopup.style.display === 'flex') {
            retakeBtn.click();
        }
    }
});

// Go home function
function goHome() {
    // Clean up before leaving
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    
    // Stop all audio
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
        audio.pause();
        audio.src = '';
    });
    
    // Navigate to home
    window.location.href = '../index.html';
}