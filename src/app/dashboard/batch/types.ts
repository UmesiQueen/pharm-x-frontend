export type CreateBatch = {
    batchId: string;
    medicineId: string;
    quantity: number;
    productionDate: number;
    expiryDate: number;
}
export type Batch = CreateBatch & {
    remainingQuantity: number;
    isActive: boolean;
}

export type BatchDetailsResult = [
    string,
    string,
    bigint,
    bigint,
    bigint,
    bigint,
    boolean,
]

