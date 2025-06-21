const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('แสดงรายการคำสั่งทั้งหมดของ Weather Bot'),
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const embed = new EmbedBuilder()
      .setTitle('📖 คู่มือการใช้งาน Weather Bot')
      .setDescription('นี่คือคำสั่งทั้งหมดที่คุณสามารถใช้ได้กับ Weather Bot!')
      .addFields(
        {
          name: '🌤️ /weather <city>',
          value: 'แสดงสภาพอากาศแบบเรียลไทม์ของเมืองในประเทศไทย\n**ตัวอย่าง**: `/weather city:Bangkok`\n- รองรับการสลับหน่วย °C/°F\n- รีเฟรชข้อมูลด้วยปุ่ม 🔄',
          inline: false,
        },
        {
          name: '🛠️ /createweatherchannel',
          value: 'สร้างช่องพิเศษ (#weather-updates) สำหรับแสดงสภาพอากาศ\n**หมายเหตุ**: ต้องมีสิทธิ์ Manage Channels\n**ตัวอย่าง**: `/createweatherchannel`',
          inline: false,
        },
        {
          name: '📖 /help',
          value: 'แสดงคู่มือนี้\n**ตัวอย่าง**: `/help`',
          inline: false,
        },
      )
      .setColor('#1E90FF')
      .setThumbnail('https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/logo_OpenWeatherMap_orange.svg')
      .setFooter({ text: 'Weather Bot | พัฒนาโดย Satyr', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};