import React, { useState, useRef } from 'react'; // Import useRef
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Touchable,
  Platform
} from 'react-native';
import Event from '../Components/Event';
import { Button, SearchBar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

const EventScreen = ({ events, pages, darkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);

  // Use useRef to get a reference to the dropdown component
  const dropdownRef = useRef();

  const filterEvents = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = events.filter(
      (event) =>
        (event.name && event.name.toLowerCase().includes(lowerCaseQuery)) ||
        event.provider.includes(lowerCaseQuery) ||
        event.location.includes(lowerCaseQuery)
    );

    const filteredByProvider = selectedProvider
      ? filtered.filter((event) => event.provider === selectedProvider)
      : filtered;

    setFilteredEvents(filteredByProvider);
  };

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
    filterEvents();
  };

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
    filterEvents();
  };

  const handleFilterErase = () => {
    setSearchQuery('');
    setSelectedProvider('');
    filterEvents();
    // Close the dropdown when the filter is erased
    dropdownRef.current && dropdownRef.current.hide();
  };

  const eventsByDay = {};

  filteredEvents.forEach((event) => {
    const eventDate = event.date;

    if (!eventDate) {
      return;
    }

    const formattedDate = `${eventDate.getDate()}.${eventDate.getMonth() + 1}.${eventDate.getFullYear()}`;

    if (!eventsByDay[formattedDate]) {
      eventsByDay[formattedDate] = [];
    }

    eventsByDay[formattedDate].push(event);
  });

  function translate(a){
    const dayMap = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return dayMap[a];
}

  const eventSections = Object.entries(eventsByDay).map(([day, dayEvents]) => (
    <View key={day}>
      <Text style={[styles.dayHeader, darkMode && styles.dayHeaderDark]}>
        {day == new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + new Date().getFullYear() ? "Today" : day + " (" + translate(dayEvents[0].date.getDay()) + ")"}
      </Text>
      {dayEvents.map((event) => (
        <Event key={event.id} event={event} darkMode={darkMode} />
      ))}
    </View>
  ));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.filterContainer}>
        <SearchBar
            style={darkMode ? styles.SearchBarDark : styles.SearchBar}
            containerStyle={darkMode ? styles.containerDark : styles.SearchBar}
            inputContainerStyle={darkMode ? styles.SearchBarDark : styles.SearchBar}
            placeholder="Search events..."
            onChangeText={handleSearchInputChange}
            onCancel={handleFilterErase}
            onChange={handleSearchInputChange}
            value={searchQuery}
            platform={Platform.OS === 'ios' ? 'ios' : 'android'}
      />
      </View>
        <ScrollView 
            style={styles.eventList}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            
        
            {eventSections}
        
        </ScrollView>
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
  eventList: {
    flex: 1,
    width: '100%',
  },
  filterContainer: {
    marginHorizontal: 10,
  },
  dropdownContainer: {
    width: 150,
    maxHeight: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Centra verticalmente gli elementi nella riga
    marginVertical: 10, // Aggiunge margine sopra e sotto alla riga
  },
  dropdownText: {
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  SearchBarDark: {
    backgroundColor: '#333',
    color: '#fff',
  },
  dropdownContainer: {
    width: 150,
    maxHeight: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  trashButton: {
    marginLeft: 10, // Aggiunge margine sinistro tra il dropdown e l'icona del cestino
  },
});

export default EventScreen;
