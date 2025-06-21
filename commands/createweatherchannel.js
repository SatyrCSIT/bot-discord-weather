const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const configPath = path.join(__dirname, '../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createweatherchannel')
    .setDescription('สร้างช่องสำหรับแสดงสภาพอากาศโดยเฉพาะ')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.editReply({ content: 'ไม่มีสิทธิ์จัดการช่อง กรุณาให้สิทธิ์ Manage Channels ', flags: MessageFlags.Ephemeral });
      }

      const channel = await interaction.guild.channels.create({
        name: 'ᴡᴇᴀᴛʜᴇʀ-ᴛʜ',
        type: 0,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: [PermissionsBitField.Flags.SendMessages],
          },
          {
            id: interaction.client.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.EmbedLinks,
            ],
          },
        ],
      });

      let config = {};
      try {
        const configData = await fs.readFile(configPath, 'utf8');
        config = JSON.parse(configData);
      } catch (error) {}

      config[interaction.guild.id] = channel.id;
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));

      // สร้าง Embed คำแนะนำ
      const welcomeEmbed = new EmbedBuilder()
        .setTitle('🌤️ ยินดีต้อนรับสู่ช่องสภาพอากาศ!')
        .setDescription('ช่องนี้ถูกสร้างสำหรับแสดงสภาพอากาศแบบเรียลไทม์\n**วิธีใช้งาน:**\n- ใช้คำสั่ง `/weather <city>` ในช่องอื่น (เช่น Bangkok, Chiang Mai)\n- กดปุ่ม 🌡️ เพื่อสลับหน่วย (°C/°F) หรือ 🔄 เพื่อรีเฟรช\n- ช่องนี้จะอัปเดตข้อมูลเมื่อคุณใช้คำสั่ง!')
        .setColor('#00FF7F')
        .setFooter({ text: 'Weather Bot | พัฒนาโดย Satyr', iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/logo_OpenWeatherMap_orange.svg' })
        .setTimestamp();

      await channel.send({ embeds: [welcomeEmbed] });

      const embed = new EmbedBuilder()
        .setTitle('🎉 ช่องสภาพอากาศถูกสร้างแล้ว!')
        .setDescription(`ช่อง ${channel} ได้ถูกสร้างสำหรับแสดงสภาพอากาศ\nคำแนะนำการใช้งานถูกส่งไปในช่องแล้ว!`)
        .setColor('#00FF7F')
        .setTimestamp();

      await interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch (error) {
      console.error('Error creating weather channel:', error);
      await interaction.editReply({ content: 'เกิดข้อผิดพลาดในการสร้างช่อง กรุณาลองใหม่', flags: MessageFlags.Ephemeral });
    }
  },
};