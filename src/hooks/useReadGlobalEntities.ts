import { useReadContract, type UseReadContractReturnType, useReadContracts } from "wagmi";
import type { Address } from "viem";
import type { Entity, EntityDetailsResults } from "@/app/dashboard/stakeholders/types";
import { EntityDetailsFactory } from "@/lib/factories/EntityDetailsFactory";
import { entityRoles, otherArgsGlobalRegistry as otherArgs } from "@/lib/constants";


export const useReadGlobalEntities = () => {
    const {
        data: entityAddresses,
        isFetched: isEntityAddressesFetched,
        isPending: isEntityAddressesPending,
        isLoading: isEntityAddressesLoading,
        queryKey: entityAddressesQueryKey
    }: UseReadContractReturnType = useReadContract({
        ...otherArgs,
        functionName: "getRegisteredEntityAddresses",
    })

    const typedEntityAddresses = entityAddresses as Address[];

    const entityDetailsCallList = typedEntityAddresses?.map((address) => ({
        ...otherArgs,
        functionName: "getEntityDetails",
        args: [address],
    }));

    const {
        isFetched: isAllEntityDetailsFetched,
        data: entityDetailsResults,
        queryKey: entityDetailsQueryKey,
        isLoading: isEntityDetailsLoading,
        isRefetching: isEntityDetailsRefetching
    } = useReadContracts({
        contracts: entityDetailsCallList,
        query: {
            enabled: !isEntityAddressesPending
        }
    });

    type EntityDetails = {
        result: EntityDetailsResults;
        status: string;
        error?: string | null;
    };

    const typedEntityDetails = entityDetailsResults as EntityDetails[];

    const entityDetails = typedEntityDetails
        ?.filter((entityDetail) => entityDetail.result !== null)
        ?.map((entityDetail, index) => {
            const [name, location, regNumber, license, role, status, registrationDate] = EntityDetailsFactory(entityDetail.result);

            const newEntityDetail: Entity = {
                name,
                location,
                regNumber,
                license,
                role: entityRoles[role],
                status,
                registrationDate: Number(registrationDate),
                address: typedEntityAddresses[index]
            }

            return newEntityDetail;
        }).reverse();

    const isGlobalEntitiesFetched = isAllEntityDetailsFetched && isEntityAddressesFetched;
    const isAllEntityDetailsLoading = isEntityAddressesLoading || isEntityDetailsLoading;

    return {
        entityAddresses: typedEntityAddresses,
        entityDetails,
        isGlobalEntitiesFetched,
        isAllEntityDetailsLoading,
        entityDetailsQueryKey,
        entityAddressesQueryKey,
        isEntityDetailsRefetching
    }
}





