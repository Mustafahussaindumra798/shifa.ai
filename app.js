// Initialize Icons
lucide.createIcons();

// Elements
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const loadingState = document.getElementById('loading-state');
const resultContent = document.getElementById('result-content');
const heroSection = document.getElementById('hero-section');
const agentLogs = document.getElementById('agent-logs');
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

// Search Logic (Simulating RAG Pipeline)
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // UI Updates for Search
    heroSection.classList.add('scale-95', 'opacity-80');
    setTimeout(() => {
        heroSection.classList.remove('mt-10', 'md:mt-16');
        heroSection.classList.add('mt-4', 'mb-2');
        heroSection.querySelector('h1').classList.replace('text-5xl', 'text-3xl');
        heroSection.querySelector('h1').classList.replace('md:text-6xl', 'md:text-4xl');
        heroSection.querySelector('h1').classList.replace('lg:text-7xl', 'lg:text-4xl');
        heroSection.querySelector('p').classList.add('hidden');
    }, 300);

    // Show Results Area & Loading
    resultsContainer.classList.remove('hidden');
    resultsContainer.classList.replace('opacity-0', 'opacity-100');
    resultContent.classList.add('hidden');
    loadingState.classList.remove('hidden');

    // Simulate RAG Process Logging
    const logs = [
        "> Local DB check: Not Found for '" + query + "'",
        "> Initializing AI Search Agent...",
        "> Querying web sources (Drugs.com, WebMD)...",
        "> Fetching active ingredients (Salt)...",
        "> Cross-referencing substitute brands in Pakistan...",
        "> Extracting price data from e-pharmacies...",
        "> Analyzing drug interactions...",
        "> RAG Verification complete. Rendering UI."
    ];

    let logIndex = 0;
    agentLogs.innerHTML = '';
    
    const logInterval = setInterval(() => {
        if (logIndex < logs.length) {
            const div = document.createElement('div');
            div.className = 'text-green-400 font-medium animate-fade-in mb-1';
            div.innerText = logs[logIndex];
            agentLogs.appendChild(div);
            agentLogs.scrollTop = agentLogs.scrollHeight;
            
            // Update the main loading text
            document.getElementById('loading-text').innerText = logs[logIndex].replace('> ', '');
            
            logIndex++;
        } else {
            clearInterval(logInterval);
            // Hide loading, show results
            setTimeout(() => {
                loadingState.classList.add('hidden');
                resultContent.classList.remove('hidden');
                
                // Update Name
                document.getElementById('med-name').innerText = query.charAt(0).toUpperCase() + query.slice(1);
                
                // Init Chart if not already initialized
                initPriceChart();
            }, 600);
        }
    }, 400); // 400ms per log line
});

// Allow Enter key to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

// Language Toggle Logic
let isUrdu = false;
langToggle.addEventListener('click', () => {
    isUrdu = !isUrdu;
    langText.innerText = isUrdu ? 'UR' : 'EN';
    
    // Toggle English/Urdu content
    urduTexts.forEach(el => {
        if (isUrdu) {
            el.classList.remove('hidden');
            el.previousElementSibling.classList.add('hidden'); // Hide English
        } else {
            el.classList.add('hidden');
            el.previousElementSibling.classList.remove('hidden'); // Show English
        }
    });
});

// Audio Simulation
window.playUrduAudio = function() {
    // In a real app, this would use Web Speech API or play a generated TTS audio file
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> Speaking...';
    lucide.createIcons();
    
    setTimeout(() => {
        btn.innerHTML = '<i data-lucide="volume-x" class="w-5 h-5"></i> Stop';
        lucide.createIcons();
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            lucide.createIcons();
        }, 3000);
    }, 1000);
}

// Chatbot Logic
function toggleChat() {
    if (chatWindow.classList.contains('hidden')) {
        chatWindow.classList.remove('hidden');
        setTimeout(() => {
            chatWindow.classList.remove('scale-95', 'opacity-0');
            chatWindow.classList.add('scale-100', 'opacity-100');
        }, 10);
        // Hide badge
        chatToggle.querySelector('span').classList.add('hidden');
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
    
    // User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'flex items-end justify-end gap-2 mb-2 animate-fade-in';
    userMsg.innerHTML = `
        <div class="bg-clinical-500 text-white p-3 rounded-2xl rounded-br-none shadow-sm text-sm max-w-[80%]">
            ${text}
        </div>
    `;
    chatMessages.appendChild(userMsg);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // AI Typing indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'flex items-end gap-2 mb-2 text-gray-400';
    typingMsg.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-clinical-100 flex items-center justify-center flex-shrink-0">
            <i data-lucide="bot" class="w-4 h-4 text-clinical-600"></i>
        </div>
        <div class="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none flex gap-1">
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
    `;
    chatMessages.appendChild(typingMsg);
    lucide.createIcons();
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI Response
    setTimeout(() => {
        typingMsg.remove();
        const aiMsg = document.createElement('div');
        aiMsg.className = 'flex items-end gap-2 mb-2 animate-fade-in';
        aiMsg.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-clinical-100 flex items-center justify-center flex-shrink-0">
                <i data-lucide="bot" class="w-4 h-4 text-clinical-600"></i>
            </div>
            <div class="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm text-sm text-gray-700 max-w-[80%]">
                I can help you understand the side effects or check if it's safe. Since I'm using RAG, I just verified the latest guidelines. What specific symptom are you experiencing?
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

// Chart.js Setup for Price Trend
let chartInstance = null;
function initPriceChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx || chartInstance) return;

    // Example Data: Last 6 months trend
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const prices = [22, 22.5, 24, 25, 27, 28]; // Fake inflation data

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Price (PKR)',
                data: prices,
                borderColor: '#14b8a6', // clinical-500
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#0d9488',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4 // Smooth curves
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleFont: { family: 'Inter', size: 13 },
                    bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' }
                },
                y: {
                    grid: { color: '#f1f5f9', drawBorder: false },
                    ticks: { 
                        font: { family: 'Inter', size: 11 }, 
                        color: '#94a3b8',
                        callback: function(value) { return 'Rs ' + value; }
                    },
                    beginAtZero: false,
                    suggestedMin: 20
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    });
}
