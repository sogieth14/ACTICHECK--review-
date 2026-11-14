# ActiCheck doctor review page: setup

## 1. Put it on GitHub
Extract this zip into the root of your ACTICHECK- repo, so the `review` folder sits next to your existing `index.html`. Commit and push.
The page will be live at:
https://sogieth14.github.io/ACTICHECK-/review/

## 2. Add your contact details
Open `review/index.html` and find this line near the top of the script:

    var CONTACT={email:"",phone:"",x:"",ig:"",wa:""};

Fill in what you want shown on the thank-you screen. Anything left empty is hidden.
Examples: email:"you@example.com", x:"@yourhandle", wa:"+234XXXXXXXXXX"

## 3. Connect Telegram so answers reach you
1. In Telegram, make sure your bot exists (BotFather) and add it to the chat or group that should get the answers. Get the chat ID.
2. In Cloudflare, go to Workers and create a new Worker. Paste in `telegram-worker.js` from this folder.
3. In the Worker's Settings, add variables:
   - BOT_TOKEN (add as a Secret): your bot token
   - CHAT_ID: your chat or group ID
   - ALLOW_ORIGIN: https://sogieth14.github.io
4. Copy the Worker's address and paste it into this line in `review/index.html`:

       var SUBMIT_URL="";

Until SUBMIT_URL is set, the send button only shows the thank-you screen and nothing reaches you. Do not share the page with doctors before this is done.

## 4. Test it
Open the live page, fill in a few answers, press Send, and check that the message arrives in Telegram. Then share the link.

Never put the bot token inside `index.html`. It only belongs in the Worker settings.
