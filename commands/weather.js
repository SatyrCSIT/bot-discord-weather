const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : require('node-fetch');

const configPath = path.join(__dirname, '../config.json');

const weatherStyles = {
  Clear: { emoji: '☀️', color: '#FFD700', th: 'แดดจัด', en: 'Clear Sky' },
  Clouds: { emoji: '☁️', color: '#B0C4DE', th: 'เมฆมาก', en: 'Overcast Clouds' },
  Rain: { emoji: '🌧️', color: '#4682B4', th: 'ฝนตก', en: 'Rain' },
  Thunderstorm: { emoji: '⛈️', color: '#2F4F4F', th: 'พายุฝนฟ้าคะนอง', en: 'Thunderstorm' },
  Snow: { emoji: '❄️', color: '#F0F8FF', th: 'หิมะตก', en: 'Snow' },
  Mist: { emoji: '🌫️', color: '#D3D3D3', th: 'หมอก', en: 'Mist' },
  default: { emoji: '🌈', color: '#00CED1', th: 'อากาศทั่วไป', en: 'General Weather' },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('แสดงสภาพอากาศแบบเรียลไทม์ในประเทศไทย')
    .addStringOption(option =>
      option
        .setName('city')
        .setDescription('ชื่อเมืองในประเทศไทย เช่น Bangkok, Chiang Mai')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    let city, unit;

    if (interaction.isChatInputCommand()) {
      city = interaction.options.getString('city');
      unit = 'metric';
    } else if (interaction.isButton()) {
      const [action, , cityFromId, unitFromId] = interaction.customId.split('_');
      if (action !== 'toggle' && action !== 'refresh') return;
      city = cityFromId;
      unit = unitFromId;
    } else {
      return;
    }

    async function sendWeatherEmbed(targetChannel, city, unit) {
      const apiKey = process.env.WEATHER_API_KEY;
      if (!apiKey) {
        return {
          content: 'ไม่พบ API Key สำหรับ OpenWeatherMap กรุณาตั้งค่าใน .env',
          flags: MessageFlags.Ephemeral,
        };
      }

      const unitParam = unit === 'metric' ? 'metric' : 'imperial';
      const unitSymbol = unit === 'metric' ? '°C' : '°F';
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},TH&appid=${apiKey}&units=${unitParam}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.cod !== 200) {
          return {
            content: `ไม่พบเมือง "${city}" กรุณาตรวจสอบชื่อเมือง`,
            flags: MessageFlags.Ephemeral,
          };
        }

        const { main, weather, wind, name, sys } = data;
        const weatherCondition = weather[0].main;
        const style = weatherStyles[weatherCondition] || weatherStyles.default;

        const currentDate = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', hour12: true, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const formattedDate = `อัปเดตล่าสุด: ${currentDate} (+07)`;

        const embed = new EmbedBuilder()
          .setTitle(`🌍 สภาพอากาศ ${name}, ${sys.country} ${style.emoji}`)
          .setDescription(`**${style.th} / ${style.en}**\n${weather[0].description.toUpperCase()}`)
          .addFields(
            { name: '🌡️ อุณหภูมิ / Temperature', value: `${main.temp}${unitSymbol} (รู้สึกเหมือน ${main.feels_like}${unitSymbol})`, inline: true },
            { name: '💧 ความชื้น / Humidity', value: `${main.humidity}%`, inline: true },
            { name: '💨 ความเร็วลม / Wind Speed', value: `${wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}`, inline: true },
            { name: '☁️ ความกดอากาศ / Pressure', value: `${main.pressure} hPa`, inline: true },
          )
          .setColor(style.color)
          .setThumbnail(`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`)
          .setFooter({ text: `${formattedDate} | ข้อมูลจาก OpenWeatherMap`, iconURL: 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/logo_OpenWeatherMap_orange.svg' })
          .setTimestamp();

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`toggle_unit_${city}_${unit === 'metric' ? 'imperial' : 'metric'}`)
              .setLabel(unit === 'metric' ? 'Switch to °F' : 'Switch to °C')
              .setStyle(ButtonStyle.Primary)
              .setEmoji('🌡️'),
            new ButtonBuilder()
              .setCustomId(`refresh_weather_${city}_${unit}`)
              .setLabel('Refresh')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('🔄'),
          );

        return { embeds: [embed], components: [row] };
      } catch (error) {
        console.error('Error fetching weather:', error);
        return { content: 'เกิดข้อผิดพลาดในการดึงข้อมูลสภาพอากาศ / Error fetching weather data', flags: MessageFlags.Ephemeral };
      }
    }

    if (interaction.isButton()) {
      await interaction.deferUpdate();
      const message = await sendWeatherEmbed(interaction.channel, city, unit);
      await interaction.message.edit(message);
    } else {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      let config = {};
      try {
        const configData = await fs.readFile(configPath, 'utf8');
        config = JSON.parse(configData);
      } catch (error) {
        config = {};
      }

      const weatherChannelId = config[interaction.guild.id];
      let targetChannel = interaction.channel;

      if (weatherChannelId) {
        const channel = interaction.guild.channels.cache.get(weatherChannelId);
        if (channel && channel.permissionsFor(client.user).has(['SendMessages', 'EmbedLinks'])) {
          targetChannel = channel;
        }
      }

      let latestMessage = null;
      const messages = await targetChannel.messages.fetch({ limit: 10 });
      latestMessage = messages.find(m => m.author.id === client.user.id && m.embeds.length > 0 && m.embeds[0].title.includes(city));

      const message = await sendWeatherEmbed(targetChannel, city, unit);
      if (latestMessage) {
        await latestMessage.edit(message);
      } else {
        await targetChannel.send(message);
      }

      await interaction.editReply({ content: `ส่งข้อมูลสภาพอากาศของ ${city} ไปยัง ${targetChannel}! / Sent weather data for ${city} to ${targetChannel}!`, flags: MessageFlags.Ephemeral });
    }
  },
};