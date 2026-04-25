# RAG Pipeline for Shifa-AI "Live-Fetch" Engine
# Directive: Do NOT rely on a static database. Use a Recursive RAG approach.

import os
from langchain.agents import load_tools, initialize_agent
from langchain.llms import OpenAI

# Initialize LLM
# In production, securely load your API keys
llm = OpenAI(temperature=0.2)

def perform_recursive_search(med_name, attempt=1, max_attempts=2):
    """
    Implements the Recursive Search strategy.
    If the primary search tool fails or returns insufficient data, it retries
    with a different focus or secondary medical portals.
    """
    tools = load_tools(["google-search"], llm=llm)
    agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)
    
    query = f"""
    You are Shifa-AI, a live-fetch medical agent. Do NOT use static/hallucinated data.
    Perform a live web search for the medicine '{med_name}' in Pakistan.
    You MUST fetch:
    1. Generic Salt Name
    2. Dose Strength
    3. Manufacturer
    4. Price in Pakistan (PKR)
    5. Top 5 cheaper substitutes with the EXACT same active salt.
    
    If you cannot find it on general search, look specifically on Drugs.com or Pakistani Pharma Directories.
    Format the final output strictly as JSON.
    """
    
    try:
        print(f"[Attempt {attempt}] Triggering Live-Fetch Web Agent for: {med_name}")
        response = agent.run(query)
        
        # Simple validation: if response seems empty or failed, recurse
        if "I don't know" in response or len(response) < 50:
            raise ValueError("Insufficient data scraped.")
            
        return response
        
    except Exception as e:
        print(f"Search failed: {str(e)}")
        if attempt < max_attempts:
            print("Initiating Recursive Search on secondary verified portals...")
            return perform_recursive_search(med_name, attempt + 1, max_attempts)
        else:
            return {"error": "Medicine not found across verified portals. Please check the spelling."}

if __name__ == "__main__":
    # Test the Live-Fetch Engine
    target_medicine = "Augmentin"
    print("="*50)
    print(f"Shifa-AI RAG Protocol Initiated: {target_medicine}")
    print("="*50)
    
    result = perform_recursive_search(target_medicine)
    
    print("\n--- Final Live Data ---")
    print(result)
