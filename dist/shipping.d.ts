export declare const SHIPPING_FORMATS: readonly ["standard", "compact", "large", "maxi", "parcel"];
export type ShippingFormat = (typeof SHIPPING_FORMATS)[number];
/** Grenzen der Formate (Deutsche Post / DHL), Gewicht in Gramm, Dicke in Millimetern. */
export declare const FORMAT_LIMITS: Record<ShippingFormat, {
    maxWeightG: number;
    maxThicknessMm: number;
}>;
/** Annahmen fürs Verpacken. Werte sind bewusst eher großzügig. */
export declare const PACKING: {
    card: {
        weightG: number;
        thicknessMm: number;
    };
    sleeve: {
        weightG: number;
        thicknessMm: number;
    };
    toploader: {
        weightG: number;
        thicknessMm: number;
    };
    envelope: {
        weightG: number;
        thicknessMm: number;
    };
    /** Pappe zum Verstärken, wenn keine Karte im Toploader steckt */
    stiffener: {
        weightG: number;
        thicknessMm: number;
    };
    /** Sicherheitsaufschlag aufs Gewicht (Klebeband, Teambags, feuchtes Papier …) */
    weightBuffer: number;
    /** Sicherheitsaufschlag auf die Dicke in Millimetern */
    thicknessBufferMm: number;
    /** Sealed-Produkte (Booster, Displays …) gehen grundsätzlich als Paket */
    sealedWeightG: number;
};
/** Verpackungspauschale in Cent, immer zusätzlich zum Porto: je Sendung nach Format, dazu je Toploader. */
export declare const PACKAGING_COST: {
    /** Brief: Umschlag, Hüllen, Pappe */
    letterCents: number;
    /** Paket: Karton, Polster, Klebeband */
    parcelCents: number;
    toploaderCents: number;
};
/** Verpackungskosten einer Sendung im gewählten Format. */
export declare const packagingCost: (format: ShippingFormat, toploaders: number) => number;
export type PackageItem = {
    kind: 'single' | 'sealed';
    quantity: number;
    unitPriceCents: number;
    /** Der Verkäufer verschickt diese Karte im Toploader (Angabe am Angebot); bei Sealed ohne Bedeutung */
    toploader?: boolean;
};
export type PackageEstimate = {
    weightG: number;
    thicknessMm: number;
    cards: number;
    toploaders: number;
    sealed: number;
    valueCents: number;
};
/** Schätzt Gewicht und Dicke einer Sendung inklusive Schutz, Verpackung und Puffer. */
export declare const estimatePackage: (items: PackageItem[]) => PackageEstimate;
export type ShippingOption = {
    id: string;
    name: string;
    format: ShippingFormat;
    maxWeightG: number;
    maxThicknessMm: number;
    priceCents: number;
    tracked: boolean;
    maxOrderValueCents: number | null;
    destinationCountries: string[];
    active: boolean;
};
export type ShippingRejection = 'country' | 'weight' | 'thickness' | 'value' | 'sealed' | 'inactive';
/** Warum eine Versandart für diese Sendung nicht passt, oder null, wenn sie passt. */
export declare const rejectReason: (option: ShippingOption, pkg: PackageEstimate, country: string) => ShippingRejection | null;
/** Günstigste passende Versandart; bei gleichem Preis die mit Sendungsverfolgung. */
export declare const chooseShipping: <T extends ShippingOption>(options: T[], pkg: PackageEstimate, country: string) => T | null;
export declare const EU_SHIPPING_COUNTRIES: readonly ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"];
/**
 * Plattform-Tarif: welche Versandarten es gibt und was sie kosten. Verkäufer pflegen nichts selbst,
 * der Versand jeder Sendung wird daraus automatisch berechnet.
 * Preise: Deutsche Post / DHL, Stand 2025 (Richtwerte, vor dem Start mit der aktuellen Preisliste abgleichen).
 * Für Verkäufer außerhalb Deutschlands gilt vorerst derselbe Tarif als Näherung.
 */
export declare const shippingTariff: (originCountry: string) => ShippingOption[];
export type ShippingQuote = {
    service: string;
    format: ShippingFormat;
    tracked: boolean;
    /** Was der Käufer für den Versand zahlt: Porto + Verpackung */
    priceCents: number;
    /** Porto der Versandart */
    postageCents: number;
    /** Verpackungspauschale (Umschlag bzw. Karton, Toploader) */
    packagingCents: number;
    toploaders: number;
    weightG: number;
    thicknessMm: number;
};
/**
 * Versand für eine Sendung automatisch berechnen: Gewicht und Dicke schätzen, die günstigste passende Versandart
 * aus dem Tarif wählen und die Verpackungspauschale aufschlagen. Null, wenn nichts passt (z.B. Ziel außerhalb der EU).
 */
export declare const quoteShipping: (items: PackageItem[], originCountry: string, destinationCountry: string) => ShippingQuote | null;
