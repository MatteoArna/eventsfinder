import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Divider } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = ({ darkMode, toggleDarkMode }) => {
  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
        <View style={styles.headerContainer}>
            <Text style={[styles.header, darkMode && styles.headerDark]}>Settings</Text>
        </View>
        <ScrollView style={[styles.container, darkMode && styles.containerDark]}>
            <Text style={[styles.subTitle, darkMode && styles.subTitleDark]}>General</Text>
            <Divider style={{ backgroundColor: '#ccc' }} />
            <View style={styles.toggleContainer}>
                <Text style={[styles.toggleLabel, darkMode && styles.toggleLabelDark]}>Dark Mode</Text>
                <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                style={styles.switch}
                />
            </View>
            {/* Add more settings components here */}
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  subTitleDark: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 16,
    paddingTop: 16,
    height: 60, // Adjust the height to vertically center the text
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  headerDark: {
    color: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items with space between them
    marginVertical: 20,
    paddingHorizontal: 16,
  },  
  toggleLabel: {
    fontSize: 18,
    marginRight: 10,
    color: '#555',
  },
  toggleLabelDark: {
    fontSize: 18,
    marginRight: 10,
    color: '#ccc',
    },
  switch: {
    marginRight: 10,
  },
});

export default SettingsScreen;
