import type { Address } from "viem";

type Role =
    | "None"
    | "Manufacturer"
    | "Supplier"
    | "Pharmacy"
    | "Regulator";

type EntityDetailsResults = [
    string,
    string,
    string,
    string,
    number,
    boolean,
    bigint,
]

type Entity = {
    name: string;
    location: string;
    regNumber: string;
    license: string;
    registrationDate: number;
    role: Role;
    status: boolean;
    address: Address;
};

export type { Role, Entity, EntityDetailsResults }
