import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './theme.js';

import WelcomeScreen from './screens/WelcomeScreen';
import ExploreScreen from './screens/HomeScreen';
import TaxiScreen from './screens/TaxiScreen';
import BusArrivalScreen from './screens/BusArrivalScreen';
import SettingsScreen from './screens/SettingsScreen';
import DirectionsScreen from './screens/DirectionsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//Stack Navigator for Home
function HomeStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          headerStyle: {
            backgroundColor: theme.headerBackgroundColor,
          },
          headerTintColor: theme.headerTintColor,
        }}
      />
    </Stack.Navigator>
  );
}

//Stack Navigator for Bus Timing
function BusTimingStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BusTiming"
        component={BusArrivalScreen}
        options={{
          title: 'Bus Arrival',
          headerStyle: {
            backgroundColor: theme.headerBackgroundColor,
          },
          headerTintColor: theme.headerTintColor,
        }}
      />
    </Stack.Navigator>
  );
}

//Stack Navigator for Directions
function DirectionsStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DirectionScreen"
        component={DirectionsScreen}
        options={{
          title: 'Directions',
          headerStyle: {
            backgroundColor: theme.headerBackgroundColor,
          },
          headerTintColor: theme.headerTintColor,
        }}
      />
    </Stack.Navigator>
  );
}

//Stack Navigator for Taxi
function TaxiStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TaxiScreen"
        component={TaxiScreen}
        options={{
          title: 'Taxi Availability',
          headerStyle: {
            backgroundColor: theme.headerBackgroundColor,
          },
          headerTintColor: theme.headerTintColor,
        }}
      />
    </Stack.Navigator>
  );
}

//Stack Navigator for Settings
function SettingsStack() {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: theme.headerBackgroundColor,
          },
          headerTintColor: theme.headerTintColor,
        }}
      />
    </Stack.Navigator>
  );
}

//Main tab navigator
function AppNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarIcon: ({ color, size }) => {
          let iconName;

          //Set the icon based on the route name
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Taxi') {
            iconName = 'car-outline';
          } else if (route.name === 'Bus Timing') {
            iconName = 'bus-outline';
          } else if (route.name === 'Directions') {
            iconName = 'walk-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        //Set colours for tab bar
        tabBarActiveTintColor: theme.tabBarActiveTintColor,
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
        tabBarInactiveBackgroundColor: theme.backgroundColor,
        tabBarActiveBackgroundColor: theme.backgroundColor,
      })}
    >
      <Tab.Screen name="Bus Timing" component={BusTimingStack} />
      <Tab.Screen name="Directions" component={DirectionsStack} />
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Taxi" component={TaxiStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}

//Main app container
function AppContainer() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1 }}>    
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AppNavigator"
              component={AppNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      <SafeAreaView style={[styles.bottomSafeArea, { backgroundColor: theme.backgroundColor }]} />
    </View>
  );
}

//Main app component
export default function App() {
  return (
    <ThemeProvider>
      <AppContainer />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  bottomSafeArea: {
    flex: 0,
  },
});