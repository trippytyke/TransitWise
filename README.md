# TransitWise SG


## 📖 Overview

Welcome to **TransitWise SG**, a mobile application designed to help users navigate Singapore’s public transport system efficiently. Whether you're planning your next bus ride, finding a taxi nearby, or checking real-time weather updates, TransitWise SG is your comprehensive travel companion.


## 🚀 Features

### Core Functionalities
1. **Real-Time Bus Arrival Information**  
   - View accurate bus arrival timings for your selected stops.

2. **Taxi Availability**  
   - Find nearby available taxis on an interactive map.

3. **Comprehensive Directions**  
   - Get multi-modal directions, combining buses, walking, and trains for the most efficient routes.

4. **Weather Updates**  
   - Stay informed with real-time weather conditions to plan your commute.

5. **Light and Dark Mode**  
   - Switch themes based on your preference and lighting conditions.


## 💻 Running the Application

### Prerequisites
- Install [Node.js](https://nodejs.org/) and ensure npm is available.
- Install the [Expo Go](https://expo.dev/client) app on your mobile device for QR code scanning.

### Steps to Run
1. Navigate to the project directory.
2. Install the required dependencies by typing:

   ```npm install```

3. Start the application by typing:

   ```npm start```

   or  

   ```npx expo start```

4. A QR code will appear in your terminal.  
   - **Mobile Device**: Scan the QR code using the Expo Go app to launch the application.  
   - **Emulator**: Use an Android or iOS emulator to run the application.

### Emulator Configuration
If using an emulator, set the location to Singapore for accurate transportation data:
- **Latitude**: 1.360577  
- **Longitude**: 103.956607

### Permissions
Ensure the application has access to:
- **Location Services**: For nearby transport options.  
- **Network Access**: To fetch real-time data.


## 🛠️ Technologies Used

### APIs
- LTA DataMall API: Real-time data for buses and taxis.  
- Google Maps API: Location services and navigation.  
- DATA Gov SG API: Real-time weather updates.


## 🌐 Online Demo

**Expo Snack Link**: [TransitWise SG on Snack](https://snack.expo.dev/@trippytyke/transport-app-transitwise-sg?platform=ios)

**Important Note**:  
- If testing on Expo Snack, use the **Android** or **iOS emulator** for optimal performance.  
- Certain dependencies do not work well on the web emulator. Switch to a supported emulator if you encounter errors.


## 📊 Additional Information

### User Tips
- Use the app in Singapore for the best experience.
- Allow all requested permissions for accurate real-time data.


## 📬 Contact

For questions, suggestions, or collaborations, feel free to reach out at:  
syahmi.ariffin@gmail.com


## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
