# 🌦️ Discord Weather Bot
ยินดีต้อนรับสู่ **Discord Weather Bot** บอทช่วยแสดงข้อมูลสภาพอากาศแบบเรียลไทม์ พัฒนาด้วยการผสานรวมกับ API ของ **OpenWeatherMap** เพื่อให้ข้อมูลที่แม่นยำส่งตรงถึงเซิร์ฟเวอร์ Discord 

---

## ✨ คุณสมบัติ

- **สภาพอากาศเรียลไทม์**: รับข้อมูลล่าสุด (อุณหภูมิ ความชื้น ความเร็วลม ความกดอากาศ) สำหรับเมืองจังหวัดใดก็ได้
- **รองรับหลายภาษา**: แสดงข้อมูลทั้งภาษาไทยและอังกฤษ
- **UI**: ใช้ Embed ที่ออกแบบสวยงามพร้อมปุ่มโต้ตอบสำหรับสลับหน่วย (°C/°F) และรีเฟรชข้อมูล
- **ช่องเฉพาะ**: สร้างช่อง `#weather` สำหรับอัปเดตสภาพอากาศ
- **คำแนะนำอัตโนมัติ**: มีข้อความต้อนรับพร้อมคำแนะนำการใช้งานในช่องที่สร้าง
- **ป้องกันซ้ำซ้อน**: อัปเดตข้อมูลเดิมแทนการส่งข้อความซ้ำ

---

## 🛠️ ข้อกำหนด

- **Node.js**: แนะนำเวอร์ชัน 18.x ขึ้นไป
- **Discord Bot Token**: สามารถขอได้จาก [Discord Developer Portal](https://discord.com/developers)
- **OpenWeatherMap API Key**: ลงทะเบียนที่ [OpenWeatherMap](https://openweathermap.org)

---

## 📥 การติดตั้ง

1. **โคลน Repository**:
   ```bash
   git clone https://github.com/your-username/discord-weather-bot.git
   cd discord-weather-bot
   ```

2. **ติดตั้ง Dependencies**:
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables**:
   - สร้างไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจกต์
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   WEATHER_API_KEY=your_openweathermap_api_key
   ```
   - แทนที่ `your_discord_bot_token` ด้วย Bot Token และ `your_openweathermap_api_key` ด้วยคีย์ API ของคุณ

4. **Deploy Slash Commands**:
   ```bash
   node deploy-commands.js
   ```

5. **รันบอท**:
   ```bash
   node index.js
   ```

---

## 🎮 วิธีการใช้งาน

### คำสั่งที่ใช้งานได้

- **/weather <city>**: แสดงสภาพอากาศปัจจุบันของเมืองที่ระบุ (เช่น `/weather Bangkok`)
- **ปุ่ม**:
  - 🌡️ **เปลี่ยนหน่วยเป็น °F / เปลี่ยนหน่วยเป็น °C**: สลับหน่วยอุณหภูมิ
  - 🔄 **รีเฟรช**: อัปเดตข้อมูลสภาพอากาศ
- **/createweatherchannel**: สร้างช่อง `#weather-updates` สำหรับอัปเดตสภาพอากาศ (ต้องมีสิทธิ์ Manage Channels)
- **/help**: แสดงรายการคำสั่งและคำแนะนำการใช้งาน

### ตัวอย่างผลลัพธ์
หลังใช้ `/weather Bangkok` คุณจะเห็น Embed ดังนี้:

- **หัวข้อ**: 🌍 สภาพอากาศ Bangkok, TH ☁️
- **คำอธิบาย**: เมฆมาก / Overcast Clouds (OVERCAST CLOUDS)
- **ฟิลด์**:
  - 🌡️ **อุณหภูมิ / Temperature**: 32.5°C
  - 💧 **ความชื้น / Humidity**: 67%
  - 💨 **ความเร็วลม / Wind Speed**: 3.93 m/s
  - ☁️ **ความกดอากาศ / Pressure**: 1004 hPa
- **Footer**: อัปเดตล่าสุด: วันเสาร์ที่ 21 มิถุนายน 2568, 19:53 น. (+07) | ข้อมูลจาก OpenWeatherMap

---

## ⚙️ การตั้งค่า

- **config.json**: เก็บ ID ช่อง `#weather-updates` สำหรับแต่ละเซิร์ฟเวอร์
  ```json
  {
    "guild_id": "channel_id"
  }
  ```

---

## 🙏 คำขอบคุณ

- **OpenWeatherMap**: ผู้ให้บริการ API สภาพอากาศ
- **Discord.js**: กรอบงานบอท Discord