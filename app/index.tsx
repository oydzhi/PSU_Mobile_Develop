import React from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import Map from '../components/Map';
import { useDatabase } from '../contexts/DatabaseContext';
import { useRouter } from 'expo-router';

export default function Home() {
  const { markers, addMarker, deleteMarker } = useDatabase();
  const router = useRouter();

  const handleReset = () => {
    if (!markers.length) return;
    Alert.alert('Сброс меток', 'Удалить все метки?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Да',
        style: 'destructive',
        onPress: () => markers.forEach(m => deleteMarker(m.id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Map
          markers={markers}
          onLongPress={(lat, lng) => addMarker(lat, lng)}
          onMarkerPress={(id) => router.push(`/marker/${id}`)}
        />
      </View>
      <View style={styles.footer}>
        <Button title="Сбросить все" color="#fff" onPress={handleReset} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1 },
  footer: { padding: 12, backgroundColor: 'rgba(0,0,0,0.9)' },
});
