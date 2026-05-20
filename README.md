
# 🏠 Smart Home Builder

## 📘 Overview
This project simplifies IoT system deployment by enabling electricians and non-technical users to build, configure, and manage IoT devices easily.  
It combines **backend automation**, **real-time communication**, and **desktop tooling** to connect ESP32-based devices with customers’ accounts for monitoring and control.

### Video Demo  
you watch the video [here](https://www.linkedin.com/posts/mohammad-faqusa_%D8%A7%D9%84%D8%AD%D9%85%D8%AF-%D9%84%D9%84%D9%87-%D8%B1%D8%A8-%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85%D9%8A%D9%86-%D8%A8%D8%B9%D8%AF-%D8%A3%D9%86-%D8%A3%D8%AA%D9%85%D9%85%D8%AA-%D9%85%D9%86%D8%A7%D9%82%D8%B4%D8%A9-activity-7341577958832123904-z1W4?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEmVa4gBlhYPFjQcwt_6uwuSfw0WOa7Qfaw) 
---
### University Research  
This project is represneted in my **graudation project research** and published in ppu scholar [https://scholar.ppu.edu/items/2b3f3d5e-2327-4f1c-8deb-d40e35a37098](https://scholar.ppu.edu/items/2b3f3d5e-2327-4f1c-8deb-d40e35a37098)
---
## ⚙️ System Architecture

### 🖥️ Backend
- **Node.js + Express** for RESTful APIs
- **MongoDB** for storing user, device, and configuration data
- **Socket.IO** for real-time communication between clients and devices
- **MQTT Client** for connecting to the IoT broker and subscribing to device topics
- **JWT Authentication** for securing HTTP and WebSocket communications

### ☁️ IoT Platform
- **Mosquitto Broker** for device–cloud message exchange via MQTT
- **ESP32 Devices** running firmware libraries (auto-installed through the desktop app)
- Real-time updates for device status, control signals, and telemetry data

### 💻 Desktop Application
- Repository: [electrician-app](https://github.com/mohammad-faqusa/electrician-app)
- Provides a local tool for electricians to:
  - Select hardware peripherals (sensors, relays, displays, etc.)
  - Automatically generate and flash ESP32 firmware
  - Connect devices to MQTT broker and link them to the customer’s account
- Downloads device-side libraries from: [mip-packages](https://github.com/mohammad-faqusa/mip-packages)

### 🌐 Frontend
- Built with **HTML, CSS, JavaScript**, and **Socket.IO**
- Responsive user interface for:
  - Device management and visualization
  - Real-time control panels
  - Customer and device linking
  - Configuration and automation setup

---

## 🧩 Features
- Secure authentication with JWT for REST and WebSocket connections  
- Automatic device registration and linking with customer accounts  
- Real-time monitoring and control using Socket.IO and MQTT  
- Dynamic dashboard for devices and live data visualization  
- Desktop app integration for easy hardware configuration  
- Modular backend architecture for scalability and future cloud expansion  

---

## 📂 Project Structure
```bash

IoT_graduationProject/
├── server/                 # Node.js backend (API, MQTT client, Socket.IO)
│   ├── models/             # MongoDB schemas
│   ├── routes/             # Express routes
│   ├── utils/              # JWT, MQTT, and helper modules
│   ├── .env.example        # Environment variables template
│   └── index.js            # Entry point
├── public/                 # Frontend files (HTML, CSS, JS)
│   └── js/                 # Socket.IO event handlers
└── README.md               # Project documentation

```

## 🔄 System Scenarios

### 🧍‍♂️ 1. User Registration & Authentication
1. A new user (electrician or customer) registers through the web interface.  
2. The backend validates the request and stores user data in **MongoDB**.  
3. A **JWT token** is generated and returned for secure future requests.  
4. All subsequent HTTP and WebSocket communications use this token for authentication.  
   - Example:  
     ```http
     Authorization: Bearer <jwt_token>
     ```
✅ **Goal:** Ensure secure communication between client, backend, and devices.

---

### ⚙️ 2. Device Registration & Setup
1. The electrician opens the **Desktop Application** ([electrician-app](https://github.com/mohammad-faqusa/electrician-app)).  
2. The app allows selecting connected sensors and actuators (e.g., temperature, relay, servo, gas sensor).  
3. The app uses an **AI-powered code generator** to:
   - Create custom ESP32 firmware code according to the selected peripherals.  
   - Automatically insert MQTT credentials, topics, and API endpoints.  
4. During installation, the app downloads required device libraries from [mip-packages](https://github.com/mohammad-faqusa/mip-packages).  
5. After flashing the ESP32, the device connects automatically to the **Mosquitto MQTT broker**.  
6. The device registers itself in the platform via MQTT and links to the user’s account.

✅ **Goal:** Make device setup and firmware generation automatic and technician-friendly — no coding required.

---

### 🤖 3. Device Automation Logic
1. Users can define **automation rules** in the web interface (e.g., *turn on fan if temperature > 30°C*).  
2. These rules are stored in the backend database and loaded into the automation engine.  
3. The backend subscribes to the relevant MQTT topics through its **MQTT client**.  
4. When a device publishes new sensor data:
   - The backend evaluates conditions using the automation logic.
   - If conditions are met, it sends a control message back to the device through MQTT.
5. The frontend (dashboard) updates in **real-time** via **Socket.IO** to reflect device status changes.

✅ **Goal:** Allow users to automate IoT device behavior without writing code, using stored logic and MQTT event handling.

---

### 🌐 Example Flow
1. Electrician registers → gets JWT token.  
2. Adds a new device through the desktop app → firmware generated → device connected to MQTT broker.  
3. Device sends live data → backend receives → evaluates automation rule → sends control message → frontend dashboard updates instantly.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/mohammad-faqusa/IoT_graduationProject.git
cd IoT_graduationProject/server
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create a `.env` file inside `/server`:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
MQTT_BROKER_URL=mqtt://localhost:1883
```

### 4️⃣ Start the Server

```bash
npm start
```

### 5️⃣ Access the Frontend

Open `/public/index.html` in your browser to view the dashboard.

---

## 🔒 Authentication

* Users log in to receive a **JWT token**.
* Tokens are validated on each API and WebSocket request.
* Ensures secure communication between frontend, backend, and devices.

---

## 🔧 Future Enhancements

* Add **React frontend** for modular UI
* Integrate **Docker** for containerized deployment
* Add **AI-based automation suggestions**
* Build **multi-tenant cloud-ready architecture**

---

## 📚 Related Repositories

* 🧰 **Desktop Application:** [electrician-app](https://github.com/mohammad-faqusa/electrician-app)
* ⚙️ **ESP32 Libraries:** [mip-packages](https://github.com/mohammad-faqusa/mip-packages)

---

## 👨‍💻 Author

**Mohammad Faqusa**
Computer Engineering Graduate | Backend-Focused Full-Stack Developer
📧 [mohammadfaqusa9@gmail.com](mailto:mohammadfaqusa9@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/mohammad-faqusa)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

