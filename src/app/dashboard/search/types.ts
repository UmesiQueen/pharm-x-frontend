import type { Medicine } from "@/app/dashboard/medicine/types";
import type { Batch } from "@/app/dashboard/batch/types";

export type MedicineDetails = Pick<Medicine, "name" | "brand"> & Batch;
