import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EventsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>EventsScreen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    },
});

export default EventsScreen;
