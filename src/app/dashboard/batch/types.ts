export interface Batch {
    batchId: string;
    medicineId: string;
    quantity: number;
    remainingQuantity: number;
    productionDate: number;
    expiryDate: number;
    isActive: boolean;
}
