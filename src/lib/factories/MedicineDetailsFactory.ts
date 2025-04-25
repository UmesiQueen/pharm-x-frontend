import type { MedicineDetailsResults } from '@/app/dashboard/medicine/types';

export const MedicineDetailsFactory = (data: MedicineDetailsResults) => {
    return data ?? [
        "",
        "",
        "",
        "",
        "",
        "",
        0n,
        "0x0000000000000000000000000000000000000000",
        0,
        false,
    ]
}
