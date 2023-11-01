import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import Event from './Event';
import i18n from '../api/i18n/i18n';

const VerticalSection = ({ title, events, darkMode }) => {

  function formatDate(date){
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(i18n.locale, options);
  }

  const renderSubsection = (date, events) => {
    const pairs = [];
    for (let i = 0; i < events.length; i += 2) {
      pairs.push(events.slice(i, i + 2));
    }
    return (
      <View style={styles.subsection} key={date.toDateString()}>
        <Text style={[styles.subsectionTitle, darkMode && styles.subsectionTitleDark]}>
          {formatDate(date)}
        </Text>
        {pairs.map((pair, index) => (
          <View style={styles.row} key={index}>
            {pair.map((event, i) => (
              <Event key={i} event={event} darkMode={darkMode} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderEventsByDate = () => {
    const eventMap = {};
    events.forEach((event) => {
      const eventDate = new Date(event.date);
      const dateKey = eventDate.toDateString();
      if (!eventMap[dateKey]) {
        eventMap[dateKey] = [];
      }
      eventMap[dateKey].push(event);
    });

    return Object.keys(eventMap).map((dateKey, index) => {
      const date = new Date(dateKey);
      const eventGroup = eventMap[dateKey];
      return <React.Fragment key={index}>{renderSubsection(date, eventGroup)}</React.Fragment>;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, darkMode && styles.titleDark]}>{title}</Text>
      {renderEventsByDate()}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  titleDark: {
    color: '#fff',
  },
  subsection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
   // backgroundColor: 'rgba(100,100,100,0.1)',
  },
  subsectionTitleDark: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default VerticalSection;
