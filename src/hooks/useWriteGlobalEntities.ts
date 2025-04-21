import React from "react";
import { useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import globalRegistryABI from "@/abis/GlobalRegistryABI.json";
import { baseSepolia } from "wagmi/chains";
import type { Abi, Address } from "viem";
import { toast } from "sonner";
import { useReadGlobalEntities } from "@/hooks/useReadGlobalEntities";
import { GLOBAL_REGISTRY_ADDRESS } from "@/lib/constants";

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
    const { isSuccess, isPending, writeContractAsync } = useWriteContract();
    const { entityDetailsQueryKey, entityAddressesQueryKey } = useReadGlobalEntities();
    const queryClient = useQueryClient();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries({ queryKey: entityAddressesQueryKey });
            queryClient.invalidateQueries({ queryKey: entityDetailsQueryKey });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess])


    const deactivateEntity = async (entityAddress: Address) => {
        const txPromise = writeContractAsync({
            ...otherArgs,
            functionName: 'deactivateEntity',
            args: [entityAddress],
        });

        toast.promise(
            txPromise,
            {
                loading: 'Deactivating entity...',
                success: 'Entity deactivated!',
                error: (err) => `${(err?.message || 'Unknown error').split(".")[0]}`,
            }
        );

        return txPromise;
    }

    const activateEntity = async (entityAddress: Address) => {
        const txPromise = writeContractAsync({
            ...otherArgs,
            functionName: 'activateEntity',
            args: [entityAddress],
        })

        toast.promise(
            txPromise,
            {
                loading: 'Activating entity...',
                success: 'Entity activated!',
                error: (err) => `${(err?.message || 'Unknown error').split(".")[0]}`,
            }
        );
        return txPromise;
    }

    const registerEntity = async ({
        entityAddress,
        role,
        name,
        location,
        license,
        registrationNumber
    }: RegisterEntity) => {
        const txPromise = writeContractAsync({
            ...otherArgs,
            functionName: 'registerEntity',
            args: [entityAddress, role, name, location, license, registrationNumber]
        })

        toast.promise(
            txPromise,
            {
                loading: 'Creating entity...',
                success: 'New entity created!',
                error: (err) => `${(err?.message || 'Unknown error').split(".")[0]}`,
            }
        );

        return txPromise;

    }


    return {
        deactivateEntity,
        activateEntity,
        isPending,
        isSuccess,
        registerEntity
    }

}
