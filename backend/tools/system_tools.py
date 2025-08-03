# tools/system_tools.py

import os
import platform
import subprocess
import json
import time
import socket
from datetime import datetime

import psutil
import pyautogui
import winshell
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from comtypes import CLSCTX_ALL
from ctypes import cast, POINTER
import screen_brightness_control as sbc

from livekit.agents.llm import function_tool
from typing import Annotated, Literal

# --- Tool Registration ---
# We will collect all tools in a list to easily import them in the main agent file.
SYSTEM_TOOLS = []

def register_tool(func):
    SYSTEM_TOOLS.append(func)
    return func

# --- Tool Definitions ---

@register_tool
@function_tool
async def launch_application(app_name: Annotated[str, "The common name of the application to launch (e.g., 'notepad', 'chrome')."]):
    """Launches a desktop application by its common name."""
    applications = {
        "calculator": "calc", "notepad": "notepad", "vscode": "code", "files": "explorer",
        "terminal": "cmd", "chrome": "chrome", "firefox": "firefox", "word": "winword",
        "powerpoint": "powerpnt", "excel": "excel", "onenote": "onenote", "settings": "ms-settings:",
        "whatsapp": "whatsapp:", "phonelink": "ms-phonelink:", "photos": "ms-photos:",
        "telegram": "telegram", "photoshop": "Photoshop.exe", "premiere pro": "Premiere Pro.exe",
        "after effects": "AfterFX.exe", "bluestacks": "HD-Player.exe",
    }
    command = applications.get(app_name.lower())
    if not command:
        return f"Error: Application '{app_name}' is not recognized."
    try:
        os.system(f"start {command}")
        return f"Success: Launched {app_name}."
    except Exception as e:
        return f"Error: Could not launch '{app_name}': {e}"

@register_tool
@function_tool
async def get_system_status() -> str:
    """Checks and reports current CPU and RAM usage."""
    try:
        cpu_usage = psutil.cpu_percent(interval=1)
        ram_usage = psutil.virtual_memory().percent
        return f"System Status - CPU: {cpu_usage}%, RAM: {ram_usage}%."
    except Exception as e:
        return f"Error getting system status: {e}"

@register_tool
@function_tool
async def get_date_and_time() -> str:
    """Gets the current date and time."""
    now = datetime.now()
    return f"It is {now.strftime('%I:%M %p on %A, %B %d, %Y')}."

@register_tool
@function_tool
async def lock_computer() -> str:
    """Locks the computer workstation."""
    try:
        os.system("rundll32.exe user32.dll,LockWorkStation")
        return "Computer is now locked."
    except Exception as e:
        return f"Error locking computer: {e}"

@register_tool
@function_tool
async def empty_recycle_bin() -> str:
    """Empties the Recycle Bin."""
    try:
        if not list(winshell.recycle_bin()):
            return "Recycle Bin is already empty."
        winshell.recycle_bin().empty(confirm=False, show_progress=False, sound=False)
        return "Recycle Bin has been emptied."
    except Exception as e:
        return f"Error emptying Recycle Bin: {e}"

@register_tool
@function_tool
async def get_battery_status() -> str:
    """Gets the current battery percentage and charging status."""
    try:
        battery = psutil.sensors_battery()
        if not battery:
            return "Info: No battery detected."
        status = 'Plugged in' if battery.power_plugged else 'Not plugged in'
        return f"Battery is at {int(battery.percent)}%. Status: {status}."
    except Exception as e:
        return f"Error getting battery status: {e}"

@register_tool
@function_tool
async def system_power_control(action: Annotated[Literal['shutdown', 'restart', 'sleep'], "The power action to perform."]):
    """Shuts down, restarts, or puts the computer to sleep. This is a final action."""
    commands = {
        "shutdown": "shutdown /s /t 1",
        "restart": "shutdown /r /t 1",
        "sleep": "rundll32.exe powrprof.dll,SetSuspendState 0,1,0"
    }
    command_to_run = commands.get(action.lower())
    if command_to_run:
        try:
            os.system(command_to_run)
            return f"Executing {action} now."
        except Exception as e:
            return f"Error executing power command '{action}': {e}"
    return f"Error: Invalid power action '{action}'."

@register_tool
@function_tool
async def run_macro(macro_name: Annotated[str, "The name of the macro to execute from macros.json."]) -> str:
    """Executes a pre-defined sequence of actions (a macro) from the macros.json file."""
    # Note: For this to work, the agent needs access to its own tools.
    # This is an advanced use case. For now, we'll just return a placeholder.
    # A full implementation would require the agent to call its own tools.
    return f"Executing macro '{macro_name}'. This feature is in development."
