import React from 'react';
import { Stack } from 'expo-router';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { DatabaseProvider } from '../contexts/DatabaseContext';

export default function Layout() {
  return (
    <DatabaseProvider>
      <ThemeProvider value={DarkTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#000' },
            headerTintColor: '#fff',
            contentStyle: { backgroundColor: '#000' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Карта' }} />
          <Stack.Screen name="marker/[id]" options={{ title: 'Детали метки', headerBackTitle: 'Назад' }} />
        </Stack>
      </ThemeProvider>
    </DatabaseProvider>
  );
}
