import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Event from '../Components/Event';
import { format, isToday } from 'date-fns';

const EventScreen = ({ events }) => {
    function parseEventDate(inputDate, provider) {
        // Define an object to map month abbreviations to month numbers
        const monthMap = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };

        // Split the input date string into parts
        const parts = inputDate.split(' ');

        // Check if the input contains "Multiple dates and times"
        if (parts.includes('Multiple') && parts.includes('dates') && parts.includes('times')) {
            return null;
        }

        // Check the format of the input date
        if (provider == "MAD PRG") {
            // New format: "Tue Nov 14 10:00 PM - 5:00 AM"
            const day = parseInt(parts[2], 10);
            const month = monthMap[parts[1]];
            const year = new Date().getFullYear();
            // Determine if it's next year
            const isNextYear = month < new Date().getMonth();

            // Determine the year based on the current date and whether it's next year
            if (isNextYear) {
                year++;
            }
            return new Date(year, month, day);
        } else {
            // Old format: "Wed 11 Oct 19:15 - Thu 12 Oct 22:00"
            const day = parseInt(parts[1], 10);
            const month = monthMap[parts[2]];
            const isNextYear = month < new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const year = isNextYear ? currentYear + 1 : currentYear;
            return new Date(year, month, day);
        }
    }

    // Group events by day
    //const eventsByDay = [];

    const sortedEvents = [...events].sort((a, b) => {
        const dateA = parseEventDate(a.date, a.provider);
        const dateB = parseEventDate(b.date, b.provider);
        return dateA - dateB;
    });


    // State for filtering starred events
    const [onlyStarred, setOnlyStarred] = useState(false);

    // Filter the events based on the 'onlyStarred' state
    const filteredEvents = onlyStarred
        ? sortedEvents.filter((event) => event.starred)
        : sortedEvents;

    // Group events by day
    const eventsByDay = {};

    filteredEvents.forEach((event) => {
        const eventDate = parseEventDate(event.date, event.provider);

        if (!eventDate) {
            return; // Skip events with invalid dates
        }

        // Format the date in 'dd.mm.yyyy' format
        const formattedDate = `${eventDate.getDate()}.${eventDate.getMonth() + 1}.${eventDate.getFullYear()}`;

        if (!eventsByDay[formattedDate]) {
            eventsByDay[formattedDate] = [];
        }

        eventsByDay[formattedDate].push(event);
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
