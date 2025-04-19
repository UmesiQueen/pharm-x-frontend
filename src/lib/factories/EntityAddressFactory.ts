import type { Address } from "viem";

export const EntityAddressFactory = (data: Address[]) => {
    return (
        data ?? ["0x0000000000000000000000000000000000000000"]
    );
};
