import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Import stack navigator

import HomeScreen from './Pages/HomeScreen';
import EventsScreen from './Pages/EventsScreen';
import SettingsScreen from './Pages/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); // Create a stack navigator

const events = [
  {
    id: 1,
    name: 'Evento 1',
    date: '2021-10-10',
    location: 'Via Roma 1',
    image: 'https://avatars0.githubusercontent.com/u/32242596?s=460&u=1ea285743fc4b083f95d6ee0be2e7bb8dcfc676e&v=4',
  },
  {
    id: 2,
    name: 'Evento 2',
    date: '2021-10-11',
    location: 'Via Roma 2',
    image: 'https://avatars0.githubusercontent.com/u/32242596?s=460&u=1ea285743fc4b083f95d6ee0be2e7bb8dcfc676e&v=4',
  },
  {
    id: 3,
    name: 'Evento 3',
    date: '2021-10-12',
    location: 'Via Roma 3',
    image: 'https://avatars0.githubusercontent.com/u/32242596?s=460&u=1ea285743fc4b083f95d6ee0be2e7bb8dcfc676e&v=4',
  }
];

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Events"
      component={EventsScreen}
      options={{
        tabBarLabel: 'Events',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="calendar" color={color} size={size} />
        ),
      }}
      initialParams={{ events: events }} // Pass the events array to the EventsScreen component
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='hammer-wrench' color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }} // Hide the stack navigator header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
