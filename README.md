![Build Status](https://github.com/william5553/triv/workflows/lint/badge.svg?branch=discord.js-latest)
# Installation instructions for Windows
1. [Download and install Node.js](https://nodejs.org/en/), version 16.9.0 and up is required.

2. Run this command in a command prompt or powershell
```shell
npm i -g node-gyp@latest pnpm
```

Once that's complete, open a command prompt in the bot folder and run
```shell
pnpm i
```

3. Rename the .env.example file to .env and modify the file with the necessary API keys (The only required ones are token and prefix)

# Getting a token

[Go to this link](https://discord.com/developers/applications)

Click new application

Name your bot

Save your application ID for later

Click Bot on the left sidebar

Click Add Bot

Copy the token and put it in your .env file

Scroll down to priviliged gateway intents

Turn on presence intent, message content intent, and server members intent

Save your changes

# Starting the bot
You can run [startbot.sh](https://github.com/William5553/triv/blob/discord.js-latest/startbot.sh) if you're on Linux and [startbot.bat](https://github.com/William5553/triv/blob/discord.js-latest/startbot.bat) if you're on Windows.

# Inviting your bot
[Go to this link](https://discordapi.com/permissions.html#8) and enter your application ID from earlier
