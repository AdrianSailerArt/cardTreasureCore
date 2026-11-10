export declare const TEST_PASSWORD = "test1234";
export declare const TEST_EMAIL_DOMAIN = "test.cardtreasure.test";
export type TestAccount = {
    id: string;
    email: string;
    name: string;
    username: string;
    /** buyer: kauft nur; seller: privater Verkäufer; dealer: gewerblich (kauft auch); admin: CMS */
    role: 'buyer' | 'seller' | 'dealer' | 'admin';
    country: string;
    locale: 'de' | 'en';
    address: {
        street: string;
        houseNumber: string;
        postalCode: string;
        city: string;
    };
    company?: {
        name: string;
        vatId: string;
        displayName: string;
    };
};
export declare const TEST_ACCOUNTS: TestAccount[];
export declare const isTestEmail: (email: string) => boolean;
