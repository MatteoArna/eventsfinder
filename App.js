import React, { useState, useEffect, useRef } from 'react';
import { Appearance, Touchable, TouchableOpacity } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import 'react-native-gesture-handler';

import EventsScreen from './src/views/EventsScreen';
import SettingsScreen from './src/views/SettingsScreen';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataFetcher } from './src/api/cheerio/DataFetcher';
import i18n from './src/api/i18n/i18n';

const Tab = createBottomTabNavigator();

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    text: '#000',
  },
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#777',
    text: '#fff',
  },
};

export default function App() {
  const [events, setEvents] = useState([]);
  const colorScheme = Appearance.getColorScheme(); // Get the current color scheme (light or dark)
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);
  
  const handleEventUpdate = (events) => {
    // Do something with the event data here
    setEvents(events);
  };

  // Function to toggle between light and dark mode
  const toggleDarkMode = () => {
    // Toggle dark mode state
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };
  
useEffect(() => {
    DataFetcher.fetch()
      .then((result) => {
        setEvents(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={{
          style: {
            backgroundColor: theme.colors.background,
          },
          labelStyle: {
            color: theme.colors.text,
          },
        }}
      >
        <Tab.Screen
          name="Events"
          component={() => (
            <EventsScreen onEventUpdate={handleEventUpdate} events={events} darkMode={theme === darkTheme}/>
          )}
          options={{
            tabBarLabel: i18n.t('events'),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" color={color} size={size} />
            ),
            headerShown: false,
            tabBarPress: () => {
              if (flatListRef.current) {
                flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
              }
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={() => <SettingsScreen darkMode={theme === darkTheme} toggleDarkMode={toggleDarkMode} />}
          options={{
            tabBarLabel: i18n.t('settings'),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="hammer-wrench" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  </GestureHandlerRootView>
);
}