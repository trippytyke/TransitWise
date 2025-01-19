import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { useTheme } from '../theme';

const DirectionsScreen = () => {
  //Get the app theme
  const { theme } = useTheme(); 

  //State variables
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [directions, setDirections] = useState(null);
  const [reverseGeocodedAddresses, setReverseGeocodedAddresses] = useState({});

  //Function to fetch autocomplete suggestions
  const fetchSuggestions = async (input, setSuggestions) => {
    if (input.length > 2) {
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
          params: {
            input,
            key: 'AIzaSyAFhbzL8CecubEuRv6noThAqaD0hsYg3WY', 
            language: 'en',
            components: 'country:SG',
          },
        });
        setSuggestions(response.data.predictions);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  //Function to handle place selection
  const handleSelect = (place, setLocation, setSuggestions, setSelected) => {
    setSelected(place);
    setLocation(place.description);
    setSuggestions([]);
  };

  //Function to fetch reverse geocode to get address from coordinates
  const fetchReverseGeocode = async (lat, lng) => {
    try { //HTTP GET request to Google Maps API for geocode
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${lat},${lng}`,
          key: 'AIzaSyAFhbzL8CecubEuRv6noThAqaD0hsYg3WY', 
        },
      });
      return response.data.results[0]?.formatted_address || `${lat}, ${lng}`;
    } catch (error) {
      console.error('Error fetching reverse geocode:', error);
      return `${lat}, ${lng}`; //Return the coordinates if reverse geocode fails
    }
  };
  //Function to fetch directions
  const fetchDirections = async () => {
    if (selectedStart && selectedEnd) {
      try { //HTTP GET request to Google Maps API for directions
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
          params: {
            origin: selectedStart.description,
            destination: selectedEnd.description,
            mode: 'transit',
            key: 'AIzaSyAFhbzL8CecubEuRv6noThAqaD0hsYg3WY',
          },
        });
        setDirections(response.data.routes[0]);

        //Fetch address for walking steps
        const newAddresses = {};
        for (const step of response.data.routes[0].legs[0].steps) {
          if (step.travel_mode === 'WALKING') { 
            const address = await fetchReverseGeocode(step.end_location.lat, step.end_location.lng);
            newAddresses[`${step.end_location.lat},${step.end_location.lng}`] = address;
          }
        }
        setReverseGeocodedAddresses(newAddresses);
      } catch (error) {
        console.error('Error fetching directions:', error);
      }
    }
  };

  //Function to render transit steps after fetching directions
  const renderTransitStep = (step, index) => {
    if (step.travel_mode === 'WALKING') {
      const endAddress = reverseGeocodedAddresses[`${step.end_location.lat},${step.end_location.lng}`];
      return (
        <Text key={`${step.start_location.lat}-${step.end_location.lng}-${index}`} style={[styles.directionStep, { color: theme.textColor }]}>
          Walk {step.distance.text} towards {endAddress || `${step.end_location.lat}, ${step.end_location.lng}`}
        </Text>
      );
    } else if (step.travel_mode === 'TRANSIT') {
      const transitDetails = step.transit_details;
      return (
        <View key={`${transitDetails.line.short_name}-${index}`} style={[styles.transitStep, { backgroundColor: theme.secondaryColor }]}>
          <Text style={[styles.transitInstruction, { color: theme.textColor }]}>
            Take {transitDetails.line.vehicle.name} {transitDetails.line.short_name} ({transitDetails.line.name})
          </Text>
          <Text style={[styles.transitInstruction, { color: theme.textColor }]}>
            Board at: {transitDetails.departure_stop.name} at {transitDetails.departure_time.text}
          </Text>
          <Text style={[styles.transitInstruction, { color: theme.textColor }]}>
            Alight at: {transitDetails.arrival_stop.name} at {transitDetails.arrival_time.text}
          </Text>
          <Text style={[styles.transitInstruction, { color: theme.textColor }]}>
            Number of Stops: {transitDetails.num_stops}
          </Text>
          <Text style={[styles.transitInstruction, { color: theme.textColor }]}>
            Estimated Duration: {step.duration.text}
          </Text>
        </View>
      );
    }
  };
  

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <TextInput
        style={[styles.input, { borderColor: theme.primaryColor, color: theme.textColor }]}
        placeholder="Enter starting location"
        placeholderTextColor={theme.textColor}
        value={startLocation}
        onChangeText={(text) => {
          setStartLocation(text);
          fetchSuggestions(text, setStartSuggestions);
        }}
      />
      {startSuggestions.length > 0 && (
        <FlatList
          data={startSuggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item, setStartLocation, setStartSuggestions, setSelectedStart)}>
              <Text style={[styles.suggestion, { color: theme.textColor }]}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <TextInput
        style={[styles.input, { borderColor: theme.primaryColor, color: theme.textColor }]}
        placeholder="Enter destination"
        placeholderTextColor={theme.textColor}
        value={endLocation}
        onChangeText={(text) => {
          setEndLocation(text);
          fetchSuggestions(text, setEndSuggestions);
        }}
      />
      {endSuggestions.length > 0 && (
        <FlatList
          data={endSuggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item, setEndLocation, setEndSuggestions, setSelectedEnd)}>
              <Text style={[styles.suggestion, { color: theme.textColor }]}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Button title="Get Directions" onPress={fetchDirections} color={theme.primaryColor} />
      {directions && (
        <ScrollView style={styles.directionsContainer}>
          <Text style={[styles.directionText, { color: theme.textColor }]}>Total Distance: {directions.legs[0].distance.text}</Text>
          <Text style={[styles.directionText, { color: theme.textColor }]}>Total Duration: {directions.legs[0].duration.text}</Text>
          {directions.legs[0].steps.map((step, index) => renderTransitStep(step, index))}

        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
  },
  directionsContainer: {
    marginTop: 20,
  },
  directionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  directionStep: {
    fontSize: 14,
    marginVertical: 5,
  },
  transitStep: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
  transitInstruction: {
    fontSize: 14,
  },
});

export default DirectionsScreen;
