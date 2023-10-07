import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Event from '../Components/Event';
import { format, isToday } from 'date-fns';

function parseEventDate(dateString) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Estrai il giorno e il mese dalla stringa
    const matches = dateString.match(/(\d{1,2}) (\w{3})/);
    if (!matches) {
      return null;
    }
    
    const [, day, monthStr] = matches;
    
    // Mappa abbreviazioni del mese a numeri
    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    
    const month = monthMap[monthStr];
    
    // Calcola la data dell'evento
    const eventDate = new Date(currentYear, month, day);
    
    // Verifica se la data è già passata
    if (eventDate < currentDate) {
      // Calcola la differenza in mesi tra la data attuale e l'evento
      const monthsDiff = (currentDate.getFullYear() - eventDate.getFullYear()) * 12 +
        currentDate.getMonth() - eventDate.getMonth();
      
      // Se la differenza è maggiore di 1 mese, imposta l'anno successivo
      if (monthsDiff > 1) {
        eventDate.setFullYear(currentYear + 1);
      }
    }
    
    // Formatta la data nel formato desiderato
    const formattedDate = `${day}.${month + 1 < 10 ? '0' : ''}${month + 1}.${eventDate.getFullYear()}`;
    
    return formattedDate;
  }
  
  

const EventScreen = ({ events }) => {
    //const events = route.params?.events || [];

    // Group events by day
    const eventsByDay = {};
    events.forEach((event) => {
        const eventDate = parseEventDate(event.date);
        //const dayKey = format(eventDate, 'dd.MM.yyyy'); // Format day header

        if (!eventsByDay[eventDate]) {
            eventsByDay[eventDate] = [];
        }

        eventsByDay[eventDate].push(event);
    });

    // State for filtering starred events
    const [onlyStarred, setOnlyStarred] = useState(false);

    // Filter the events based on the 'onlyStarred' state
    const filteredEvents = onlyStarred
        ? events.filter((event) => event.starred)
        : events;

    // Render sections for each day
    const eventSections = Object.entries(eventsByDay).map(([day, dayEvents]) => (
        <View key={day}>
            <Text style={styles.dayHeader}>{isToday(new Date(day)) ? 'Today' : day}</Text>
            {dayEvents
                .filter((event) => !onlyStarred || event.starred)
                .map((event) => (
                    <Event key={event.id} event={event} />
                ))}
        </View>
    ));

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={{ padding: 20, alignItems: 'center', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}
                onPress={() => {
                    // Toggle the 'onlyStarred' state when the button is pressed
                    setOnlyStarred((prev) => !prev);
                }}
            >
                <Text style={styles.title}>
                    {onlyStarred ? 'Show All' : 'Only Starred'}
                </Text>
            </TouchableOpacity>
            <ScrollView style={{ flex: 1, width: "100%" }}>
                {eventSections}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    dayHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f2f2f2',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EventScreen;
