import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { findNearest, getDistance } from 'geolib';
import { useTheme } from '../theme';

const BusArrivalScreen = () => {
  //Get the app theme
  const { theme } = useTheme(); 

  //State variables to store bus stops, loading state and expanded bus stops
  const [busStops, setBusStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBusStops, setExpandedBusStops] = useState([]);

  //Function to get user's location and fetch bus stops
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      //If permission is not granted, show an alert
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      fetchBusStops(location.coords);
    })();
  }, []);

  //Use effect to refresh bus arrival data every minute
  useEffect(() => {
    const timer = setInterval(() => {
      if (expandedBusStops.length > 0) {
        //If any bus stop is expanded, refresh their arrival data every minute
        expandedBusStops.forEach((busStopCode) => fetchBusArrivals(busStopCode));
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [expandedBusStops]);

  //Function to fetch all bus stops
  const fetchAllBusStops = async () => {
    let allBusStops = [];
    let skip = 0;
    const limit = 500;

    //Loop through all pages of bus stops
    while (true) {
      //HTTP GET request to LTA Datamall API for bus stops
      const response = await axios.get('https://datamall2.mytransport.sg/ltaodataservice/BusStops', {
        headers: {
          AccountKey: 'LtSf6eTESX+gPi4BHLZfMQ==',
        },
        params: {
          $skip: skip,
          $top: limit,
        },
      });

      const busStops = response.data.value;
      allBusStops = [...allBusStops, ...busStops];

      if (busStops.length < limit) break; 

      skip += limit;
    }
    return allBusStops;
  };

  //Function to fetch bus stops
  const fetchBusStops = async (coords) => {
    try {
      const allBusStops = await fetchAllBusStops();
      //Calculate distance between user's location and bus stops
      const busStopsWithDistance = allBusStops.map((busStop) => {
        const distance = getDistance(
          { latitude: coords.latitude, longitude: coords.longitude },
          { latitude: busStop.Latitude, longitude: busStop.Longitude }
        );
        return { ...busStop, distance };
      });
      //Sort bus stops by distance
      const sortedBusStops = busStopsWithDistance.sort((a, b) => a.distance - b.distance);

      setBusStops(sortedBusStops);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bus stops:', error);
      setLoading(false);
    }
  };

  //Function to fetch bus arrivals
  const fetchBusArrivals = async (busStopCode) => {
    try {
      //HTTP GET request to LTA Datamall API for bus arrivals
      const response = await axios.get(`https://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`, {
        headers: {
          AccountKey: 'LtSf6eTESX+gPi4BHLZfMQ==',
        },
      });
      //Update bus stop with arrival data
      setBusStops((prevBusStops) =>
        prevBusStops.map((stop) =>
          stop.BusStopCode === busStopCode
            ? { ...stop, busArrivals: response.data.Services }
            : stop
        )
      );
    } catch (error) {
      console.error('Error fetching bus arrivals:', error);
    }
  };

  //Function to toggle bus stop expansion
  const toggleBusStop = async (busStopCode) => {
    if (expandedBusStops.includes(busStopCode)) {
      setExpandedBusStops(expandedBusStops.filter((code) => code !== busStopCode));
    } else {
      await fetchBusArrivals(busStopCode);
      setExpandedBusStops([...expandedBusStops, busStopCode]);
    }
  };

  //Function to format arrival time
  const formatArrivalTime = (estimatedArrival) => {
    if (!estimatedArrival) return 'N/A'; //Return N/A if no estimated arrival time
    const now = new Date();
    const arrivalTime = new Date(estimatedArrival);
    const diffInMinutes = Math.round((arrivalTime - now) / 60000); 

    //Return the arrival time in minutes or 'Arriving' if bus is arriving
    return diffInMinutes > 0 ? `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''}` : 'Arriving';
  };

  //Function to render bus arrival data
  const renderBusArrival = (busArrival) => (
    <View key={busArrival.ServiceNo} style={[styles.busArrivalRow, { backgroundColor: theme.secondaryColor }]}>
      <Text style={[styles.busServiceNo, { color: theme.textColor }]}>{busArrival.ServiceNo}</Text>
      <View style={styles.arrivalTimesContainer}>
        <Text style={[styles.arrivalTime, { color: theme.textColor }]}>
          {formatArrivalTime(busArrival.NextBus.EstimatedArrival)}
        </Text>
        <Text style={[styles.arrivalTime, { color: theme.textColor }]}>
          {formatArrivalTime(busArrival.NextBus2.EstimatedArrival)}
        </Text>
        <Text style={[styles.arrivalTime, { color: theme.textColor }]}>
          {formatArrivalTime(busArrival.NextBus3.EstimatedArrival)}
        </Text>
      </View>
    </View>
  );

  //Function to render bus stop data
  const renderBusStop = ({ item }) => (
    <View style={[styles.busStopContainer, { backgroundColor: theme.primaryColor }]}>
      <TouchableOpacity onPress={() => toggleBusStop(item.BusStopCode)}>
        <Text style={[styles.busStopName, { color: theme.textColor }]}>{item.Description}</Text>
        <Text style={[styles.busStopCode, { color: theme.textColor }]}>{item.BusStopCode}</Text>
      </TouchableOpacity>
      {expandedBusStops.includes(item.BusStopCode) && (
        <View style={styles.arrivalDetails}>
          {item.busArrivals && item.busArrivals.length > 0 ? (
            item.busArrivals.map(renderBusArrival)
          ) : (
            <Text style={[styles.noBusesText, { color: theme.textColor }]}>
              No buses available at this time.
            </Text>
          )}
        </View>
      )}
    </View>
  );
  
  //Return loading message while fetching bus stops
  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {loading && !expandedBusStops.length ? (
        <Text style={{ color: theme.textColor }}>Loading...</Text>
      ) : (
        <FlatList
          data={busStops}
          keyExtractor={(item) => item.BusStopCode}
          renderItem={renderBusStop}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  busStopContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  busStopName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  busStopCode: {
    fontSize: 14,
  },
  arrivalDetails: {
    marginTop: 10,
  },
  busArrivalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  busServiceNo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  arrivalTimesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    marginLeft: 10,
  },
  arrivalTime: {
    fontSize: 20,
  },
  noBusesText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default BusArrivalScreen;
