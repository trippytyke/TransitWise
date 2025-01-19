import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import { useTheme } from '../theme';

const TaxiScreen = () => {
  //Get the app theme
  const { theme } = useTheme();

  //State variables to store taxi locations and user location
  const [taxiLocations, setTaxiLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Function to fetch user's location
    const fetchUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setUserLocation({ //Set the user's location and zoom
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };
    //Call the function to fetch user's location
    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) { //Fetch taxi data only when user's location is available
      fetchTaxiData();
    }
  }, [userLocation]);

  //Function to fetch taxi data
  const fetchTaxiData = async () => {
    setLoading(true);
    try {
      //HTTP GET request to LTA API for taxi availability
      const response = await axios.get('https://datamall2.mytransport.sg/ltaodataservice/Taxi-Availability', {
        headers: {
          AccountKey: 'LtSf6eTESX+gPi4BHLZfMQ==',
        },
      });
      //Set the taxi locations on the map
      setTaxiLocations(response.data.value);
    } catch (error) {
      console.error('Error fetching taxi data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userLocation) { //Show loading message while fetching user's location
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={{ color: theme.textColor }}>Loading your location...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <MapView
        style={styles.map}
        region={userLocation}
      >
        {taxiLocations.map((taxi, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: taxi.Latitude, 
              longitude: taxi.Longitude, 
            }}
            title="Available Taxi"
            image={require('../assets/taxi-marker.png')}
          />
        ))}
      </MapView>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default TaxiScreen;
