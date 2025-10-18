import React from 'react';
import { View, Image, Button, StyleSheet } from 'react-native';
import { ImageData } from '../types';

type Props = {
  images: ImageData[];
  onDelete: (id: number) => void;
};

export default function ImageList({ images, onDelete }: Props) {
  return (
    <View style={styles.container}>
      {images.map(img => (
        <View key={img.id} style={styles.imageWrapper}>
          <Image source={{ uri: img.uri }} style={styles.image} />
          <Button title="Удалить" onPress={() => onDelete(img.id)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  imageWrapper: { marginBottom: 8 },
  image: { width: 200, height: 200, borderRadius: 8 },
});
