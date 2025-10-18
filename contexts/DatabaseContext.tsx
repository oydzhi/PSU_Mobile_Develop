import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { sqliteTable, integer, real, text } from 'drizzle-orm/sqlite-core';
import { eq } from 'drizzle-orm';
import type { MarkerData, ImageData } from '../types';

const sqlite = SQLite.openDatabaseSync('markers.db');
const db = drizzle(sqlite);

export const markersTable = sqliteTable('markers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  title: text('title').default(''),
  description: text('description').default(''),
});

export const markerImagesTable = sqliteTable('marker_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  markerId: integer('marker_id').notNull().references(() => markersTable.id),
  uri: text('uri').notNull(),
  createdAt: integer('created_at').notNull(),
});

interface DatabaseContextType {
  markers: MarkerData[];
  addMarker: (lat: number, lng: number) => number;
  deleteMarker: (id: number) => void;
  addImage: (markerId: number, uri: string) => number;
  deleteImage: (id: number) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [markersState, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    sqlite.execSync(`CREATE TABLE IF NOT EXISTS markers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      title TEXT DEFAULT '',
      description TEXT DEFAULT ''
    );`);

    sqlite.execSync(`CREATE TABLE IF NOT EXISTS marker_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      marker_id INTEGER NOT NULL,
      uri TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (marker_id) REFERENCES markers(id) ON DELETE CASCADE
    );`);

    const allMarkers = db.select().from(markersTable).all();
    const withImages: MarkerData[] = allMarkers.map(m => {
      const imgs = db.select().from(markerImagesTable).where(eq(markerImagesTable.markerId, m.id)).all();
      const formattedImgs: ImageData[] = imgs.map(i => ({
        id: i.id,
        uri: i.uri,
        createdAt: i.createdAt,
      }));
      return {
        id: m.id,
        latitude: m.latitude,
        longitude: m.longitude,
        title: m.title ?? '',
        description: m.description ?? '',
        images: formattedImgs,
      };
    });

    setMarkers(withImages);
  }, []);

  const addMarker = (lat: number, lng: number) => {
    const title = `Метка ${markersState.length + 1}`;
    db.insert(markersTable).values({ latitude: lat, longitude: lng, title }).run();
    const newMarkerRow = db.select().from(markersTable).orderBy(markersTable.id).all().slice(-1)[0];
    const newMarker: MarkerData = {
      id: newMarkerRow.id,
      latitude: lat,
      longitude: lng,
      title: newMarkerRow.title ?? '',
      description: newMarkerRow.description ?? '',
      images: [],
    };
    setMarkers(prev => [...prev, newMarker]);
    return newMarker.id;
  };

  const deleteMarker = (id: number) => {
    db.delete(markerImagesTable).where(eq(markerImagesTable.markerId, id)).run();
    db.delete(markersTable).where(eq(markersTable.id, id)).run();
    setMarkers(prev => prev.filter(m => m.id !== id));
  };

  const addImage = (markerId: number, uri: string) => {
    const ts = Date.now();
    db.insert(markerImagesTable).values({ markerId, uri, createdAt: ts }).run();
    const newImageRow = db.select().from(markerImagesTable).orderBy(markerImagesTable.id).all().slice(-1)[0];
    const newImage: ImageData = { id: newImageRow.id, uri, createdAt: ts };
    setMarkers(prev =>
      prev.map(m => (m.id === markerId ? { ...m, images: [...m.images, newImage] } : m))
    );
    return newImage.id;
  };

  const deleteImage = (id: number) => {
    db.delete(markerImagesTable).where(eq(markerImagesTable.id, id)).run();
    setMarkers(prev => prev.map(m => ({ ...m, images: m.images.filter(img => img.id !== id) })));
  };

  return (
    <DatabaseContext.Provider
      value={{
        markers: markersState,
        addMarker,
        deleteMarker,
        addImage,
        deleteImage,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const ctx = useContext(DatabaseContext);
  if (!ctx) throw new Error('useDatabase must be used inside DatabaseProvider');
  return ctx;
};
