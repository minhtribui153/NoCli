clear

echo "===================="
echo "Discord Bot Launcher"
echo "===================="

echo "Installing NPM packages... (you may be asked for your password)"
sudo npm install -g n
npm install --silent discord.js@latest
sudo npm link --silent nocli-handler.js

clear

echo "===================="
echo "Discord Bot Launcher"
echo "===================="

echo "Starting the bot"
npm run start:dev