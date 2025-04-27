import type { Batch } from "@/app/dashboard/batch/types";

export const BatchDetailsFactory = (data: Batch) => {
    return data ?? {
        batchId: "",
        medicineId: "",
        quantity: 0n,
        remainingQuantity: 0n,
        productionDate: 0n,
        expiryDate: 0n,
        isActive: false,
    }
}
