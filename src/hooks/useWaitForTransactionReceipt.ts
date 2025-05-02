import type { Hash } from "viem";
import { toast } from "sonner";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useConfig } from "wagmi";

export const useWaitForTransactionReceipt = () => {
    const config = useConfig();

    const verifyTransaction = async (hash: Hash, toastId: string | number) => {
        toast.loading("Confirming transaction...", { id: toastId })
        try {
            const tx = await waitForTransactionReceipt(config, { hash });
            if (tx)
                toast.success("Transaction successful", { id: toastId });
            return tx;
        }
        catch (err) {
            toast.error(err instanceof Error ? (err.message).split(".")[0] : "An error occurred", { id: toastId });
            console.error("Could not verify transaction", err);
        }
    }

    return {
        verifyTransaction
    }
}
