import { useReadContract, useReadContracts } from "wagmi";
import { otherArgsDrugRegistry } from "@/lib/constants";
import type { Batch, BatchDetailsResult } from "@/app/dashboard/batch/types";
import { BatchDetailsFactory } from "@/lib/factories/BatchDetailsFactory";

export const useReadBatchDetails = () => {
    const {
        data: batchIds,
        isFetched: isBatchIdsFetched,
        queryKey: batchIdsQueryKey,
        isPending: isBatchIdsPending,
        isLoading: isBatchIdsLoading
    } = useReadContract({
        ...otherArgsDrugRegistry,
        functionName: "getBatchIds"
    });

    const typedBatchIds = batchIds as string[];

    const batchDetailsCallList = typedBatchIds?.map((batchId) => ({
        ...otherArgsDrugRegistry,
        functionName: "getBatchDetailsById",
        args: [batchId],
    }));

    const {
        data: batchDetailsResults,
        isFetched: isBatchDetailsFetched,
        isLoading: isBatchDetailsLoading,
        queryKey: batchDetailsQueryKey
    } = useReadContracts({
        contracts: batchDetailsCallList,
        query: {
            enabled: !isBatchIdsPending
        }
    });

    type BatchDetails = {
        result: BatchDetailsResult;
        status: string;
        error?: string | null;
    }

    const typedBatchDetails = batchDetailsResults as BatchDetails[];

    const batchDetails = typedBatchDetails
        ?.filter((batchDetail) => batchDetail.result !== null)
        ?.map((batchDetail) => {
            const [
                batchId,
                medicineId,
                quantity,
                remainingQuantity,
                productionDate,
                expiryDate,
                isActive
            ] = BatchDetailsFactory(batchDetail.result);

            const newBatchDetail: Batch = {
                batchId,
                medicineId,
                quantity: Number(quantity),
                remainingQuantity: Number(remainingQuantity),
                productionDate: Number(productionDate),
                expiryDate: Number(expiryDate),
                isActive
            }

            return newBatchDetail;
        });

    const isAllBatchDetailsFetched = isBatchDetailsFetched && isBatchIdsFetched;
    const isAllBatchDetailsLoading = isBatchDetailsLoading || isBatchIdsLoading;

    return {
        batchIdsQueryKey,
        batchDetailsQueryKey,
        isAllBatchDetailsFetched,
        isAllBatchDetailsLoading,
        batchIds,
        batchDetails
    }
}





