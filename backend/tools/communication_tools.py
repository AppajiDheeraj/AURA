# tools/communication_tools.py

import os
import json
import pywhatkit
import smtplib
from email.mime.text import MIMEText

# Imports for reading email with Google API
import base64
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from livekit.agents.llm import function_tool
from typing import Annotated

# --- Tool Registration ---
COMMUNICATION_TOOLS = []

def register_tool(func):
    COMMUNICATION_TOOLS.append(func)
    return func

# --- Helper Function to Load Contacts ---
def _load_contacts():
    """Loads the contacts from contacts.json."""
    try:
        with open('contacts.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {} # Return empty dict if file doesn't exist

# --- Google API Setup for Email ---
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']

def get_gmail_service( ):
    """Authenticates with Google and returns a Gmail service object."""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
            
    return build('gmail', 'v1', credentials=creds)

# --- Tool Definitions ---

@register_tool
@function_tool
async def send_whatsapp_message(
    recipient: Annotated[str, "The name (e.g., 'mom') or phone number of the person to message."],
    message: Annotated[str, "The message to send."]) -> str:
    """Sends a WhatsApp message to a contact name or a phone number."""
    contacts = _load_contacts()
    recipient_lower = recipient.lower()
    phone_no = None

    # Check if the recipient is a known contact name
    if recipient_lower in contacts:
        phone_no = contacts[recipient_lower]
    # Check if the recipient is a phone number
    elif recipient.startswith('+') and recipient[1:].isdigit():
        phone_no = recipient
    else:
        return f"Error: I don't know the phone number for '{recipient}'. You can add them as a contact first."

    try:
        # The library requires a time to send, so we'll set it to send in 15 seconds.
        pywhatkit.sendwhatmsg_instantly(phone_no, message, wait_time=15)
        return f"Your WhatsApp message is being sent to {recipient}."
    except Exception as e:
        return f"Sorry, I couldn't send the WhatsApp message. Error: {e}"

@register_tool
@function_tool
async def add_contact(
    name: Annotated[str, "The name of the contact (e.g., 'John Doe')."],
    phone_no: Annotated[str, "The contact's phone number, including the country code."]) -> str:
    """Adds a new contact to the contact book."""
    if not (phone_no.startswith('+') and phone_no[1:].isdigit()):
        return "Error: Please provide a valid phone number including the country code, like '+1234567890'."

    contacts = _load_contacts()
    contact_name = name.lower()
    
    if contact_name in contacts:
        return f"A contact named '{name}' already exists."

    contacts[contact_name] = phone_no
    
    with open('contacts.json', 'w') as f:
        json.dump(contacts, f, indent=2)
        
    return f"Success: I've added {name} to your contacts."


@register_tool
@function_tool
async def send_email(to: Annotated[str, "The recipient's email address."],
                     subject: Annotated[str, "The subject of the email."],
                     body: Annotated[str, "The main content/body of the email."]) -> str:
    """Sends an email to a specified recipient."""
    try:
        service = get_gmail_service()
        message = MIMEText(body)
        message['to'] = to
        message['subject'] = subject
        
        create_message = {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}
        sent_message = service.users().messages().send(userId="me", body=create_message).execute()
        
        return f"Email sent successfully to {to} with subject '{subject}'."
    except Exception as e:
        return f"An error occurred while sending the email: {e}"

@register_tool
@function_tool
async def read_emails(max_results: Annotated[int, "The maximum number of recent emails to read."] = 5) -> str:
    """Reads the subject lines of the most recent emails in the inbox."""
    try:
        service = get_gmail_service()
        results = service.users().messages().list(userId='me', labelIds=['INBOX'], maxResults=max_results).execute()
        messages = results.get('messages', [])

        if not messages:
            return "Your inbox is empty."

        email_summaries = []
        for msg in messages:
            txt = service.users().messages().get(userId='me', id=msg['id']).execute()
            payload = txt['payload']
            headers = payload['headers']
            
            subject = next(d['value'] for d in headers if d['name'] == 'Subject')
            sender = next(d['value'] for d in headers if d['name'] == 'From')
            
            email_summaries.append(f"From: {sender}\nSubject: {subject}\n")

        return "Here are your latest emails:\n\n" + "\n".join(email_summaries)
    except Exception as e:
        return f"An error occurred while reading emails: {e}"
