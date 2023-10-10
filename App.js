import React, { useState, useEffect } from 'react';
import { Appearance, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import cheerio from 'cheerio';
import 'react-native-gesture-handler';

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
  },
  {
    name: "Erasmusland",
    url: "https://www.tickettailor.com/events/wprgentertainment?fbclid=PAAaYR29VELVHVGUIREwoYbVb55eMhKHMwFuHyk_1ESi-YTRhwFgDPOatkK-U_aem_AQ3sZr8zbJg36ujbeNwRCkijCflGizs53rbbebN2-w7_hJ5QavaN1ezXt-LCNAnd2qI",
  },
  {
    name: "MAD PRG",
    url: "https://www.tickettailor.com/events/madprg?fbclid=PAAaaPHxZdrH21ObFXdnm0zco4eWtd0eMwBtpNABibRabXW6cpwZqsUeJmIZ0_aem_AaLO0labdYPmgErcxs5jvY5HQODYWsl2fRajzEB1hockmyYLNT2oQw3dLlhUCfKY7as",
  }
];

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

  // Function to toggle between light and dark mode
  const toggleDarkMode = () => {
    // Toggle dark mode state
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  function parseEventDate(inputDate, provider) {
    const monthMap = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const parts = inputDate.split(' ');

    if (
      parts.includes('Multiple') &&
      parts.includes('dates') &&
      parts.includes('times')
    ) {
      return null;
    }

    if (provider === 'MAD PRG') {
      const day = parseInt(parts[2], 10);
      const month = monthMap[parts[1]];
      const year = new Date().getFullYear();
      const isNextYear = month < new Date().getMonth();

      if (isNextYear) {
        year++;
      }
      return new Date(year, month, day);
    } else {
      const day = parseInt(parts[1], 10);
      const month = monthMap[parts[2]];
      const isNextYear = month < new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const year = isNextYear ? currentYear + 1 : currentYear;
      return new Date(year, month, day);
    }
  }

  async function fetchWebsiteData() {
    var counter = 0;
    try {
      const allEvents = []; // Create a separate array for all events
      for(var i = 0; i < pages.length; i++){
        const response = await axios.get(pages[i].url);
        const $ = cheerio.load(response.data);
        const eventElements = $('.row.event_listing');
        eventElements.each((index, element) => {
          const $event = $(element);
          const id = counter++;
          const name = $event.find('.name').text();
          const date = parseEventDate($event.find('.date_and_time').text(), pages[i].name);
          const location = $event.find('.venue').text();
          const image = $event.find('.event_image img').attr('src');
          const soldout = $event.find('.event_details .event_cta').text();
          const provider = pages[i].name;

          const link = "https://www.tickettailor.com" + $event.find('a').attr('href');
          if(name != "ERASMUS CARD - OFFICIAL") {
            allEvents.push({ id, name, date, location, image, soldout, link, provider });
          }
        });
      }


      const sortedEvents = [...allEvents].sort((a, b) => {
        return a.date - b.date;
      });

      return sortedEvents; // Return all collected events
    } catch (error) {
      console.error('Errore durante il web scraping:', error);
      throw error;
    }
  }
useEffect(() => {
    fetchWebsiteData()
      .then((result) => {
        setEvents(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        tabBarOptions={{
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
          component={() => <EventsScreen events={events} pages={pages} darkMode={theme === darkTheme} />}
          options={{
            tabBarLabel: 'Events',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={() => (
            <SettingsScreen darkMode={theme === darkTheme} toggleDarkMode={toggleDarkMode} />
          )}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="hammer-wrench" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}