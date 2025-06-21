require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const loadCommands = async () => {
  const commandFiles = (await fs.readdir(commandsPath)).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
  }
};

client.once('ready', async () => {
  await loadCommands();
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'เกิดข้อผิดพลาดในการรันคำสั่ง!', ephemeral: true });
    }
  } else if (interaction.isButton()) {
    const command = client.commands.get('weather');
    if (command) {
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'เกิดข้อผิดพลาดในการจัดการปุ่ม!', ephemeral: true });
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);