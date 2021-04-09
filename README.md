# Installation instructions for Windows
1. [Download and install Node.js](https://nodejs.org/en/), version 12.3.0 and up is required.

2. Run these 3 commands in a command prompt ran as administrator
```shell
npm i -g --add-python-to-path --vs2015 --production windows-build-tools
npm i -g node-gyp@latest
npm i
```

3. Rename the .env.example file to .env and modify the file with the necessary API keys
[Get a discord token here](https://discord.com/developers/applications)

4. Run this command in a command prompt to start the bot
```shell
node index.js
```
