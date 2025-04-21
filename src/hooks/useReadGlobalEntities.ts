import globalRegistryABI from "@/abis/GlobalRegistryABI.json";
import { useReadContract, type UseReadContractReturnType, useReadContracts } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import type { Abi, Address } from "viem";
import { EntityAddressFactory } from "@/lib/factories/EntityAddressFactory";
import type { Role, Entity, EntityDetailsResults } from "@/app/dashboard/stakeholders/types";
import { EntityDetailsFactory } from "@/lib/factories/EntityDetailsFactory";
import { GLOBAL_REGISTRY_ADDRESS } from "@/lib/constants";

const otherArgs = {
    abi: globalRegistryABI as Abi,
    address: GLOBAL_REGISTRY_ADDRESS,
    chainId: baseSepolia.id,
}

export const useReadGlobalEntities = () => {
    const {
        data: entityAddresses,
        isFetched: isEntityAddressesFetched,
        isFetching: isEntityAddressesFetching,
        queryKey: entityAddressesQueryKey
    }: UseReadContractReturnType = useReadContract({
        ...otherArgs,
        functionName: "getRegisteredEntityAddresses",
    })

    const typedEntityAddresses = EntityAddressFactory(entityAddresses as Address[]);

    const entityDetailsCallList = typedEntityAddresses.map((address) => ({
        ...otherArgs,
        functionName: "getEntityDetails",
        args: [address],
    }));

    const { isFetched: isAllEntityDetailsFetched, data: entityDetailsResults, isFetching: isAllEntityDetailsFetching, queryKey: entityDetailsQueryKey } = useReadContracts({
        contracts: entityDetailsCallList,
        query: {
            enabled: isEntityAddressesFetched
        }
    });

    type EntityDetails = {
        result: EntityDetailsResults;
        status: string;
        error?: string | null;
    };

    const entityRole: Role[] = ["None", "Manufacturer", "Supplier", "Pharmacy", "Regulator"];

    const typedEntityDetails = entityDetailsResults as EntityDetails[];

    const entityDetails = typedEntityDetails?.map((entityDetail, index) => {
        const [name, location, regNumber, license, role, status, registrationDate] = EntityDetailsFactory(entityDetail?.result);

        const newEntityDetail: Entity = {
            name,
            location,
            regNumber,
            license,
            role: entityRole[role],
            status,
            registrationDate: Number(registrationDate),
            address: typedEntityAddresses[index]
        }

        return newEntityDetail;
    }).reverse();

    const isGlobalEntitiesFetched = isAllEntityDetailsFetched && isEntityAddressesFetched;
    const isGlobalEntitiesFetching = isAllEntityDetailsFetching || isEntityAddressesFetching;

    return {
        entityAddresses: typedEntityAddresses,
        entityDetails,
        isGlobalEntitiesFetched,
        isGlobalEntitiesFetching,
        entityDetailsQueryKey,
        entityAddressesQueryKey
    }
}





