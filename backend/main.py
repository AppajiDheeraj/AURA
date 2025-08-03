# main.py

import logging
import os
from dotenv import load_dotenv
from pathlib import Path

from livekit.agents import AgentSession, JobContext, WorkerOptions, cli
from livekit.plugins import deepgram, elevenlabs, openai, silero

# Import the Jarvis agent definition
from jarvis_agent import Jarvis

# Load environment variables from the .env file in the project root
# This makes sure all API keys are available as environment variables
dotenv_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=dotenv_path)

# Set up logging to see what the agent is doing
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("jarvis-main")


# This is the main entrypoint function that the LiveKit Agent Worker will run.
async def entrypoint(ctx: JobContext):
    logger.info(f"Starting Jarvis job for room: {ctx.room.name}")

    # 1. Create an instance of our Jarvis agent
    agent = Jarvis()

    # 2. Configure the AgentSession with all the required plugins.
    #    This session orchestrates the flow of data between the user and the AI services.
    session = AgentSession(
        # Voice Activity Detection: Detects when a user starts and stops speaking.
        vad=silero.VAD.load(),

        # Speech-to-Text: Transcribes user's audio into text.
        stt=deepgram.STT(
            model="nova-2",
            language="en-US"
        ),

        # Language Model: The "brain" that understands text and decides which tools to use.
        llm=openai.LLM(
            model='gpt-4o',
        ),

        # Text-to-Speech: Converts the LLM's text response back into audio.
        tts=elevenlabs.TTS(
            model='eleven_turbo_v2',
            voice_id=os.environ.get("ELEVENLABS_VOICE_ID"),
            api_key=os.environ.get("ELEVENLABS_API_KEY")
        ),
    )

    # 3. Start the session.
    #    This connects the agent to the LiveKit room and begins the conversation.
    #    The `on_enter` method in the Jarvis class will be called automatically.
    await session.start(
        agent=agent,
        room=ctx.room,
    )

    logger.info("Jarvis session started and is now active.")


# This block allows you to run the agent directly from the command line.
if __name__ == "__main__":
    # The WorkerOptions tells the CLI which function to run (our entrypoint).
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
