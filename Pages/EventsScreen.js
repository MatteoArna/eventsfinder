import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
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
