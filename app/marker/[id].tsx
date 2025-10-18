import React from 'react';
import { ScrollView, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useDatabase } from '../../contexts/DatabaseContext';
import ImageList from '../../components/ImageList';

export default function MarkerDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { markers, addImage, deleteImage } = useDatabase();
  const marker = markers.find(m => m.id === Number(id));

  if (!marker) return <Text>Метка не найдена</Text>;

  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      addImage(marker.id, result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{marker.title || 'Без названия'}</Text>
      <Text>Координаты: {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}</Text>

      <Button title="Добавить изображение" onPress={handleAddImage} />

      <ImageList images={marker.images} onDelete={deleteImage} />

      <Button title="Назад к карте" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontWeight: '600', fontSize: 18, marginBottom: 8 },
});
