import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import Event from '../Components/Event';
import { SearchBar } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const EventScreen = ({ events, pages, darkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(null);

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
    setDate(date);
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
  };
  useEffect(() => {
    filterEvents();
  }, [searchQuery]);

  const handleFilterErase = () => {
    setDate(null);
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
          style={darkMode ? styles.SearchBarDarkContainer : styles.SearchBar}
          containerStyle={[styles.SearchBar, darkMode && styles.SearchBarDark]}
          inputContainerStyle={darkMode ? styles.SearchBarDarkContainer : styles.SearchBar}
          placeholder="Search events..."
          onChangeText={handleSearchInputChange}
          onCancel={handleFilterErase}
          onClear={handleFilterErase}
          value={searchQuery}
          platform={Platform.OS === 'ios' ? 'ios' : 'android'}
        />
        {date == null ? (
          <Icon
            name="calendar"
            size={30}
            color={darkMode ? '#fff' : '#000'}
            style={{ alignSelf: 'center' }} // adjust the style as per your requirement
            onPress={showDatePicker} // handle date picker here
          />
        ) : (
          <Icon
            name="trash"
            size={30}
            color={darkMode ? '#fff' : '#000'}
            style={{ alignSelf: 'center' }} // adjust the style as per your requirement
            onPress={handleFilterErase} // handle date picker here
          />
        )}
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
      ) : 
      (searchQuery == "" && date == null) ? (
        <Text style={[styles.noEventsText, darkMode && styles.noEventsTextDark]}>Loading...</Text>
      ) : (
        <Text style={[styles.noEventsText, darkMode && styles.noEventsTextDark]}>No events found</Text>
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
    flexDirection: 'row',
  },
  dropdownContainer: {
    width: 150,
    maxHeight: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  SearchBarDarkContainer:{
    backgroundColor: '#333',
    color: '#fff',
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
    backgroundColor: '#000',
    color: '#fff',
  },
  SearchBar: {
    width: '88%',
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
  noEventsTextDark: {
    color: '#fff',
  },
});

export default EventScreen;
