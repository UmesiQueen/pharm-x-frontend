import { useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { otherArgsDrugRegistry } from "@/lib/constants";
import type { MedicineRegister } from "@/app/dashboard/medicine/types";
import type { CreateBatch } from "@/app/dashboard/batch/types";
import { useWaitForTransactionReceipt } from "@/hooks/useWaitForTransactionReceipt";
import { useReadMedicineDetails } from "@/hooks/useReadMedicineDetails";
import { useReadBatchDetails } from "@/hooks/useReadBatchDetails";

export const useWriteDrugRegistry = () => {
    const { isPending, writeContractAsync } = useWriteContract();
    const { verifyTransaction } = useWaitForTransactionReceipt();
    const { medicinesIdsQueryKey, medicineDetailsQueryKey } = useReadMedicineDetails();
    const { batchIdsQueryKey } = useReadBatchDetails();
    const queryClient = useQueryClient();

    const registerMedicine = async (medicineDetails: MedicineRegister, onSuccess: () => void) => {
        const { medicineId, serialNo, name, brand, ingredients, details } = medicineDetails;
        const toastId = toast.loading("Registering medicine...");
        try {
            await writeContractAsync({
                ...otherArgsDrugRegistry,
                functionName: "registerMedicine",
                args: [medicineId, serialNo, name, brand, ingredients, details]
            }, {
                onSuccess: async (data) => {
                    const result = await verifyTransaction(data, toastId);
                    if (result) {
                        onSuccess();
                        queryClient.invalidateQueries({ queryKey: medicinesIdsQueryKey });
                    }
                }
            });
        }
        catch (err) {
            toast.error(err instanceof Error ? (err.message).split(".")[0] : "An error occurred", { id: toastId });
            console.error("Failed to register medicine", err);
        }
    }

    const approveMedicine = async (medicineId: string, onSuccess: () => void) => {
        const toastId = toast.loading("Approving medicine...");
        try {
            await writeContractAsync({
                ...otherArgsDrugRegistry,
                functionName: "approveMedicine",
                args: [medicineId]
            }, {
                onSuccess: async (data) => {
                    const result = await verifyTransaction(data, toastId);
                    if (result) {
                        onSuccess();
                        queryClient.invalidateQueries({ queryKey: medicineDetailsQueryKey });
                    }
                }
            });
        }
        catch (err) {
            toast.error(err instanceof Error ? (err.message).split(".")[0] : "An error occurred", { id: toastId });
            console.error("Failed to approve medicine", err);
        }
    }

    const createBatch = async (batchDetails: CreateBatch, onSuccess: () => void) => {
        const { medicineId, batchId, quantity, productionDate, expiryDate } = batchDetails;
        const toastId = toast.loading("Creating batch...");
        try {
            await writeContractAsync({
                ...otherArgsDrugRegistry,
                functionName: "createBatch",
                args: [medicineId, batchId, quantity, productionDate, expiryDate]
            },
                {
                    onSuccess: async (data) => {
                        const result = await verifyTransaction(data, toastId);
                        if (result) {
                            onSuccess();
                            queryClient.invalidateQueries({ queryKey: batchIdsQueryKey });
                        }
                    }
                }
            )
        }
        catch (err) {
            toast.error(err instanceof Error ? (err.message).split(".")[0] : "An error occurred", { id: toastId });
            console.error("Failed to create new batch", err);
        }
    }

    return {
        registerMedicine,
        approveMedicine,
        createBatch,
        isPending
    }
}
