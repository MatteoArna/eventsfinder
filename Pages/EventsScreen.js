import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Event from '../Components/Event';
import { format, isToday } from 'date-fns';

const EventScreen = ({ events, darkMode }) => {
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

    if (provider == 'MAD PRG') {
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

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = parseEventDate(a.date, a.provider);
    const dateB = parseEventDate(b.date, b.provider);
    return dateA - dateB;
  });

  const [onlyStarred, setOnlyStarred] = useState(false);

  const filteredEvents = onlyStarred
    ? sortedEvents.filter((event) => event.starred)
    : sortedEvents;

  const eventsByDay = {};

  filteredEvents.forEach((event) => {
    const eventDate = parseEventDate(event.date, event.provider);

    if (!eventDate) {
      return;
    }

    const formattedDate = `${eventDate.getDate()}.${
      eventDate.getMonth() + 1
    }.${eventDate.getFullYear()}`;

    if (!eventsByDay[formattedDate]) {
      eventsByDay[formattedDate] = [];
    }

    eventsByDay[formattedDate].push(event);
  });

  const eventSections = Object.entries(eventsByDay).map(([day, dayEvents]) => (
    <View key={day}>
      <Text style={[styles.dayHeader, darkMode && styles.dayHeaderDark]}>
        {isToday(new Date(day)) ? 'Today' : day}
      </Text>
      {dayEvents.map((event) => (
        <Event key={event.id} event={event} darkMode={darkMode} />
      ))}
    </View>
  ));

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <TouchableOpacity
        style={[styles.toggleButton, darkMode && styles.toggleButtonDark]}
        onPress={() => {
          setOnlyStarred((prev) => !prev);
        }}
      >
        <Text
          style={[styles.toggleButtonText, darkMode && styles.toggleButtonTextDark]}
        >
          {onlyStarred ? 'Show All' : 'Only Starred'}
        </Text>
      </TouchableOpacity>
      <ScrollView style={styles.eventList}>{eventSections}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  dayHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f2f2f2',
  },
  dayHeaderDark: {
    backgroundColor: '#333', // Dark mode background color
    color: '#fff', // Dark mode text color
  },
  toggleButton: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  toggleButtonDark: {
    backgroundColor: '#333', // Dark mode background color
  },
  toggleButtonText: {
    fontSize: 18,
    color: '#555',
  },
  toggleButtonTextDark: {
    color: '#fff', // Dark mode text color
  },
  eventList: {
    flex: 1,
    width: '100%',
  },
});

export default EventScreen;