import { useWriteContract } from "wagmi";
import { otherArgsSupplyChainRegistry } from "@/lib/constants";
import { toast } from "sonner";
import type { TransferDetails } from "@/components/modals/TransferOwnership";
import type { DispenseDetails } from "@/components/modals/DispenseMedicine";


export const useWriteSupplyChainRegistry = () => {
    const { writeContractAsync } = useWriteContract();

    const transferOwnership = async (transferDetails: TransferDetails) => {
        const { batchId, entityAddress, quantity, } = transferDetails;

        const txPromise = writeContractAsync({
            ...otherArgsSupplyChainRegistry,
            functionName: "transferOwnership",
            args: [batchId, entityAddress, quantity]
        });

        toast.promise(txPromise,
            {
                loading: 'Transferring...',
                success: 'Transfer complete!',
                error: (err) => `${(err?.message || 'Unknown error').split(".")[0]}`,
            }
        );

        return txPromise;
    }

    const dispenseMedicine = async (dispenseDetails: DispenseDetails) => {
        const { batchId, quantity, patientId } = dispenseDetails;

        const txPromise = writeContractAsync({
            ...otherArgsSupplyChainRegistry,
            functionName: "dispenseMedicine",
            args: [batchId, quantity, patientId]
        });

        toast.promise(txPromise,
            {
                loading: 'Transferring...',
                success: 'Transfer complete!',
                error: (err) => `${(err?.message || 'Unknown error').split(".")[0]}`,
            }
        );

        return txPromise;
    }

    return {
        transferOwnership,
        dispenseMedicine
    }
}
