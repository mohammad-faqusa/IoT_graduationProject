# 🏠 Smart Home Builder

### Simplifying IoT Deployment for Electricians & Non-Technical Users

Transforming complex IoT setup into an easy, automated, and scalable experience using **ESP32**, **MQTT**, **real-time communication**, and **desktop automation tools**. 

---

# 🚀 Project Overview

**Smart Home Builder** is an IoT platform designed to help electricians and non-technical users build and manage smart home systems without needing deep programming knowledge.

The system combines:

* ⚡ Real-time device communication
* 🤖 Automated firmware generation
* 🔐 Secure authentication
* 🖥️ Desktop tooling for hardware setup
* 📡 MQTT-based IoT communication
* 🌐 Live monitoring dashboards

The platform enables users to configure ESP32-based devices, connect them to customer accounts, and control them remotely through an integrated web interface. 

---

# 🎥 Demo & Research

## 📹 Video Demo

🔗 Watch the project demo here:
[https://www.linkedin.com/posts/mohammad-faqusa_%D8%A7%D9%84%D8%AD%D9%85%D8%AF-%D9%84%D9%84%D9%87-%D8%B1%D8%A8-%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85%D9%8A%D9%86-%D8%A8%D8%B9%D8%AF-%D8%A3%D9%86-%D8%A3%D8%AA%D9%85%D9%85%D8%AA-%D9%85%D9%86%D8%A7%D9%82%D8%B4%D8%A9-activity-7341577958832123904-z1W4](https://www.linkedin.com/posts/mohammad-faqusa_%D8%A7%D9%84%D8%AD%D9%85%D8%AF-%D9%84%D9%84%D9%87-%D8%B1%D8%A8-%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85%D9%8A%D9%86-%D8%A8%D8%B9%D8%AF-%D8%A3%D9%86-%D8%A3%D8%AA%D9%85%D9%85%D8%AA-%D9%85%D9%86%D8%A7%D9%82%D8%B4%D8%A9-activity-7341577958832123904-z1W4)

## 🎓 University Research

This project was presented as my **graduation project research** and published on **PPU Scholar**:
🔗 [https://scholar.ppu.edu/items/2b3f3d5e-2327-4f1c-8deb-d40e35a37098](https://scholar.ppu.edu/items/2b3f3d5e-2327-4f1c-8deb-d40e35a37098)

---

# 🏗️ System Architecture

## 🖥️ Backend

Built using:

* **Node.js + Express** → RESTful APIs
* **MongoDB** → Device & user management
* **Socket.IO** → Real-time communication
* **MQTT Client** → Device messaging
* **JWT Authentication** → Secure API & WebSocket access

### Responsibilities

✔ Device registration
✔ Automation logic
✔ Real-time synchronization
✔ User authentication
✔ MQTT event handling

---

## ☁️ IoT Platform

### Core Technologies

* **Mosquitto MQTT Broker**
* **ESP32 Devices**
* MQTT-based telemetry & control communication

### Capabilities

* Real-time device status updates
* Sensor telemetry streaming
* Remote control messaging
* Automatic device linking to customer accounts

---

## 💻 Desktop Application

🔗 Repository:
[https://github.com/mohammad-faqusa/electrician-app](https://github.com/mohammad-faqusa/electrician-app)

The desktop application helps electricians:

* Select sensors & peripherals
* Automatically generate ESP32 firmware
* Flash firmware directly to devices
* Configure MQTT credentials automatically
* Link devices to customer accounts

### Additional Repository

🔗 ESP32 Libraries:
[https://github.com/mohammad-faqusa/mip-packages](https://github.com/mohammad-faqusa/mip-packages)

---

## 🌐 Frontend

Built using:

* HTML
* CSS
* JavaScript
* Socket.IO

### Features

* 📊 Live device dashboards
* 🎛️ Real-time control panels
* 🔗 Customer-device linking
* ⚙️ Automation management
* 📱 Responsive interface

---

# ✨ Core Features

✅ JWT-secured authentication
✅ Real-time monitoring & control
✅ Automatic device registration
✅ AI-assisted firmware generation
✅ MQTT-based communication
✅ Live dashboard updates with Socket.IO
✅ Technician-friendly deployment workflow
✅ Scalable modular backend architecture

---

# 🔄 System Workflow

## 🧍 User Authentication

1. User registers through the web interface
2. Backend validates and stores user data
3. JWT token is generated
4. Token secures future API & WebSocket requests

```http
Authorization: Bearer <jwt_token>
```

---

## ⚙️ Device Setup Process

1. Electrician opens the desktop application
2. Selects hardware components
3. AI engine generates custom ESP32 firmware
4. Required libraries are downloaded automatically
5. ESP32 connects to MQTT broker
6. Device links automatically to customer account

### Result

✔ No manual coding required
✔ Faster deployment
✔ Simplified IoT installation process

---

## 🤖 Automation Engine

Users can create automation rules such as:

> “Turn on the fan if temperature exceeds 30°C”

### How It Works

* Rules are stored in MongoDB
* Backend subscribes to MQTT topics
* Incoming sensor data triggers logic evaluation
* MQTT control messages are sent automatically
* Frontend updates instantly via Socket.IO

---

# 🌐 Example Scenario

### Complete Flow

1️⃣ Electrician registers and receives JWT token
2️⃣ Device firmware is generated automatically
3️⃣ ESP32 connects to MQTT broker
4️⃣ Sensor data is streamed live
5️⃣ Backend evaluates automation rules
6️⃣ Control commands are triggered automatically
7️⃣ Dashboard updates instantly in real time

---

# 📂 Project Structure

```bash
IoT_graduationProject/
├── server/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   └── index.js
│
├── public/
│   └── js/
│
└── README.md
```

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/mohammad-faqusa/IoT_graduationProject.git

cd IoT_graduationProject/server
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create `.env` inside `/server`

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
MQTT_BROKER_URL=mqtt://localhost:1883
```

---

## 4️⃣ Start Server

```bash
npm start
```

---

## 5️⃣ Launch Frontend

Open:

```bash
/public/index.html
```

in your browser.

---

# 🔐 Authentication & Security

* JWT-secured APIs
* Protected WebSocket communication
* Secure frontend-backend-device interactions
* Token validation on every request

---

# 🔮 Future Improvements

🚀 React-based frontend
🐳 Docker containerization
☁️ Cloud-native multi-tenant architecture
🤖 AI-powered automation suggestions
📈 Scalable distributed infrastructure

---

# 📚 Related Repositories

## 🧰 Desktop Application

[https://github.com/mohammad-faqusa/electrician-app](https://github.com/mohammad-faqusa/electrician-app)

## ⚙️ ESP32 Libraries

[https://github.com/mohammad-faqusa/mip-packages](https://github.com/mohammad-faqusa/mip-packages)

---

# 👨‍💻 Author

## Mohammad Faqusa

**Computer Engineering Graduate**
Backend-Focused Full-Stack Developer

📧 [mohammadfaqusa9@gmail.com](mailto:mohammadfaqusa9@gmail.com)
🔗 [https://www.linkedin.com/in/mohammad-faqusa](https://www.linkedin.com/in/mohammad-faqusa)

---

# 📝 License

This project is licensed under the **MIT License**.
