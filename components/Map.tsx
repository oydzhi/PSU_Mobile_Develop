import React from 'react';
import MapView, { Marker, MapPressEvent, LongPressEvent, LatLng } from 'react-native-maps';
import type { MarkerData } from '../types';

interface Props {
  markers: MarkerData[];
  onLongPress: (lat: number, lng: number) => void;
  onMarkerPress: (id: number) => void;
}

export default function Map({ markers, onLongPress, onMarkerPress }: Props) {
  const handleLongPress = (event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onLongPress(latitude, longitude);
  };

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 58.0105,
        longitude: 56.2294,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      onLongPress={handleLongPress}
    >
      {markers.map(m => (
        <Marker
          key={m.id}
          coordinate={{ latitude: m.latitude, longitude: m.longitude }}
          title={m.title}
          description={m.description}
          onPress={() => onMarkerPress(m.id)}
        />
      ))}
    </MapView>
  );
}
