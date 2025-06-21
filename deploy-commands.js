const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
  {
    name: 'weather',
    description: 'แสดงสภาพอากาศแบบเรียลไทม์ในประเทศไทย',
    options: [
      {
        name: 'city',
        description: 'ชื่อเมืองในประเทศไทย เช่น Bangkok, Chiang Mai',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'createweatherchannel',
    description: 'สร้างช่องสำหรับแสดงสภาพอากาศโดยเฉพาะ',
  },
  {
    name: 'help',
    description: 'แสดงรายการคำสั่งทั้งหมดของ Weather Bot',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands('your_client_id'), //Client ID 
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();