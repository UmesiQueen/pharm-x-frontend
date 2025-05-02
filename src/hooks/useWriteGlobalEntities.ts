import { useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { baseSepolia } from "wagmi/chains";
import { toast } from "sonner";
import type { Abi, Address } from "viem";
import globalRegistryABI from "@/abis/GlobalRegistryABI.json";
import { useReadGlobalEntities } from "@/hooks/useReadGlobalEntities";
import { GLOBAL_REGISTRY_ADDRESS } from "@/lib/constants";
import { useWaitForTransactionReceipt } from "@/hooks/useWaitForTransactionReceipt";

const otherArgs = {
    abi: globalRegistryABI as Abi,
    address: GLOBAL_REGISTRY_ADDRESS,
    chainId: baseSepolia.id,
}

export type RegisterEntity = {
    entityAddress: Address;
    role: number;
    name: string;
    location: string;
    license: string;
    registrationNumber: string;
}

export const useWriteGlobalEntities = () => {
    const { isPending, writeContractAsync } = useWriteContract();
    const { entityAddressesQueryKey, entityDetailsQueryKey } = useReadGlobalEntities();
    const queryClient = useQueryClient();
    const { verifyTransaction } = useWaitForTransactionReceipt();

    const deactivateEntity = async (entityAddress: Address, onSuccess: () => void) => {
        const toastId = toast.loading("Deactivating entity...");
        try {
            await writeContractAsync({
                ...otherArgs,
                functionName: 'deactivateEntity',
                args: [entityAddress],
            }, {
                onSuccess: async (data) => {
                    const result = await verifyTransaction(data, toastId);
                    if (result) {
                        onSuccess();
                        queryClient.invalidateQueries({ queryKey: entityDetailsQueryKey });
                    }
                }
            });
        }
        catch (err) {
            toast.error(err instanceof Error ? (err.message).split(".")[0] : "An error occurred", { id: toastId });
            console.error("Failed to deactivate entity", err);
        }
    }

    const activateEntity = async (entityAddress: Address, onSuccess: () => void) => {
        const toastId = toast.loading("Activating entity...");
        try {
            await writeContractAsync({
                ...otherArgs,
                functionName: 'activateEntity',
                args: [entityAddress]
            },
                {
                    onSuccess: async (data) => {
                        const result = await verifyTransaction(data, toastId);
                        if (result) {
                            onSuccess();
                            queryClient.invalidateQueries({ queryKey: entityDetailsQueryKey });
                        }
                    }
                }
            )
        }
        catch (err) {
            toast.error(err instanceof Error ? (err.message).split(".")[0] : "An error occurred", { id: toastId });
            console.error("Failed to activate entity", err);
        }
    }

    const registerEntity = async ({
        entityAddress,
        role,
        name,
        location,
        license,
        registrationNumber
    }: RegisterEntity, onSuccess: () => void) => {
        const toastId = toast.loading("Creating entity...");
        try {
            await writeContractAsync({
                ...otherArgs,
                functionName: 'registerEntity',
                args: [entityAddress, role, name, location, license, registrationNumber]
            },
                {
                    onSuccess: async (data) => {
                        const result = await verifyTransaction(data, toastId);
                        if (result) {
                            onSuccess();
                            queryClient.invalidateQueries({ queryKey: entityAddressesQueryKey });
                        }
                    }
                }
            )
        }
        catch (err) {
            toast.error(err instanceof Error ? (err.message).split(".")[0] : "An error occurred", { id: toastId });
            console.error("Failed to register entity", err);
        }
    }


    return {
        deactivateEntity,
        activateEntity,
        isPending,
        registerEntity
    }
}
