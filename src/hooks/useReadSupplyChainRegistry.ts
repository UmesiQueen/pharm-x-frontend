import React from "react";
import { useReadContract } from "wagmi";
import { readContract } from '@wagmi/core';
import { otherArgsSupplyChainRegistry } from "@/lib/constants";
import { global_ctx } from "@/app/dashboard/_layout";
import type { MedicineDetails, MedicineHolders, MedicineHoldersResult } from "@/app/dashboard/search/types";
import { http, createConfig } from '@wagmi/core'
import { baseSepolia } from '@wagmi/core/chains'
// import type { MedicineHoldersResult } from "@/app/dashboard/search/types";

const config = createConfig({
    chains: [baseSepolia],
    transports: {
        [baseSepolia.id]: http(),
    },
})

export const useReadSupplyChainRegistry = () => {
    const { userStore } = React.useContext(global_ctx);
    const [holdersData, setHoldersData] = React.useState<MedicineHolders[] | []>([]);
    const [isHoldersLoading, setIsHoldersLoading] = React.useState(false);

    const {
        data: availableMedicines,
        isFetched: isAvailableMedicinesFetched,
        isLoading: isAvailableMedicinesLoading
    } = useReadContract({
        ...otherArgsSupplyChainRegistry,
        functionName: "getEntityMedicines",
        args: [userStore?.address]
    });

    const typedAvailableMedicines = availableMedicines as MedicineDetails[];

    const getMedicineHolders = async (medicineId: string) => {
        setIsHoldersLoading(true);
        const { abi, address } = otherArgsSupplyChainRegistry;
        try {
            const result = await readContract(config, {
                abi,
                address,
                functionName: "getMedicineHoldersDetails",
                args: [medicineId]
            })
            if (result) {
                if (Array(result).length > 0) {
                    const typedArray = result as MedicineHoldersResult[];
                    const newArray: MedicineHolders[] = typedArray.map((item) => ({
                        medicineId,
                        ...item
                    }));
                    setHoldersData(newArray);
                }
            }
        } catch (err) {
            console.error("An error occurred", err);
        }
        finally {
            setIsHoldersLoading(false);
        }
    }

    return {
        availableMedicines: typedAvailableMedicines,
        isAvailableMedicinesFetched,
        isAvailableMedicinesLoading,
        getMedicineHolders,
        isHoldersLoading,
        medicineHoldersData: holdersData
    }
}
