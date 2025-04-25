import { useWriteContract } from "wagmi";
import { otherArgsDrugRegistry } from "@/lib/constants";
import { toast } from "sonner";
import type { MedicineRegister } from "@/app/dashboard/medicine/types";
import type { CreateBatch } from "@/app/dashboard/batch/types";

export const useWriteDrugRegistry = () => {
    const { writeContractAsync } = useWriteContract();

    const registerMedicine = async (medicineDetails: MedicineRegister) => {
        const { medicineId, serialNo, name, brand, ingredients, details } = medicineDetails;

        const txPromise = writeContractAsync({
            ...otherArgsDrugRegistry,
            functionName: "registerMedicine",
            args: [medicineId, serialNo, name, brand, ingredients, details]
        });

        toast.promise(txPromise,
            {
                loading: 'Registering medicine...',
                success: 'Medicine registered!',
                error: (err) => `${(err?.message || 'Unknown error').split(".")[0]}`,
            }
        );

        return txPromise;
    }

    const approveMedicine = async (medicineId: string) => {
        const txPromise = writeContractAsync({
            ...otherArgsDrugRegistry,
            functionName: "approveMedicine",
            args: [medicineId]
        });

        toast.promise(txPromise,
            {
                loading: 'Confirming transaction...',
                success: 'Medicine approved!',
                error: (err) => `${(err?.message || 'Unknown error').split(".")[0]}`,
            }
        );

        return txPromise;
    }

    const createBatch = async (batchDetails: CreateBatch) => {
        const { medicineId, batchId, quantity, productionDate, expiryDate } = batchDetails;

        const txPromise = writeContractAsync({
            ...otherArgsDrugRegistry,
            functionName: "createBatch",
            args: [medicineId, batchId, quantity, productionDate, expiryDate]
        });

        toast.promise(txPromise,
            {
                loading: 'Creating batch...',
                success: 'Batch created!',
                error: (err) => `${(err?.message || 'Unknown error').split(".")[0]}`,
            }
        );

        return txPromise;
    }

    return {
        registerMedicine,
        approveMedicine,
        createBatch
    }
}
