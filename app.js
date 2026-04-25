// Initialize Icons
lucide.createIcons();

// Elements
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const skeletonState = document.getElementById('skeleton-state');
const resultContent = document.getElementById('result-content');
const heroSection = document.getElementById('hero-section');
const langToggle = document.getElementById('lang-toggle');
const langText = document.getElementById('lang-text');
const urduTexts = document.querySelectorAll('.urdu-text');

// Chat Elements
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatMessages = document.getElementById('chat-messages');

// Search Logic (Simulating Real-Time RAG with Skeletons)
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // UI Transformation for Search State
    heroSection.classList.add('scale-95', 'opacity-80');
    setTimeout(() => {
        heroSection.classList.remove('mt-12', 'md:mt-20');
        heroSection.classList.add('mt-4', 'mb-2');
        heroSection.querySelector('h1').classList.replace('text-5xl', 'text-4xl');
        heroSection.querySelector('h1').classList.replace('md:text-6xl', 'md:text-4xl');
        heroSection.querySelector('h1').classList.replace('lg:text-7xl', 'lg:text-4xl');
        heroSection.querySelector('p').classList.add('hidden');
    }, 300);

    // Show Results Area & Skeletons
    resultsContainer.classList.remove('hidden');
    resultsContainer.classList.replace('opacity-0', 'opacity-100');
    resultContent.classList.add('hidden');
    skeletonState.classList.remove('hidden');

    // Simulate Network Request / RAG Recursive Search Pipeline
    // This is where the frontend waits for the Web-Search Agent (SerpApi etc.)
    setTimeout(() => {
        // Hide skeletons, show real data
        skeletonState.classList.add('hidden');
        resultContent.classList.remove('hidden');
        
        // Update Name dynamically
        const capitalizedName = query.charAt(0).toUpperCase() + query.slice(1);
        document.getElementById('med-name').innerText = capitalizedName;
        
        // If searched "Panadol", change the mock data slightly to fit context
        if(query.toLowerCase() === 'panadol') {
            document.getElementById('med-salt').innerText = 'Paracetamol';
            document.getElementById('med-dose').innerText = '500mg';
            document.getElementById('med-price').innerText = '30';
        }
        
    }, 2500); // 2.5s simulated load time for skeletons
});

// Allow Enter key to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

// Language Toggle Logic (URDU/ENG)
let isUrdu = false;
langToggle.addEventListener('click', () => {
    isUrdu = !isUrdu;
    langText.innerText = isUrdu ? 'URDU' : 'ENG';
    
    // Toggle English/Urdu content
    urduTexts.forEach(el => {
        if (isUrdu) {
            el.classList.remove('hidden');
            el.previousElementSibling.classList.add('hidden'); // Hide English paragraph
        } else {
            el.classList.add('hidden');
            el.previousElementSibling.classList.remove('hidden'); // Show English paragraph
        }
    });
});

// TTS Voice Feedback (Suniye)
window.playUrduAudio = function(btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i> Playing...';
    lucide.createIcons();
    
    // Simulated Text-to-Speech audio
    setTimeout(() => {
        btn.innerHTML = '<i data-lucide="volume-x" class="w-3 h-3"></i> Stop';
        lucide.createIcons();
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            lucide.createIcons();
        }, 3000);
    }, 1000);
}

// FAB Bot Logic
function toggleChat() {
    if (chatWindow.classList.contains('hidden')) {
        chatWindow.classList.remove('hidden');
        setTimeout(() => {
            chatWindow.classList.remove('scale-95', 'opacity-0');
            chatWindow.classList.add('scale-100', 'opacity-100');
        }, 10);
        // Hide notification badge
        const badge = chatToggle.querySelector('span');
        if(badge) badge.classList.add('hidden');
    } else {
        chatWindow.classList.remove('scale-100', 'opacity-100');
        chatWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            chatWindow.classList.add('hidden');
        }, 300);
    }
}

chatToggle.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);

// Chat Message Handler
function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    // User Message UI
    const userMsg = document.createElement('div');
    userMsg.className = 'flex items-end justify-end gap-2 mb-2 animate-fade-in';
    userMsg.innerHTML = `
        <div class="bg-gray-900 text-white p-3 rounded-2xl rounded-br-none shadow-sm text-sm max-w-[85%] font-medium">
            ${text}
        </div>
    `;
    chatMessages.appendChild(userMsg);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // AI Typing indicator UI
    const typingMsg = document.createElement('div');
    typingMsg.className = 'flex items-end gap-2 mb-2 text-gray-400';
    typingMsg.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-clinical-100 flex items-center justify-center flex-shrink-0">
            <i data-lucide="bot" class="w-4 h-4 text-clinical-600"></i>
        </div>
        <div class="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none flex gap-1 shadow-sm">
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
    `;
    chatMessages.appendChild(typingMsg);
    lucide.createIcons();
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI Response (Context Aware)
    setTimeout(() => {
        typingMsg.remove();
        const aiMsg = document.createElement('div');
        aiMsg.className = 'flex items-end gap-2 mb-2 animate-fade-in';
        aiMsg.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-clinical-100 flex items-center justify-center flex-shrink-0">
                <i data-lucide="bot" class="w-4 h-4 text-clinical-600"></i>
            </div>
            <div class="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm text-sm text-gray-700 max-w-[85%] leading-relaxed font-medium">
                I can see you are looking at ${document.getElementById('med-name').innerText || 'medicines'}. I've performed a deep search across verified portals to bring you the top 5 cheapest alternatives. Do you want me to read the instructions aloud in Urdu?
            </div>
        `;
        chatMessages.appendChild(aiMsg);
        lucide.createIcons();
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
}

sendChat.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});
