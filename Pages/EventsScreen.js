import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Event from '../Components/Event';
import { format, isToday } from 'date-fns';

const EventScreen = ({ events, darkMode }) => {
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);

  const filterEvents = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = events.filter((event) =>
      event.name && event.name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredEvents(filtered);
  };

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
    filterEvents();
  };

  const eventsByDay = {};

  filteredEvents.forEach((event) => {
    const eventDate = event.date;

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
      <TextInput
        style={[styles.searchBar, darkMode && styles.searchBarDark]}
        placeholder="Search events..."
        value={searchQuery}
        onChangeText={handleSearchInputChange}
        placeholderTextColor="#888" // Placeholder text color
      />
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
    backgroundColor: '#333',
    color: '#fff',
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
    backgroundColor: '#333',
  },
  toggleButtonText: {
    fontSize: 18,
    color: '#555',
  },
  toggleButtonTextDark: {
    color: '#fff',
  },
  eventList: {
    flex: 1,
    width: '100%',
  },
  searchBar: {
    paddingHorizontal: 20,
    paddingVertical: 15, // Increase the vertical padding
    backgroundColor: '#f2f2f2',
    borderRadius: 16, // Increase border radius
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18, // Increase font size
  },
  searchBarDark: {
    backgroundColor: '#333',
    color: '#fff',
  },
});

export default EventScreen;
