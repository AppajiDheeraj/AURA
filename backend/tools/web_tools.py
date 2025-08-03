# tools/web_tools.py

import os
import platform
import subprocess
import socket
import webbrowser
import requests
import speedtest

from livekit.agents.llm import function_tool
from typing import Annotated, Literal

# --- Tool Registration ---
WEB_TOOLS = []

def register_tool(func):
    WEB_TOOLS.append(func)
    return func

# --- Tool Definitions ---

@register_tool
@function_tool
async def open_website(site_name: Annotated[str, "The common name of the website to open (e.g., 'google', 'youtube')."]):
    """Opens a known website in a new browser tab."""
    websites = {
        "google": "https://www.google.com", "gmail": "https://mail.google.com",
        "perplexity": "https://www.perplexity.ai", "linkedin": "https://www.linkedin.com",
        "github": "https://www.github.com", "youtube": "https://www.youtube.com",
        "canva": "https://www.canva.com", "stackoverflow": "https://stackoverflow.com",
        "reddit": "https://www.reddit.com", "twitter": "https://www.twitter.com",
        "facebook": "https://www.facebook.com", "instagram": "https://www.instagram.com",
        "wikipedia": "https://www.wikipedia.org", "amazon": "https://www.amazon.com",
        "netflix": "https://www.netflix.com", "spotify": "https://www.spotify.com",
        "discord": "https://www.discord.com", "chatgpt": "https://chatgpt.com",
        "deepseek": "https://chat.deepseek.com", "manus": "https://manus.im/app",
        "genspark": "https://www.genspark.ai", "figma": "https://www.figma.com",
        "dribble": "https://www.dribbble.com", "pintrest": "https://www.pinterest.com",
        "notion": "https://www.notion.so", "claude": "https://claude.ai",
        "napkin": "https://www.napkin.ai", "leetcode": "https://leetcode.com/problemset/"
    }
    url = websites.get(site_name.lower(  ))
    if not url:
        return f"Error: Website '{site_name}' is not recognized."
    try:
        webbrowser.open_new_tab(url)
        return f"Success: Opened {site_name} in a new tab."
    except Exception as e:
        return f"Error: Could not open '{site_name}': {e}"

@register_tool
@function_tool
async def get_internet_speed() -> str:
    """Performs an internet speed test to check download, upload, and ping."""
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        st.download()
        st.upload()
        res = st.results.dict()
        ping = res['ping']
        download = res['download'] / 1_000_000
        upload = res['upload'] / 1_000_000
        return f"Success: Ping: {ping:.2f} ms, Download: {download:.2f} Mbps, Upload: {upload:.2f} Mbps"
    except Exception as e:
        return f"Error: Could not perform speed test. Details: {e}"

@register_tool
@function_tool
async def get_ip_address() -> str:
    """Fetches the local and public IP addresses of the machine."""
    try:
        local_ip = socket.gethostbyname(socket.gethostname())
        public_ip = requests.get('https://api.ipify.org'  ).text
        return f"Local IP is {local_ip}, Public IP is {public_ip}."
    except Exception as e:
        return f"Error: Could not fetch IP addresses. Check internet connection. Details: {e}"

@register_tool
@function_tool
async def manage_wifi(state: Annotated[Literal['on', 'off'], "Whether to turn the Wi-Fi on or off."]) -> str:
    """Turns the computer's Wi-Fi adapter on or off."""
    action = "enable" if state == "on" else "disable"
    try:
        os.system(f'netsh interface set interface "Wi-Fi" {action}')
        return f"Wi-Fi has been turned {state}."
    except Exception as e:
        return f"Error managing Wi-Fi: {e}"
