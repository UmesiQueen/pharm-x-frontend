type EventType = "MANUFACTURED" | "TO_SUPPLIER" | "TO_PHARMACY" | "DISPENSED";

type SupplyChainEvent = {
    blockHash: string;
    from: string;
    to: string;
    eventType: EventType;
    patientId: string | null;
    timestamp: number;
};

interface Batch {
    batchId: string;
    medicineId: string;
    name: string;
    brand: string;
    quantity: number;
    remainingQuantity: number;
    productionDate: number;
    expiryDate: number;
    isActive: boolean;
    supplyChainEvents: SupplyChainEvent[];
}

type Medicine = {
    medicineId: string;
    name: string;
    brand: string;
    regDate: number;
    manufacturer: string;
    manufacturerId: string;
    approved: boolean;
};


export type { Medicine, Batch }
