import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar, Image, Icon } from 'react-native-elements';

    

const Event = ({ event }) => {

    const [isPressed, setIsPressed] = useState(false);
  
    const togglePress = () => {
      setIsPressed(!isPressed);
      event.starred = !event.starred;
    };

    return (
        <Card containerStyle={styles.eventCard}>
            <TouchableOpacity onPress={togglePress}>
                <Icon
                    name={isPressed ? 'star' : 'star-outline'} // Name of the star icon
                    size={30}
                    color={isPressed ? 'orange' : 'gray'} // Change color based on pressed state
                />
            </TouchableOpacity>
            <Image
                resizeMode="cover"
                source={{ uri: event.image }}
                alt='immagine evento'
                style={styles.eventImage}
            />
            <View style={styles.eventDetails}>
                <Avatar
                    rounded
                    source={{ uri: event.organizerAvatar }}
                    size="medium"
                />
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
                <Text style={styles.eventPrice}>Price: {event.price} €</Text>

                <TouchableOpacity
                    onPress={() => {
                        // Add logic to open the event link
                        // You can use Linking or any other method to open the link
                    }}
                >
                    <Text style={styles.eventLink}>Event Link</Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    eventCard: {
        margin: 10,
        borderRadius: 10,
    },
    eventImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    eventDetails: {
        padding: 10,
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    eventLocation: {
        fontSize: 16,
        color: 'gray',
    },
    eventDate: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    eventPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    eventLink: {
        fontSize: 16,
        color: 'blue',
        marginTop: 5,
    },
});

export default Event;
