# 📱 ProfileCard Pro

**A Privacy-First Mobile App for Managing Profile Photos & Live Location**

ProfileCard Pro is a production-ready React Native (Expo) application that seamlessly integrates native device features—Camera, Gallery, and GPS—with a robust permission-handling system. Built with a "Privacy First" philosophy, it ensures every sensor access is transparent, user-consented, and gracefully handles denials without crashing.

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

LINK EXPO : https://snack.expo.dev/@idhosembiring3107/profilecard_pro
---

## ✨ Features

### 📸 Core Features (Level 1)
- **Camera & Gallery Integration**: Capture a new profile picture or select one from your device library.
- **GPS & Reverse Geocoding**: Fetch precise coordinates and translate them into a readable street address.
- **Graceful Permission Flow**: Implements `getPermissionsAsync` → `requestPermissionsAsync` → `granted` check.
- **Cancel Handling**: Safely handles user cancellation without crashing the app.

### 🚀 Level 2 — Advanced Development (4 Features Implemented)
- **Dual Photo Source**: Choose between Camera and Gallery via a native Alert dialog.
- **Persistent Storage**: Automatically saves profile photo and location data using `AsyncStorage`; data persists across app restarts.
- **Settings Redirection**: Direct "Buka Pengaturan" button links users to the app's permission settings when access is denied.
- **Native Maps Integration**: Open the exact user location directly in Google Maps (Android) or Apple Maps (iOS).

### 🏆 Level 3 — Bonus Features
- **Priming Dialog**: Educational dialogue appears *before* the system popup, explaining why the permission is needed.
- **Reset Photo**: Option to delete the current profile photo and revert to the default placeholder.
- **Address Lookup**: Reverse geocoding provides a full address (Street, City, Province, Country).

---

## 🎨 UI/UX Showcase

### 📸 Screenshots

| **Initial Screen** | **Gallery Selection** | **Feature Overview** |
| :---: | :---: | :---: |
| <img width="400" alt="awal" src="https://github.com/user-attachments/assets/52e0a304-f5d8-4d14-a5b4-5568caf10206" /> | <img width="400" alt="galeri" src="https://github.com/user-attachments/assets/863cec27-2c9f-48fd-86ee-f796da3fd295" /> | <img width="400" alt="feature" src="https://github.com/user-attachments/assets/ee39e494-b960-4b6f-961c-34a57155e179" /> |
| *Default avatar with action buttons.* | *System-native gallery picker interface.* | *Complete UI with Photo, Location, and Maps.* |

---

### 🎥 Video Demos (Click to View)

| **Camera & Delete Feature** | **Finding GPS Location** |
| :---: | :---: |
| [![Camera & Delete](https://img.shields.io/badge/▶️-Watch_Demo-blue?style=for-the-badge)](https://github.com/user-attachments/assets/e4f62d01-0aee-4f6f-81c8-f1c5b0ea4b5a) | [![Find Location](https://img.shields.io/badge/▶️-Watch_Demo-green?style=for-the-badge)](https://github.com/user-attachments/assets/76833608-b964-42b6-928b-eb72c6be4f39) |
| *Testing camera capture and photo deletion.* | *Fetching real-time GPS coordinates.* |

| **Switch to Google Maps** |
| :---: |
| [![Google Maps](https://img.shields.io/badge/▶️-Watch_Demo-orange?style=for-the-badge)](https://github.com/user-attachments/assets/1e232027-6f9e-4dc6-985b-72196d437f11) |
| *Redirecting location coordinates to Google Maps.* |
## 🔐 Permission Flow Architecture

The application implements a state-of-the-art permission handling strategy:

```mermaid
graph TD
    A[User Tap Action] --> B{Check Permission Status}
    B -->|Undetermined| C[Show Priming Dialog]
    C --> D[Request Permission]
    B -->|Denied| E[Show Denied Alert + Settings Button]
    B -->|Granted| F[Access Feature]
    D --> G{User Grants?}
    G -->|Yes| F
    G -->|No| E
    F --> H[Display Result: Photo/Coordinates]
