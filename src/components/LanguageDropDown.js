import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const LanguageDropdown = ({ selectedLanguage, languages, onChangeLanguage, darkMode }) => {
  const handleValueChange = useCallback((value) => {
    onChangeLanguage(value);
  }, [onChangeLanguage]);

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: darkMode ? '#fff' : 'gray',
      borderRadius: 4,
      color: darkMode ? '#fff' : 'black',
      backgroundColor: darkMode ? '#333' : '#fff',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: darkMode ? '#fff' : 'purple',
      borderRadius: 8,
      color: darkMode ? '#fff' : 'black',
      backgroundColor: darkMode ? '#333' : '#fff',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });

  return (
    <View style={styles.dropdownContainer}>
      <RNPickerSelect
        value={selectedLanguage}
        onValueChange={handleValueChange}
        items={languages.map((lang) => ({ label: lang.label, value: lang.value }))}
        style={pickerSelectStyles}
        doneText="Done" // set custom text for the "Done" button
        darkTheme={darkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
});

export default LanguageDropdown;
