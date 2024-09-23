import sys
import subprocess
from telegram import Bot
from telegram.ext import CommandHandler, Updater, CallbackContext
from env import allowed_chat_ids
import os
from dotenv import load_dotenv
load_dotenv()  # take environment variables from .env.

bot_token = os.environ.get("BOT_TOKEN", None)

HEARTBEAT_INTERVAL=3600
DEFAULT_STATUS_INTERVAL=600
#STATUS_INTERVAL=DEFAULT_STATUS_INTERVAL


def send_to_telegram(content, chat_id):
    bot = Bot(token=bot_token)
    print("SENDING:", content)
    bot.send_message(chat_id=chat_id, text=content, 
                     parse_mode='MarkdownV2')

def send_heartbeat(context):
    chat_ids = context.job.context
    message = "🤖🤖🤖🤖🤖🤖🤖🤖"
    for chat_id in chat_ids:
        send_to_telegram(message, chat_id)

def send_info_to_telegram(context):
    chat_ids = context.job.context
    
    getSummaryScript = "./getSummary.sh"
    output = subprocess.check_output([getSummaryScript,"logs"]).decode('utf-8')
    lastLine = output.split("\n")[1]
    lastLine = lastLine.strip().split(" ")
    runningNodes = lastLine[1]
    totalNodes = lastLine[3]
    if runningNodes != totalNodes:
        warningIcons= "⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️️⚠️⚠️⚠️"
        message = f"{warningIcons}\n*Warning*: Some nodes are not running\. {runningNodes}/{totalNodes}\n{warningIcons}"
        for chat_id in chat_ids:
            send_to_telegram(message, chat_id)
        #STATUS_INTERVAL=1
    else:
        #STATUS_INTERVAL=DEFAULT_STATUS_INTERVAL
        pass

def start(update, context):
    update.message.reply_text('Send /get_output to get the current output.')

def get_status(update, context):
    chat_id = str(update.effective_chat.id)    
    if chat_id in allowed_chat_ids:
        getSummaryScript = "./getStatus.sh"
        output = subprocess.check_output([getSummaryScript,"logs"]).decode('utf-8').replace('-','\-').replace('.','\.').replace('(','\(').replace(')','\)')
        print("STATUS",output)
        context.bot.send_message(chat_id=chat_id, text=output,
                     parse_mode='MarkdownV2')
    else:
        update.message.reply_text('You are not authorized to use this Bot/Command.')



def get_summary(update, context):
    chat_id = str(update.effective_chat.id)    
    if chat_id in allowed_chat_ids:
        getSummaryScript = "./getSummary.sh"
        output = subprocess.check_output([getSummaryScript,"logs"]).decode('utf-8')
        context.bot.send_message(chat_id=chat_id, text=output)
    else:
        update.message.reply_text('You are not authorized to use this Bot/Command.')

if __name__ == "__main__":
    session_name = "xai_session" if len(sys.argv) < 2 else sys.argv[1]
    print(f"Starting Myria Nodes Bot: {bot_token}")
    bot = Bot(token=bot_token)
    updater = Updater(token=bot_token, use_context=True)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("get_status", get_status))
    dp.add_handler(CommandHandler("get_summary", get_summary))
    updater.job_queue.run_repeating(send_info_to_telegram, interval=DEFAULT_STATUS_INTERVAL, first=0, context=allowed_chat_ids)
    updater.job_queue.run_repeating(send_heartbeat, interval=HEARTBEAT_INTERVAL, first=0, context=allowed_chat_ids)
    updater.start_polling()
    updater.idle()
