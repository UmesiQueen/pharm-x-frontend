import type { BatchDetailsResult } from "@/app/dashboard/batch/types";

export const BatchDetailsFactory = (data: BatchDetailsResult) => {
    return data ?? [
        "",
        "",
        0n,
        0n,
        0n,
        0n,
        false,
    ]
}
