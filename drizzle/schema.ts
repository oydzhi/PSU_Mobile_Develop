import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";

export const markers = sqliteTable("markers", {
  id: integer("id").primaryKey(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  title: text("title"),
  description: text("description"),
});

export const markerImages = sqliteTable("marker_images", {
  id: integer("id").primaryKey(),
  markerId: integer("marker_id").references(() => markers.id),
  uri: text("uri").notNull(),
  createdAt: integer("created_at"),
});
