import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Image } from 'react-native-elements';
import EventDetail from './EventDetail.js';

const Event = ({ event, darkMode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePress = () => {
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
      <Card
          containerStyle={[
            styles.eventCard,
            darkMode && styles.darkModeCard,
          ]}
        >
          <Image
            resizeMode="cover"
            source={{ uri: event.image }}
            alt="event image"
            style={styles.eventImage}
          />
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventProvider}>{event.provider}</Text>
          </View>
        </Card>
      </TouchableOpacity>
      <EventDetail event={event} darkMode={darkMode} isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  eventCard: {
    overflow: 'hidden',
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  darkModeCard: {
    backgroundColor: '#000',
    borderColor: '#000',
    borderRadius: 10,
  },
  eventImage: {
    width: 180,
    height: 150,
    borderRadius: 10,
  },
  eventDetails: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventProvider: {
    fontSize: 14,
    color: '#fff',
  },
});

export default Event;
