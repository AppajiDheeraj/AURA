# tools/information_tools.py

import os
import requests
import pyjokes
import yfinance as yf
from googlesearch import search
import webbrowser

from livekit.agents.llm import function_tool
from typing import Annotated

# --- Tool Registration ---
INFORMATION_TOOLS = []

def register_tool(func):
    INFORMATION_TOOLS.append(func)
    return func

# --- Tool Definitions ---

@register_tool
@function_tool
async def get_weather(city: Annotated[str, "The city for which to get the weather, e.g., 'San Francisco'."]) -> str:
    """Fetches the current weather for a specified city."""
    api_key = os.environ.get("WEATHER_API_KEY")
    if not api_key:
        return "Error: Weather API key is not configured in the .env file."
    
    base_url = "http://api.openweathermap.org/data/2.5/weather"
    params = {"q": city, "appid": api_key, "units": "metric"}
    
    try:
        response = requests.get(base_url, params=params )
        response.raise_for_status()
        data = response.json()
        
        weather_desc = data['weather'][0]['description']
        temp = data['main']['temp']
        feels_like = data['main']['feels_like']
        humidity = data['main']['humidity']
        
        return (f"The weather in {city} is currently {weather_desc}. "
                f"The temperature is {temp}°C, but it feels like {feels_like}°C. "
                f"The humidity is {humidity}%.")
    except requests.exceptions.RequestException as e:
        return f"Error fetching weather data: {e}"

@register_tool
@function_tool
async def get_news_headlines(topic: Annotated[str, "The topic for the news headlines, e.g., 'technology'."] = "general") -> str:
    """Fetches the top 5 news headlines for a given topic."""
    api_key = os.environ.get("NEWS_API_KEY")
    if not api_key:
        return "Error: News API key is not configured in the .env file."
        
    base_url = "https://newsapi.org/v2/top-headlines"
    params = {"category": topic, "language": "en", "pageSize": 5, "apiKey": api_key}
    
    try:
        response = requests.get(base_url, params=params )
        response.raise_for_status()
        articles = response.json().get("articles", [])
        
        if not articles:
            return f"I couldn't find any top headlines for {topic}."
            
        headlines = [f"{i+1}. {article['title']}" for i, article in enumerate(articles)]
        return f"Here are the top headlines for {topic}: \n" + "\n".join(headlines)
    except requests.exceptions.RequestException as e:
        return f"Error fetching news: {e}"

@register_tool
@function_tool
async def get_joke() -> str:
    """Tells a random programming joke."""
    return pyjokes.get_joke()

@register_tool
@function_tool
async def get_stock_price(symbol: Annotated[str, "The stock ticker symbol, e.g., 'AAPL' for Apple."]) -> str:
    """Fetches the current price of a stock using its ticker symbol."""
    try:
        stock = yf.Ticker(symbol)
        price = stock.history(period="1d")['Close'].iloc[-1]
        return f"The current price of {symbol} is ${price:.2f}."
    except Exception as e:
        return f"Error fetching stock price for {symbol}: {e}"

@register_tool
@function_tool
async def search_google(query: Annotated[str, "The topic or question to search on Google."]) -> str:
    """Performs a Google search and opens the top result."""
    try:
        # We get the first result from the search generator
        top_result_url = next(search(query, num=1, stop=1, pause=2))
        webbrowser.open_new_tab(top_result_url)
        return f"I have opened the top search result for '{query}' in your browser."
    except Exception as e:
        return f"Sorry, I couldn't perform the search. Error: {e}"
