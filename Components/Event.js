import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Card, Image, Icon, Button } from 'react-native-elements';
import { Linking } from 'react-native';
import openMap from 'react-native-open-maps';

const Event = ({ id, event, darkMode }) => {

  const handlePress = async () => {
    const url = event.link;

    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error(`Impossibile aprire l'URL: ${url}`);
      }
    }
  };

  return (
    <Card
      containerStyle={[
        styles.eventCard,
        event.soldout.includes("Sold out") && styles.soldOutCard,
        darkMode && styles.darkModeCard,
      ]}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="cover"
            source={{ uri: event.image }}
            alt='immagine evento'
            style={styles.eventImage}
          />
        </View>
        <View style={styles.eventDetails}>
          <Text style={[styles.eventName, darkMode && styles.darkModeText]}>
            {event.name}
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL(Platform.OS == 'ios' ? 'maps://app?daddr=' + event.location : 'google.navigation:q=' + event.location)}>
            <Text style={[styles.eventLocation, darkMode ? styles.darkModeText : null]}>{event.location}</Text>
          </TouchableOpacity>
          <Text style={[styles.eventLocation, darkMode && styles.darkModeText]}>
            Provider: {event.provider}
          </Text>
          <Button
            title="View Event"
            onPress={handlePress}
            buttonStyle={[styles.eventButton, darkMode && styles.darkModeButton]}
            titleStyle={styles.eventButtonText}
          />
        </View>
      </View>
    </Card> 
  );

  
};

const styles = StyleSheet.create({
  eventCard: {
    margin: 10,
    borderRadius: 10,
  },
  soldOutCard: {
    backgroundColor: 'seashell',
  },
  darkModeCard: {
    backgroundColor: '#333', // Dark mode background color
  },
  container: {
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    marginRight: 10,
  },
  eventImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  eventDetails: {
    flex: 2,
    padding: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventLink: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 5,
  },
  darkModeText: {
    color: '#fff', // Dark mode text color
  },
  darkModeLink: {
    color: 'lightblue', // Dark mode link color
  },
  eventButton: {
    backgroundColor: 'teal', // Button background color
    borderRadius: 5,
    marginTop: 10,
  },
  darkModeButton: {
    backgroundColor: 'teal', // Dark mode button background color
  },
  eventButtonText: {
    color: 'white', // Button text color
  },
  eventLocation: {
    fontSize: 16,
    color: 'gray', // Default text color
    marginBottom: 5,
  },
  darkModeText: {
    color: '#fff', // Dark mode text color
  },  
  darkModeLocation: {
    color: 'lightgray', // Dark mode event location text color
  },
});

export default Event;
