export type StatusTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger';
export declare const statusTone: (status: string) => StatusTone;
export declare const STATUS_LABELS: Record<'de' | 'en', Record<string, string>>;
export declare const statusLabel: (status: string, locale?: string) => string;
