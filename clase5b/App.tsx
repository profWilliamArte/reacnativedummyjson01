import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { theme } from './src/constants/theme';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';

// Definimos el Stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.secondary,
            headerTitleStyle: {
              fontWeight: '900',
            },
            // Ocultamos el header por defecto para usar nuestro componente Header personalizado si se prefiere,
            // o lo configuramos aquí para un look nativo.
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'SHOPPING CENTER DUMMY JSON' }}
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen}
            options={{ title: 'DETALLE DEL PRODUCTO' }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
