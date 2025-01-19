import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { findNearest } from 'geolib';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import * as Network from 'expo-network';

//Mapping of forecast descriptions to icons
const forecastIconMap = {
  "Fair": "sunny-outline",
  "Fair (Day)": "sunny-outline",
  "Fair (Night)": "moon-outline",
  "Fair and Warm": "sunny-outline",
  "Partly Cloudy": "partly-sunny-outline",
  "Partly Cloudy (Day)": "partly-sunny-outline",
  "Partly Cloudy (Night)": "cloudy-night-outline",
  "Cloudy": "cloud-outline",
  "Hazy": "cloud-outline",
  "Slightly Hazy": "cloud-outline",
  "Windy": "wind-outline",
  "Mist": "water-outline",
  "Fog": "water-outline",
  "Light Rain": "rainy-outline",
  "Moderate Rain": "rainy-outline",
  "Heavy Rain": "thunderstorm-outline",
  "Passing Showers": "rainy-outline",
  "Light Showers": "rainy-outline",
  "Showers": "rainy-outline",
  "Heavy Showers": "thunderstorm-outline",
  "Thundery Showers": "thunderstorm-outline",
  "Heavy Thundery Showers": "thunderstorm-outline",
  "Heavy Thundery Showers with Gusty Winds": "thunderstorm-outline",
};

const HomeScreen = ({ navigation }) => {
  //Get the app theme
  const { theme } = useTheme();

  //State variables to store temperature, forecast, forecast icon, location name and date
  const [isConnected, setIsConnected] = useState(true);
  const [temperature, setTemperature] = useState(null);
  const [forecast, setForecast] = useState('Fetching forecast...');
  const [forecastIcon, setForecastIcon] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {//Fetch the current date and check network connection
    checkNetworkConnection();
    getCurrentDate();
  }, []);

  const checkNetworkConnection = async () => {
    const networkStatus = await Network.getNetworkStateAsync();
    setIsConnected(networkStatus.isConnected);
    if (!networkStatus.isConnected) {
      Alert.alert('No internet connection', 'Please connect to the internet to use the app.');
    } else {
      getUserLocation();
    }
  };
  //Function to get user's location
  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { //If permission is not granted, show an alert
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchWeatherData(location.coords);
    } catch (error) {
      console.error('Error getting user location:', error);
      setForecast('Error fetching location');
    }
  };

  //Function to fetch weather data
  const fetchWeatherData = async (coords) => {
    try {
      //HTTP GET request to Data.gov.sg API for temperature data
      const tempResponse = await axios.get('https://api.data.gov.sg/v1/environment/air-temperature');
      const readings = tempResponse.data.items[0].readings;

      //Calculate the average temperature
      const totalTemperature = readings.reduce((sum, reading) => sum + reading.value, 0);
      const averageTemperature = (totalTemperature / readings.length).toFixed(1);
      setTemperature(averageTemperature);
      
      //HTTP GET request to Data.gov.sg API for 2-hour weather forecast
      const forecastResponse = await axios.get('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast');
      const forecastData = forecastResponse.data.items[0].forecasts;
      const areaMetadata = forecastResponse.data.area_metadata;
      
      //Map the forecast data to locations
      const locations = forecastData.map((forecast) => {
        const metadata = areaMetadata.find((area) => area.name === forecast.area);
        if (!metadata) {
          console.error(`No metadata found for area: ${forecast.area}`);
          return null;
        }
        return {
          latitude: metadata.label_location.latitude,
          longitude: metadata.label_location.longitude,
          area: forecast.area,
          forecast: forecast.forecast,
        };
      }).filter(Boolean);

      //If no locations are found, log an error and set the forecast to a default message
      if (locations.length === 0) {
        console.error('No locations found in forecast data');
        setForecast('No forecast data available');
        return;
      }

      //Find the nearest location to the user
      const nearestLocation = findNearest({ latitude: coords.latitude, longitude: coords.longitude }, locations);

      //Set the forecast, location name and forecast icon based on the nearest location
      if (nearestLocation && nearestLocation.forecast) {
        setForecast(nearestLocation.forecast.toString());
        setLocationName(nearestLocation.area);
        setForecastIcon(forecastIconMap[nearestLocation.forecast] || 'cloud-outline');
      } else {
        console.error('Nearest location or forecast data is undefined');
        setForecast('No forecast available');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setForecast('Error fetching forecast');
    }
  };

  //Function to get the current date
  const getCurrentDate = () => {
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const currentDate = today.toLocaleDateString('en-US', options);
    setDate(currentDate);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.infoContainer}>
        <Text style={[styles.dateText, { color: theme.textColor }]}>{date}</Text>
        <View style={styles.weatherContainer}>
        <Ionicons name="thermometer" size={24} color={theme.primaryColor} style={styles.tempText} />
          <Text style={[styles.tempText, { color: theme.primaryColor }]}> {temperature}°C</Text>
          <Ionicons name={forecastIcon} size={24} color={theme.secondaryColor} style={styles.weatherIcon} />
          <Text style={[styles.forecastText, { color: theme.secondaryColor }]}>{forecast}</Text>
        </View>

      </View>

      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <View style={styles.column}>
            <TouchableOpacity
              style={[styles.gridItemSmall, { backgroundColor: theme.primaryColor }]}
              onPress={() => navigation.navigate('Taxi')}
            >
              <Ionicons name="car-outline" size={24} color={theme.headerTintColor} style={styles.gridItemIcon} />
              <Text style={[styles.gridItemText, { color: theme.headerTintColor }]}>Taxi Availability</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.gridItemSmall, { backgroundColor: theme.primaryColor }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={24} color={theme.headerTintColor} style={styles.gridItemIcon} />
              <Text style={[styles.gridItemText, { color: theme.headerTintColor }]}>Settings</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.gridItemLarge, { backgroundColor: theme.primaryColor }]}
            onPress={() => navigation.navigate('Bus Timing')}
          >
            <Ionicons name="bus-outline" size={24} color={theme.headerTintColor} style={styles.gridItemIcon} />
            <Text style={[styles.gridItemText, { color: theme.headerTintColor }]}>Bus Arrival Timings</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.gridItemWide, { backgroundColor: theme.primaryColor }]}
          onPress={() => navigation.navigate('Directions')}
        >
          <Ionicons name="walk-outline" size={24} color={theme.headerTintColor} style={styles.gridItemIcon} />
          <Text style={[styles.gridItemText, { color: theme.headerTintColor }]}>Begin your journey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 22,
    marginBottom: 5,
  },
  tempText: {
    fontSize: 18,
  },
  forecastText: {
    fontSize: 18,
    marginLeft: 10,
  },
  weatherIcon: {
    marginLeft: 10,
  },
  locationText: {
    fontSize: 16,
    marginTop: 5,
  },
  gridContainer: {
    flex: 0.8,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridItemSmall: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    paddingTop: 50,
    paddingBottom: 50, 
  },
  gridItemLarge: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    paddingTop: 110,
    paddingBottom: 110,
    marginBottom: 10,
  },
  gridItemWide: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    paddingVertical: 50, // Smaller padding
    marginBottom: 20, // Add margin to shift it up
  },
  gridItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  gridItemIcon: {
    marginBottom: 5,
  },
});


export default HomeScreen;