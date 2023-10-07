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
  },
  {
    name: "Oh My Prague",
    url: "https://www.tickettailor.com/events/ohmypragueparties",
  },
  {
    name: "Oh My Prague - Trips",
    url: "https://www.tickettailor.com/events/ohmyprague?fbclid=PAAaYkX_r77zY2LTaneP63d4J5uU5Kwdr0gwKRkYt6VW90cg_UEIQBIIO3shI_aem_AWYNHQD9VHFatYLDZlCzjfsfapccULlEOsgT5iQM-tFyarDRrqdszFGQuzOKGifxgh4",
  }
];

export default function App() {
  const [events, setEvents] = useState([]);

  async function fetchWebsiteData() {
    var counter = 0;
    try {
      const allEvents = []; // Creare un array separato per tutti gli eventi
      for(var i = 0; i < pages.length; i++){
        const response = await axios.get(pages[i].url);
        const $ = cheerio.load(response.data);
        const eventElements = $('.row.event_listing');
        eventElements.each((index, element) => {
          const $event = $(element);
          const id = counter++;
          const name = $event.find('.name').text();
          const date = $event.find('.date_and_time').text();
          const location = $event.find('.venue').text();
          const image = $event.find('.event_image img').attr('src');
          const soldout = $event.find('.event_details .event_cta').text();
          console.log("Soldout?" + soldout);
          //const price = "0";
          const link = "https://www.tickettailor.com" + $event.find('a').attr('href');
          if(name != "ERASMUS CARD - OFFICIAL") {
            allEvents.push({ id, name, date, location, image, soldout, link });
          }
        });
      }
      return allEvents; // Restituire tutti gli eventi raccolti
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
          options={{
            tabBarLabel: 'Events',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" color={color} size={size} />
            ),
          }}
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
