import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import i18n from '../api/i18n/i18n';

const CustomSearchBar = ({ onClear, onSearch, darkMode }) => {
  const handleClearPress = () => {
    Keyboard.dismiss();
    onClear();
    setIsFocused(false);
    setValue('');
  };

  const handleSearchPress = () => {
    Keyboard.dismiss();
    onSearch(value);
  };

  const updateQuery = (text) => {
    setValue(text);
  };

  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

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
        onChangeText={updateQuery}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType='search'
        onSubmitEditing={handleSearchPress}
      />
      {!value ? (
        <Icon
          name="search"
          size={20}
          color={darkMode ? '#fff' : '#000'}
          onPress={handleSearchPress}
          style={styles.searchIcon}
        />
      ) : (
        <Icon
          name="times-circle"
          size={20}
          color={darkMode ? '#fff' : '#000'}
          onPress={handleClearPress}
          style={styles.clearIcon}
          setIsFocused={false}
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
    marginRight: 10,
    marginLeft: 5,
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
  searchIcon: {
    padding: 10,
  },
});

export default CustomSearchBar;
