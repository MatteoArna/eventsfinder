import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import Event from './Event';

const HorizontalSection = ({ title, events, darkMode }) => {
  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <Text style={[styles.title, darkMode && styles.titleDark]}>{title}</Text>
      <FlatList
        data={events}
        renderItem={({ item }) => <Event event={item} darkMode={darkMode} />}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        contentContainerStyle={styles.eventList}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5, // Adjusted padding
    marginBottom: 20,
    backgroundColor: '#fff', // Set a background color here
  },
  containerDark: {
    paddingHorizontal: 5,
    marginBottom: 20,
    backgroundColor: '#333', // Set an appropriate background color here for dark mode
  },
  title: {
    marginTop:10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleDark: {
    color: '#fff',
  },
  eventList: {
    marginVertical: 10,
  },
});

export default HorizontalSection;
