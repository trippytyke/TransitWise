// theme.js
import React, { createContext, useState, useContext } from 'react';

// Define your light and dark theme styles
export const lightTheme = {
  backgroundColor: '#f1e4e7',
  textColor: '#0d0809',
  tabBarActiveTintColor: '#be0930',
  tabBarInactiveTintColor: '#888',
  headerBackgroundColor: '#be0930',
  headerTintColor: '#ffffff',
  primaryColor: '#cd4260',
  secondaryColor: '#ed879d',
};

export const darkTheme = {
  backgroundColor: '#232323',
  textColor: '#f7f2f3',
  tabBarActiveTintColor: '#be0930',
  tabBarInactiveTintColor: '#888',
  headerBackgroundColor: '#be0930',
  headerTintColor: '#ffffff',
  primaryColor: '#bd3250',
  secondaryColor: '#781228',
  
};

// Create a Theme Context
const ThemeContext = createContext();

// ThemeProvider component that will wrap your app
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
