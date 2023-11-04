import React, { useState, useEffect } from 'react';
import { ScrollView, View,SafeAreaView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import _ from 'lodash';

import HorizontalSection from '../components/HorizontalSection';
import CustomSearchBar from '../components/CustomSearchBar';
import VerticalSection from '../components/VerticalSection';

import i18n from '../api/i18n/i18n';
import { DataFetcher } from '../api/cheerio/DataFetcher';

const EventsScreen = ({ events, darkMode, onEventUpdate }) => {
  const [todayEvents, setTodayEvents] = useState([]);
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [dateEvents, setDateEvents] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchData = async () => {
    try {
      const eventData = await DataFetcher.fetch();
      onEventUpdate(eventData);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchData();
    }, 2000);
  };

  const debouncedSearch = _.debounce(async (text) => {
    setIsSearching(true);
    const filteredEvents = events.filter((event) => {
      const eventTitle = event.name.toLowerCase();
      const eventLocation = event.location.toLowerCase();
      const searchTextLower = text.toLowerCase();
      return eventTitle.includes(searchTextLower) || eventLocation.includes(searchTextLower);
    });
    setIsSearching(false);
    setDateEvents(filteredEvents);
  }, 300);

  const onSearch = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const onClear = (text) => {
    setSearchText('');
  };

  useEffect(() => {
    const today = new Date();
    const filteredTodayEvents = events.filter((event) => {
      const eventDate = event.date;
      if (!eventDate) return false;
      return eventDate.toDateString() === today.toDateString();
    });
    setTodayEvents(filteredTodayEvents);

    const filteredSuggestedEvents = events.filter((event) => {
      return event.provider === 'Warehouse Entertainment';
    });
    setSuggestedEvents(filteredSuggestedEvents);
  }, [events]);

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
  <CustomSearchBar
    darkMode={darkMode}
    onSearch={onSearch}
    onClear={onClear}
  />
  <ScrollView
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
  >
    {searchText ? (
      <VerticalSection
        darkMode={darkMode}
        title={i18n.t('allEvents')}
        events={dateEvents}
      />
    ) : (
      <View>
        <HorizontalSection
          darkMode={darkMode}
          title={i18n.t('today')}
          events={todayEvents}
        />
        <HorizontalSection
          darkMode={darkMode}
          title={i18n.t('suggestedEvents')}
          events={suggestedEvents}
        />
        <VerticalSection
          darkMode={darkMode}
          title={i18n.t('allEvents')}
          events={events}
        />
      </View>
    )}
    
  </ScrollView>
  {isSearching && <ActivityIndicator size="small" color="#0000ff" />}
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
});

export default EventsScreen;
