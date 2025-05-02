import { useReadContract, useReadContracts } from "wagmi";
import { otherArgsDrugRegistry } from "@/lib/constants";
import type { Medicine, MedicineDetailsResults } from "@/app/dashboard/medicine/types";
import { MedicineDetailsFactory } from "@/lib/factories/MedicineDetailsFactory";

export const useReadMedicineDetails = () => {
    const {
        data: medicineIds,
        isFetched: isMedicineIdsFetched,
        queryKey: medicinesIdsQueryKey,
        isPending: isMedicineIdsPending,
        isLoading: isMedicineIdsLoading
    } = useReadContract({
        ...otherArgsDrugRegistry,
        functionName: "getMedicineIds"
    });

    const typedRegisteredMedicines = medicineIds as string[];

    const medicineDetailsCallList = typedRegisteredMedicines?.map((medicineId) => ({
        ...otherArgsDrugRegistry,
        functionName: "getMedicineDetailsById",
        args: [medicineId],
    }));

    const {
        data: medicineDetailsResults,
        isFetched: isMedicineDetailsFetched,
        queryKey: medicineDetailsQueryKey,
        isLoading: isMedicineDetailsLoading,
        isRefetching: isMedicineDetailsRefetching
    } = useReadContracts({
        contracts: medicineDetailsCallList,
        query: {
            enabled: !isMedicineIdsPending
        }
    });

    type MedicineDetails = {
        result: MedicineDetailsResults;
        status: string;
        error?: string | null;
    }

    const typedMedicineDetails = medicineDetailsResults as MedicineDetails[];

    const medicineDetails = typedMedicineDetails
        ?.filter((medicineDetail) => medicineDetail.result !== null)
        ?.map((medicineDetail) => {
            const [
                medicineId,
                serialNo,
                name,
                brand,
                ingredients,
                details,
                registrationDate,
                manufacturer,
                manufacturerId,
                approved,
            ] = MedicineDetailsFactory(medicineDetail.result);

            const newMedicineDetail: Medicine = {
                medicineId,
                serialNo,
                name,
                brand,
                ingredients,
                details,
                registrationDate: Number(registrationDate),
                manufacturer,
                manufacturerId,
                approved,
            };

            return newMedicineDetail;
        }).reverse();

    const isAllMedicineDetailsFetched = isMedicineDetailsFetched && isMedicineIdsFetched;
    const isAllMedicineDetailsLoading = isMedicineDetailsLoading || isMedicineIdsLoading;

    return {
        medicinesIdsQueryKey,
        medicineDetailsQueryKey,
        isAllMedicineDetailsFetched,
        isAllMedicineDetailsLoading,
        medicineIds: typedRegisteredMedicines,
        medicineDetails,
        isMedicineDetailsRefetching
    }
}





