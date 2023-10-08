import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar, Image, Icon } from 'react-native-elements';
import { Linking } from 'react-native';

const Event = ({ event }) => {
  const handlePress = async () => {
    const url = event.link;
    // Verifica se l'URL è valido
    if (url) {
      // Prova ad aprire l'URL nel browser predefinito
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
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.eventLocation}>{event.location}</Text>
          <Text style={styles.eventPrice}>State: {event.soldout} </Text>
          <TouchableOpacity onPress={handlePress}>
            <Text style={styles.eventLink}>Event Link</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.starContainer}>
          <TouchableOpacity onPress={togglePress}>
            <Icon
              name={isPressed ? 'star' : 'star-outline'} // Name of the star icon
              size={30}
              color={isPressed ? 'orange' : 'gray'} // Change color based on pressed state
            />
          </TouchableOpacity>
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
    backgroundColor: 'seashell', // Imposta lo sfondo in rosso se l'evento è sold-out
  },
  container: {
    flexDirection: 'row', // Mostra gli elementi in una riga
  },
  imageContainer: {
    flex: 1, // Flessibile per occupare la metà sinistra
    marginRight: 10, // Aggiungi margine destro per separare l'immagine dalla stella
  },
  eventImage: {
    width: '100%',
    aspectRatio: 1, // Rendi l'immagine quadrata
    borderRadius: 10,
  },
  eventDetails: {
    flex: 2, // Flessibile per occupare la metà destra
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
  starContainer: {
    flex: 0.2, // Flessibile per occupare il 20% dello spazio
    justifyContent: 'flex-end', // Allinea la stella in basso
    alignItems: 'center', // Allinea la stella al centro verticalmente
    paddingBottom: 10, // Aggiungi un po' di spazio in basso
    flex: 1,
  },
});

export default Event;
