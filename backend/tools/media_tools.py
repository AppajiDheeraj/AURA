# tools/media_tools.py

import pyautogui
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from comtypes import CLSCTX_ALL
from ctypes import cast, POINTER
import screen_brightness_control as sbc

from livekit.agents.llm import function_tool
from typing import Annotated, Literal

# --- Tool Registration ---
MEDIA_TOOLS = []

def register_tool(func):
    MEDIA_TOOLS.append(func)
    return func

# --- Tool Definitions ---

@register_tool
@function_tool
async def take_screenshot(filename: Annotated[str, "The filename for the screenshot, e.g., 'capture.png'."] = "screenshot.png") -> str:
    """Takes a screenshot of the entire screen and saves it to a file."""
    try:
        pyautogui.screenshot().save(filename)
        return f"Success: Screenshot saved as {filename}"
    except Exception as e:
        return f"Error: Failed to take screenshot: {e}"

@register_tool
@function_tool
async def set_volume(value: Annotated[int, "The desired volume level, from 0 to 100."]) -> str:
    """Sets the system volume to a specific percentage."""
    if not 0 <= value <= 100:
        return "Error: Volume must be between 0 and 100."
    try:
        devices = AudioUtilities.GetSpeakers()
        interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
        volume = cast(interface, POINTER(IAudioEndpointVolume))
        volume.SetMasterVolumeLevelScalar(value / 100.0, None)
        return f"Volume set to {value}%."
    except Exception as e:
        return f"Error setting volume: {e}"

@register_tool
@function_tool
async def mute_volume(state: Annotated[Literal['mute', 'unmute'], "Whether to mute or unmute the volume."]) -> str:
    """Mutes or unmutes the system volume."""
    try:
        devices = AudioUtilities.GetSpeakers()
        interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
        volume = cast(interface, POINTER(IAudioEndpointVolume))
        
        if state == "mute":
            volume.SetMute(1, None)
            return "Volume has been muted."
        elif state == "unmute":
            volume.SetMute(0, None)
            return "Volume has been unmuted."
    except Exception as e:
        return f"Error changing mute state: {e}"

@register_tool
@function_tool
async def set_brightness(value: Annotated[int, "The desired brightness level, from 0 to 100."]) -> str:
    """Sets the screen brightness to a specific percentage."""
    if not 0 <= value <= 100:
        return "Error: Brightness must be between 0 and 100."
    try:
        sbc.set_brightness(value)
        return f"Brightness set to {sbc.get_brightness()[0]}%."
    except Exception as e:
        return f"Error setting brightness: {e}"

@register_tool
@function_tool
async def open_desktop() -> str:
    """Minimizes all windows to show the desktop."""
    try:
        pyautogui.hotkey('win', 'd')
        return "Showing the desktop."
    except Exception as e:
        return f"Error showing desktop: {e}"
