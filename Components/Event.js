import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Image, Icon } from 'react-native-elements';
import { Linking } from 'react-native';

const Event = ({ event, darkMode }) => {
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

  const [isPressed, setIsPressed] = useState(false);

  const togglePress = () => {
    setIsPressed(!isPressed);
    event.starred = !event.starred;
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
          <View style={styles.starContainer}>
          <TouchableOpacity onPress={togglePress}>
            <Icon
              style={styles.star}
              name={isPressed ? 'star' : 'star-outline'}
              size={40}
              color={isPressed ? 'orange' : 'gray'}
            />
          </TouchableOpacity>
        </View>
        </View>
        <View style={styles.eventDetails}>
          <Text style={[styles.eventName, darkMode && styles.darkModeText]}>
            {event.name}
          </Text>
          <Text style={[styles.eventLocation, darkMode && styles.darkModeText]}>
            {event.location}
          </Text>
          <Text style={[styles.eventPrice, darkMode && styles.darkModeText]}>
            State: {event.soldout}
          </Text>
          <TouchableOpacity onPress={handlePress}>
            <Text style={[styles.eventLink, darkMode && styles.darkModeLink]}>
              Event Link
            </Text>
          </TouchableOpacity>
          <Text style={[styles.eventLocation, darkMode && styles.darkModeText]}>
            Provider: {event.provider}
          </Text>
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
  starContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  star: {
    //place it in the middle
    paddingTop: 10,
    paddingBottom: 10,
  }
});

export default Event;
