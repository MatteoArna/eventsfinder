import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Event from '../Components/Event';
import { format, isToday } from 'date-fns';

const EventScreen = ({ route }) => {
    const events = route.params?.events || [];

    // Group events by day
    const eventsByDay = {};
    events.forEach((event) => {
        const eventDate = new Date(event.date); // Assuming your event object has a 'date' property
        const dayKey = format(eventDate, 'dd.MM.yyyy'); // Format day header

        if (!eventsByDay[dayKey]) {
            eventsByDay[dayKey] = [];
        }

        eventsByDay[dayKey].push(event);
    });

    // Render sections for each day
    const eventSections = Object.entries(eventsByDay).map(([day, dayEvents]) => (
        <View key={day}>
            <Text style={styles.dayHeader}>{isToday(new Date(day)) ? 'Today' : day}</Text>
            {dayEvents.map((event) => (
                <Event key={event.id} event={event} />
            ))}
        </View>
    ));

    return (
        <SafeAreaView style={styles.container}>
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
});

export default EventScreen;
