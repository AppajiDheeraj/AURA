# jarvis_agent.py

from livekit.agents import Agent

# Import the tool lists from your tool files
from tools.system_tools import SYSTEM_TOOLS
from tools.media_tools import MEDIA_TOOLS
from tools.web_tools import WEB_TOOLS
from tools.information_tools import INFORMATION_TOOLS  # <-- IMPORT NEW
from tools.communication_tools import COMMUNICATION_TOOLS # <-- IMPORT NEW

class Jarvis(Agent):
    """
    Jarvis is a helpful AI assistant that can control the user's computer
    and interact with various web services.
    """
    def __init__(self):
        super().__init__(
            # Instructions for the LLM
            instructions=(
                "You are Jarvis, a helpful and efficient AI assistant. "
                "You can control the user's computer, send messages, find information, and more. "
                "When asked to perform multiple tasks, execute them sequentially. "
                "Always confirm what you have done in a concise and clear manner. "
                "If a task fails, state the error clearly. "
                "If you are asked a general knowledge question (e.g., 'what is caching?'), "
                "do not use a tool, but answer it from your own knowledge concisely."
            ),
            
            # Register all your tools by combining the lists
            tools=[
                *SYSTEM_TOOLS,
                *MEDIA_TOOLS,
                *WEB_TOOLS,
                *INFORMATION_TOOLS,      # <-- ADD NEW
                *COMMUNICATION_TOOLS,    # <-- ADD NEW
            ],
        )

    async def on_enter(self):
        """
        This function is called when the agent first joins the session.
        It speaks the initial greeting.
        """
        await self.say("Jarvis is online. How can I assist you?")
