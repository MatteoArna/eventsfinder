import React, { useState, useEffect, Children } from 'react';
import { Appearance, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import cheerio from 'cheerio';
import 'react-native-gesture-handler';

import EventsScreen from './Pages/EventsScreen';
import SettingsScreen from './Pages/SettingsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
  },
  {
    name: "Duplex",
    url: "https://www.duplex.cz/allevents",
  },
  {
    name: "Epic, Prague",
    url: "https://www.epicprague.com/en/program",
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
    } else if (provider == "Duplex"){
      const monthMap = {
        JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
        JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
      };
      
      const [monthAbbreviation, day] = parts.map(part => part.toUpperCase());
      const currentYear = new Date().getFullYear();
      const currentDate = new Date();
      
      let eventDate = new Date(currentYear, monthMap[monthAbbreviation] - 1, parseInt(day, 10));
      
      if (currentDate > eventDate) {
        // If the date has passed, set it for the next year
        eventDate = new Date(currentYear + 1, monthMap[monthAbbreviation] - 1, parseInt(day, 10));
      }
      
      return eventDate;
    }else{
      const day = parseInt(parts[1], 10);
      const month = monthMap[parts[2]];
      const isNextYear = month < new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const year = isNextYear ? currentYear + 1 : currentYear;
      return new Date(year, month, day);
    }
  }

  async function fetchWebsiteData() {
    try {
      const allEvents = [];
      var counter = 0;
      const promises = pages.map(async (page) => {
        const response = await axios.get(page.url);
        const $ = cheerio.load(response.data);

        if (page.name === "Duplex") {
          const eventElements = $('.row .eventRow');
          eventElements.each((index, element) => {
            const $event = $(element);
            const id = counter++;
            const name = $event.find('.event_title').text().split(" – ")[0];
            const sdate = $event.find('.event_date .month').text() + " " + $event.find('.event_date .date').text();
            const date = parseEventDate(sdate, page.name);
            const imageUrl = $event.find('img.img_placeholder').attr('src');
            const link = $event.find('a.event_title_link').attr('href');
            allEvents.push({ id, name, date, location: "Duplex", image: imageUrl, soldout: "Available", link, provider: page.name });
          });
        } else if (page.name === "Epic, Prague") {
          const eventElements = $('.program__item');
          eventElements.each((index, element) => {
            const $event = $(element);
            const id = counter++;
            const name = $event.find('.program__item-heading a').text().trim();
            if (!name) return;
            const sdate = $event.find('time.program__item-datetime a').text().trim();
            const [day, month, year] = sdate.split('/');
            const date = new Date(year.substring(0, 4), month - 1, day);
            let image = $event.find('.program__item-image.m-grey').css('background-image');
            image = image.substring(5, image.length - 1).replace(/\\/g, "");
            image = "https://www.epicprague.com" + image;
            const link = "https://www.epicprague.com" + $event.find('.program__item-heading a').attr('href');
            allEvents.push({ id, name, date, location: "Epic Prague", image, soldout: "Available", link, provider: page.name });
          });
        } else {
          const eventElements = $('.row.event_listing');
          eventElements.each((index, element) => {
            const $event = $(element);
            const id = counter++;
            const name = $event.find('.name').text();
            const date = parseEventDate($event.find('.date_and_time').text(), page.name);
            const location = $event.find('.venue').text();
            const image = $event.find('.event_image img').attr('src');
            const soldout = $event.find('.event_details .event_cta').text();
            const provider = page.name;
            const link = "https://www.tickettailor.com" + $event.find('a').attr('href');
            if (name !== "ERASMUS CARD - OFFICIAL") {
              allEvents.push({ id, name, date, location, image, soldout, link, provider });
            }
          });
        }
  
      });
  
      await Promise.all(promises);
      
      const sortedEvents = allEvents.sort((a, b) => a.date - b.date);
      return sortedEvents;
    } catch (error) {
      console.error('Error during web scraping:', error);
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
        }
      }
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
    </GestureHandlerRootView>
  );
}