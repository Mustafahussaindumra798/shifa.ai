// Node.js Backend Example: Medicine Fetcher Logic with RAG
// This represents the required "Backend: Node.js with a RAG pipeline" from the Master Prompt

const express = require('express');
const cors = require('cors');
// In a real project, you would install these:
// npm install express cors @langchain/openai langchain
// const { OpenAI } = require("@langchain/openai");
// const { initializeAgentExecutorWithOptions } = require("langchain/agents");
// const { SerpAPI } = require("@langchain/community/tools/serpapi");

const app = express();
app.use(cors());
app.use(express.json());

// Mock local database
const localDatabase = {
    "augmentin": {
        salt: "Amoxicillin / Clavulanate Potassium",
        usage: "Treats bacterial infections.",
        price: 350,
        substitutes: ["Amoclav", "Klavox"]
    }
};

// Simulated AI Agent Web Search (RAG Fetcher)
async function fetchMedicineOnline(medName) {
    console.log(`[AI Agent] Activating Web Search Agent for: ${medName}`);
    console.log(`[AI Agent] Scraping salt and substitutes...`);
    
    // In reality, you would use LangChain's SerpAPI tool here:
    /*
    const model = new OpenAI({ temperature: 0 });
    const tools = [new SerpAPI(process.env.SERPAPI_API_KEY)];
    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: "zero-shot-react-description",
    });
    const result = await executor.invoke({ input: `Find active salt, usage, price in Pakistan, and substitutes for medicine ${medName}` });
    return result.output;
    */

    // Returning simulated RAG formatted data
    return {
        salt: "Paracetamol 500mg",
        usage: "Pain relief, fever reduction.",
        price_trend_6_months: [22, 22.5, 24, 25, 27, 28],
        substitutes: [
            { brand: "Calpol", price: 28 },
            { brand: "Febrol", price: 25.5 }
        ],
        verification_sources: ["Drugs.com", "WebMD"],
        urdu_translation: {
            usage: "درد اور بخار کو کم کرنے کے لیے استعمال ہوتی ہے۔"
        }
    };
}

// System Design: Step-by-Step Logic Implementation
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q?.toLowerCase();
        
        if (!query) {
            return res.status(400).json({ error: "Search query required." });
        }

        // Step 2: System checks the Local Database
        if (localDatabase[query]) {
            console.log("Found in local database.");
            return res.json({ source: "local", data: localDatabase[query] });
        }

        // Step 3 & 4: Not found? AI Search Agent activates and scrapes the live web
        console.log(`Not found locally. Triggering RAG Pipeline for '${query}'...`);
        const aiFetchedData = await fetchMedicineOnline(query);

        // Step 5: Format and save it to the database for the next user
        localDatabase[query] = aiFetchedData;
        console.log("Saved to local database for future queries.");

        // Return the beautiful data back to frontend
        return res.json({ source: "ai_web_search", data: aiFetchedData });

    } catch (error) {
        console.error("Error in AI Fetcher:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Shifa-AI Backend Engine running on port ${PORT}`);
    console.log("RAG Pipeline Ready.");
});
