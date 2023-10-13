import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Card, Image, Icon, Button } from 'react-native-elements';
import { Linking } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import cheerio from 'cheerio';
import { ScrollView } from 'react-native-gesture-handler';

const Event = ({ id, event, darkMode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState('');

  async function fetchWebsiteData() {
    try {
      const response = await axios.get(event.link);
      const $ = cheerio.load(response.data);
      var eventData = '';
      
      if(event.provider == "Duplex"){
        eventData = "Not available";
      }else if(event.provider == "Epic, Prague"){
        eventData = $('.event-detail__text').text();
      }else if(event.provider == "ESN"){
        eventData = $('.description').text();
      }else{
        eventData = $('.event-page-description').text();
      }

      setData(eventData);
    } catch (error) {
      console.error('Error fetching website data:', error);
    }
  }

  const handleModalShow = () => {
    if (!data) {
      fetchWebsiteData();
    }
  };

  const handleModalHide = () => {
    setIsModalVisible(false);
  };

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
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Image
              resizeMode="cover"
              source={{ uri: event.image }}
              alt='immagine evento'
              style={styles.eventImage}
            />
          </TouchableOpacity>
          <Modal
            isVisible={isModalVisible}
            onModalShow={handleModalShow}
            onModalHide={handleModalHide}
            style={styles.modal}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{data}</Text>
              <Button
                title="Hide modal"
                onPress={handleModalHide}
                buttonStyle={styles.modalButton}
                titleStyle={styles.modalButtonText}
              />
            </View>
          </Modal>
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
    backgroundColor: '#333',
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
  darkModeText: {
    color: '#fff',
  },
  eventButton: {
    backgroundColor: 'teal',
    borderRadius: 5,
    marginTop: 10,
  },
  darkModeButton: {
    backgroundColor: 'teal',
  },
  eventButtonText: {
    color: 'white',
  },
  modal: {
    marginHorizontal: 10
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'teal',
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
  },
});

export default Event;
