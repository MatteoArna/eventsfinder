import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Linking } from 'react-native';
import i18n from '../api/i18n/i18n';

const EventDetail = ({ event, darkMode, isVisible, onClose }) => {

  function dateFormatter(date){
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(i18n.locale, options);
  }

  if (!event) {
    return null;
  }

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={[styles.container, darkMode && styles.containerDark]}>
        <Text style={[styles.title, darkMode && styles.titleDark]}>{event.name}</Text>
        <Text style={[styles.title, styles.bold, darkMode && styles.boldDark]}>{i18n.t('location')}:</Text>
        <TouchableOpacity style={[styles.text, darkMode && styles.textDark]} onPress={() => Linking.openURL(Platform.OS == 'ios' ? 'maps://app?daddr=' + event.location : 'google.navigation:q=' + event.location)}>
          <Text style={{color: 'rgb(73, 148, 236)'}}>{event.location}</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, styles.bold, darkMode && styles.boldDark]}>{i18n.t('date')}:</Text>
          <Text style={[styles.text, darkMode && styles.textDark]}>{dateFormatter(event.date)}</Text>
        </View>
        <Text style={[styles.title, styles.bold, darkMode && styles.boldDark]}>{i18n.t('provider')}:</Text>
        <Text style={[styles.text, darkMode && styles.textDark]}>{event.provider}</Text>

        <Text style={[styles.title, styles.bold, darkMode && styles.boldDark]}>{i18n.t('coupon')}:</Text>
        <Text style={[styles.text, darkMode && styles.textDark]}>{event.coupon ? event.coupon : i18n.t('notAvailable')}</Text>

        <TouchableOpacity style={[styles.button, darkMode && styles.buttonDark]} onPress={() => Linking.openURL(event.link)}>
          <Text style={styles.buttonText}>{i18n.t('buyTickets')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  containerDark: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  textDark: {
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  boldDark: {
    color: '#fff',
  },
  button: {
    backgroundColor: 'teal',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonDark: {
    backgroundColor: '#111',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EventDetail;
