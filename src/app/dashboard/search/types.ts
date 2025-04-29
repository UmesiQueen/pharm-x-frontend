import type { Medicine } from "@/app/dashboard/medicine/types";
import type { Batch } from "@/app/dashboard/batch/types";

export type MedicineDetails = Pick<Medicine, "name" | "brand"> & Batch;

export type MedicineHoldersResult = {
    batchId: string;
    holderAddress: string;
    holderName: string;
    holderLocation: string;
    remainingQuantity: bigint;
};

export type MedicineHolders = MedicineHoldersResult & {
    medicineId: string;
}
