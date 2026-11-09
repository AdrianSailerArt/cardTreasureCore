import { type SQL } from 'drizzle-orm';
import { type MediaStore } from './media.js';
/** Nur was beide Apps gemeinsam haben: eine Drizzle-Datenbank mit execute und transaction */
export interface SqlDb {
    execute: (query: SQL) => Promise<unknown>;
    transaction: <T>(fn: (tx: SqlDb) => Promise<T>) => Promise<T>;
}
declare const MAX_LISTING_PHOTOS = 1;
export { MAX_LISTING_PHOTOS };
/** Foto an ein eigenes Angebot hängen (eins pro Angebot). */
export declare const addListingPhoto: (db: SqlDb, store: MediaStore, sellerId: string, listingId: string, input: Uint8Array) => Promise<{
    id: `${string}-${string}-${string}-${string}-${string}`;
}>;
export declare const removeListingPhoto: (db: SqlDb, store: MediaStore, sellerId: string, listingId: string, mediaId: string) => Promise<void>;
/** Foto-IDs je Angebot (in Reihenfolge). */
export declare const photosOf: (db: SqlDb, listingIds: string[]) => Promise<Map<string, string[]>>;
/** Kartenbild eines Drucks ersetzen. Ein vorheriger Ersatz wird gelöscht. */
export declare const replaceCardImage: (db: SqlDb, store: MediaStore, adminId: string, printingId: string, input: Uint8Array, reason?: string | null) => Promise<{
    mediaId: `${string}-${string}-${string}-${string}-${string}`;
}>;
/** Ersatz entfernen, wieder das Bild aus der Quelle zeigen. */
export declare const resetCardImage: (db: SqlDb, store: MediaStore, printingId: string) => Promise<void>;
export declare const cardImageOverride: (db: SqlDb, printingId: string) => Promise<string>;
