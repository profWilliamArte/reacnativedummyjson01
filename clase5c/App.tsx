import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { theme } from './src/constants/theme';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import CartScreen from './src/screens/CartScreen';
import { CartProvider } from './src/contexts/CartContext';

// Definimos el Stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
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
              headerTitleAlign: 'center',
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'SHOPPING CENTER' }}
            />
            <Stack.Screen
              name="Details"
              component={DetailScreen}
              options={{ title: 'DETALLE' }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: 'MI CARRITO' }}
            />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}
