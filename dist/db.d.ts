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
