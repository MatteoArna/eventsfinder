import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Card, Image, Button } from 'react-native-elements';
import { Linking } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import cheerio from 'cheerio';

// APIs
import i18n from '../api/i18n/i18n.js';

const Event = ({ id, event, darkMode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState('');

  async function fetchWebsiteData() {
    try {
      const response = await axios.get(event.link);
      const $ = cheerio.load(response.data);
      var eventData = '';
      
      if(event.provider == "Duplex"){
        eventData = i18n.t('notAvailable');
      }else if(event.provider == "Epic, Prague"){
        eventData = $('.event-detail__text').text();
      }else if(event.provider == "ESN"){
        eventData = $('.description').text();
      }else{
        eventData = $('.event-page-description').text();
      }

      setData(eventData.trim());
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
        darkMode && styles.darkModeCard,
      ]}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Image
              resizeMode="cover"
              source={{ uri: event.image }}
              alt='event image'
              style={styles.eventImage}
            />
          </TouchableOpacity>
          <Modal
            isVisible={isModalVisible}
            onModalShow={handleModalShow}
            onModalHide={handleModalHide}
            onBackdropPress={handleModalHide}
            style={[styles.modal, darkMode && styles.darkModal]}
          >
            <View style={[styles.modalContent, darkMode && styles.darkModalContent]}>
              <Text style={[styles.modalText, darkMode && styles.darkModalText]}>{data}</Text>
              <Button
                title={i18n.t('hideModal')}
                onPress={handleModalHide}
                buttonStyle={[styles.modalButton, darkMode && styles.darkModalButton]}
                titleStyle={styles.modalButtonText}
              />
            </View>
          </Modal>
          <Text style={[styles.coupon, darkMode && styles.darkModeText]}>
            Coupon: {event.coupon ? event.coupon : i18n.t('notAvailable')}
          </Text>
        </View>
        <View style={styles.eventDetails}>
          <Text style={[styles.eventName, darkMode && styles.darkModeText]}>
            {event.name}
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL(Platform.OS == 'ios' ? 'maps://app?daddr=' + event.location : 'google.navigation:q=' + event.location)}>
            <Text style={styles.eventLocation}>{event.location}</Text>
          </TouchableOpacity>
          <Text style={[styles.provider, darkMode && styles.darkModeText]}>
            Provider: {event.provider}
          </Text>
          <Button
            title={i18n.t('viewEvent')}
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
    color: 'rgb(73, 148, 236)',
    marginBottom: 5,
    fontWeight: 'bold'
  },
  provider: {
    fontSize: 16,
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
    margin: 10,
    paddingHorizontal: 10,
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
  },
  modalButton: {
    backgroundColor: 'teal',
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
  },
  darkModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  darkModalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
    borderRadius: 10,
  },
  darkModalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  darkModalButton: {
    backgroundColor: 'teal',
  },
  coupon: {
    top: 10,
    padding: 5,
    fontWeight: 'bold',
    borderRadius: 10,
  }
});

export default Event;
