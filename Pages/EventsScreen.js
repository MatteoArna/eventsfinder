import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import Event from '../Components/Event';
import { SearchBar } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const EventScreen = ({ events, pages, darkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const dropdownRef = useRef();

  const filterEvents = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = events.filter(
      (event) =>
        event.name.toLowerCase().includes(lowerCaseQuery) ||
        event.provider.toLowerCase().includes(lowerCaseQuery) ||
        event.location.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredEvents(filtered);
  };

  const handleConfirm = (date) => {
    const filtered = events.filter(
      (event) =>
        event.date != null &&
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );

    setFilteredEvents(filtered);
    hideDatePicker();
  };

  const handleSearchInputChange = (query) => {
    setSearchQuery(query);
    filterEvents();
  };

  const handleFilterErase = () => {
    setSearchQuery('');
    setFilteredEvents(events);
    filterEvents();
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

  function translate(a) {
    const dayMap = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return dayMap[a];
  }

  const eventSections = Object.entries(eventsByDay).map(([day, dayEvents]) => (
    <View key={day}>
      <Text style={[styles.dayHeader, darkMode && styles.dayHeaderDark]}>
        {day == `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`
          ? 'Today'
          : `${day} (${translate(dayEvents[0].date.getDay())})`}
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
          value={searchQuery}
          platform={Platform.OS === 'ios' ? 'ios' : 'android'}
        />
        <View style={styles.rowContainer}>
          <Button
            title="Select date"
            onPress={showDatePicker}
            style={styles.datePickerButton}
          />
          <Button
            title="Show all"
            onPress={handleFilterErase}
            style={styles.datePickerButton}
          />
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {eventSections.length > 0 ? (
        <FlatList
          data={eventSections}
          renderItem={({ item }) => item}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <Text style={styles.noEventsText}>No events found</Text>
      )}
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
    alignItems: 'center',
    marginVertical: 10,
  },
  SearchBarDark: {
    backgroundColor: '#333',
    color: '#fff',
  },
  trashButton: {
    marginLeft: 10,
  },
  datePickerButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EventScreen;
