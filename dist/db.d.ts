import type { SQL } from 'drizzle-orm';
export declare const isLocalDatabase: (url: string) => boolean;
export declare const pgOptions: (url: string, max?: number) => {
    prepare: boolean;
    max: number;
    max_pipeline: number;
    ssl: false | "require";
    idle_timeout: number;
    connect_timeout: number;
    onnotice: () => void;
};
/** Alles, was rohes SQL ausführen kann: eine Drizzle-Datenbank oder eine Transaktion, egal mit welchem Schema. */
export type SqlRunner = {
    execute: (query: SQL) => PromiseLike<unknown>;
};
/** Rohes SQL ausführen und die Zeilen typisiert zurückgeben (Spaltennamen im SQL als "camelCase" benennen). */
export declare const rowsOf: <T>(db: SqlRunner, query: SQL) => Promise<T[]>;
