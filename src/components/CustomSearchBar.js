import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the Icon component for the clear button

import i18n from '../api/i18n/i18n';

const CustomSearchBar = ({ value, onChangeText, onClear, darkMode }) => {
  const handleClearPress = () => {
    Keyboard.dismiss(); // Hide the keyboard when the clear icon is pressed
    onClear(); // Call the onClear function from the parent component
    setIsFocused(false)
  };

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false); 
  };

  return (
    <View style={[styles.searchBarContainer, darkMode && styles.searchBarContainerDark]}>
      <TextInput
        style={[styles.searchInput, darkMode && styles.searchInputDark]}
        placeholder={i18n.t('searchEvents')}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isFocused && (
        <Icon
          name="times-circle"
          size={20}
          color={darkMode ? '#fff' : '#000'}
          onPress={handleClearPress} // Call the handleClearPress function on press
          style={styles.clearIcon}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginVertical: 6,
    paddingHorizontal: 6,
  },
  searchBarContainerDark: {
    backgroundColor: '#333',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: '#000',
    fontSize: 18,
  },
  searchInputDark: {
    color: '#fff',
  },
  clearIcon: {
    padding: 10,
  },
});

export default CustomSearchBar;
