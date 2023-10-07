import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import cheerio from 'cheerio';

import HomeScreen from './Pages/HomeScreen';
import EventsScreen from './Pages/EventsScreen';
import SettingsScreen from './Pages/SettingsScreen';

const Tab = createBottomTabNavigator();
const pages = [
  { 
    name: "Erasmus in Prague",
    url: "https://www.tickettailor.com/events/erasmusinprague",
  }
];

export default function App() {
  const [events, setEvents] = useState([]);

  async function fetchWebsiteData() {
    try {
      const response = await axios.get(pages[0].url);
      const $ = cheerio.load(response.data);
      const eventElements = $('.row.event_listing');
      const events = [];

      eventElements.each((index, element) => {
        const $event = $(element);
        const id = index;
        const name = $event.find('.name').text();
        const date = $event.find('.date_and_time').text();
        const location = $event.find('.venue').text();
        const image = $event.find('.event_image img').attr('src');
        const price = "0";
        const link = "https://www.tickettailor.com" + $event.find('a').attr('href');
        events.push({ id, name, date, location, image, price, link });
      });

      return events;
    } catch (error) {
      console.error('Errore durante il web scraping:', error);
      throw error;
    }
  }

  useEffect(() => {
    fetchWebsiteData()
      .then(result => {
        setEvents(result);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Events"
          component={() => <EventsScreen events={events} />}
          //component={EventsScreen}
          options={{
            tabBarLabel: 'Events',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" color={color} size={size} />
            ),
          }}
          //initialParams={{ events: events }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='hammer-wrench' color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
