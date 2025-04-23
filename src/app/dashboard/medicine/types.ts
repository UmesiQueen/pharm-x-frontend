export interface Medicine {
    medicineId: string;
    serialNo: string;
    name: string;
    brand: string;
    ingredients: string;
    details?: string;
    registrationDate: number;
    manufacturer: string;
    manufacturerId: string;
    approved: boolean;
};
