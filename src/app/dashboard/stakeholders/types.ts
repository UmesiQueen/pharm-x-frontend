import type { Address } from "viem";

type Role =
    | "None"
    | "Manufacturer"
    | "Supplier"
    | "Pharmacy"
    | "Regulator";

type EntityDetailsResults = {
    name: string;
    location: string;
    regNumber: string;
    license: string;
    registrationDate: number | bigint;
    role: Role | number;
    status: boolean;
}

type Entity = EntityDetailsResults & {
    address: Address;
};

export type { Role, Entity, EntityDetailsResults }
