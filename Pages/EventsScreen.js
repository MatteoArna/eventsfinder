import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card } from '@rneui/themed';
import { Image } from 'react-native-elements';

const EventsScreen = ({ route }) => {
    // Estrai l'array degli eventi da route.params
    const events = route.params?.events || [];

    // Mappa gli eventi in una serie di card
    const eventCards = events.map((event) => (
        <Card key={event.id}>
            <Card.Title>{event.name}</Card.Title>
            <Card.Divider />
            <View style={{ position: "relative", alignItems: "center" }}>
                <Image
                    resizeMode="contain"
                    source={{ uri: event.image }}
                    alt='immagine evento'
                    style={{ width: '100%', height: 200 }} // Regola le dimensioni dell'immagine come preferisci
                />
                <Text>{event.location}</Text>
            </View>
        </Card>
    ));

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ flex: 1, width: "100%" }}>
                {eventCards}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
