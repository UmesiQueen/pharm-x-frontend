import type { Address } from "viem";

type MedicineRegister = {
    medicineId: string;
    serialNo: string;
    name: string;
    brand: string;
    ingredients: string;
    details?: string;
}

type Medicine = MedicineRegister & {
    registrationDate: number;
    manufacturer: string;
    manufacturerId: string;
    approved: boolean;
}

type MedicineDetailsResults = [
    string,
    string,
    string,
    string,
    string,
    string,
    bigint,
    Address,
    string,
    boolean
]

export type { Medicine, MedicineRegister, MedicineDetailsResults }
