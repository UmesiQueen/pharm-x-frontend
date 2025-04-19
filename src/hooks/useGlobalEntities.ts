import globalRegistryABI from "@/abis/GlobalRegistryABI.json";
import { useReadContract, type UseReadContractReturnType, useReadContracts } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import type { Abi, Address } from "viem";
import { EntityAddressFactory } from "@/lib/factories/EntityAddressFactory";
import type { Role, Entity, EntityDetailsResults } from "@/app/dashboard/stakeholders/types";
import { EntityDetailsFactory } from "@/lib/factories/EntityDetailsFactory";

const GLOBAL_REGISTRY_ADDRESS = "0x6986C15EEfA43Ff14C01bb18797d7124a95025a7" as Address;

const query = {
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
    // Don't refetch on component mount
    refetchOnMount: false,
    // Keep data cached for 5 minutes
    staleTime: 1000 * 60 * 5,
}
const otherArgs = {
    abi: globalRegistryABI as Abi,
    address: GLOBAL_REGISTRY_ADDRESS,
    chainId: baseSepolia.id,
    query
}

export const useGlobalEntities = () => {
    const {
        data: entityAddresses,
        isFetched: isEntityAddressesFetched,
        isFetching: isEntityAddressesFetching,
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

    const { isFetched: isAllEntityDetailsFetched, data: entityDetailsResults, isFetching: isAllEntityDetailsFetching } = useReadContracts({
        contracts: entityDetailsCallList,
        query
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
        isGlobalEntitiesFetching
    }
}





