import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../theme.js';

const WelcomeScreen = ({ navigation }) => {
  //Get the app theme
  const { theme } = useTheme();

  //When the user taps on the Get Started button, navigate to app navigator
  const handleGetStarted = () => {
    navigation.replace('AppNavigator');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.slogan, { color: theme.textColor }]}>
        Stay ahead on the go{'\n'}Singapore’s transport, simplified.
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primaryColor }]}
        onPress={handleGetStarted}
      >
        <Text style={[styles.buttonText, { color: theme.headerTintColor }]}>
          Get Started
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 100,
  },
  logo: {
    width: 400, 
    height: 350, 
    marginTop: 'auto',
  },
  slogan: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical:20,
    paddingHorizontal: 70,
    borderRadius: 25,
    marginBottom: 'auto',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
