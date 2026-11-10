export type MediaStoreConfig = {
    endpoint: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
    region?: string;
};
export type MediaStore = {
    put: (key: string, body: Uint8Array, contentType: string) => Promise<void>;
    get: (key: string) => Promise<{
        body: Uint8Array;
        contentType: string;
    } | null>;
    remove: (key: string) => Promise<void>;
};
export declare class MediaError extends Error {
    code: 'TOO_LARGE' | 'NOT_AN_IMAGE' | 'TOO_SMALL' | 'STORAGE' | 'NOT_FOUND' | 'LIMIT';
    status: number;
    constructor(code: 'TOO_LARGE' | 'NOT_AN_IMAGE' | 'TOO_SMALL' | 'STORAGE' | 'NOT_FOUND' | 'LIMIT', message: string, status?: number);
}
/** S3-kompatibler Speicher. Legt den Bucket beim ersten Schreiben an, falls er fehlt. */
export declare const createS3Store: (config: MediaStoreConfig) => MediaStore;
/** Im Speicher (für Tests). */
export declare const createMemoryStore: () => MediaStore & {
    keys: () => string[];
};
export declare const MAX_UPLOAD_BYTES: number;
export type ProcessedImage = {
    full: Uint8Array;
    thumb: Uint8Array;
    width: number;
    height: number;
};
/** Hochgeladene Datei prüfen und in WebP (groß + Vorschau) umwandeln; dreht nach EXIF-Ausrichtung, entfernt Metadaten. */
export declare const processImage: (input: Uint8Array) => Promise<ProcessedImage>;
/** Speicherschlüssel eines Mediums. */
export declare const mediaKey: (id: string, variant: "full" | "thumb") => string;
