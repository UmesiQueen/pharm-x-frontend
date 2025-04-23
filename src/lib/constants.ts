import type { Address, Abi } from "viem";
import globalRegistryABI from "@/abis/GlobalRegistryABI.json";
import { baseSepolia } from "wagmi/chains";
import type { Role } from "@/app/dashboard/stakeholders/types";

const GLOBAL_REGISTRY_ADDRESS = "0x6986C15EEfA43Ff14C01bb18797d7124a95025a7" as Address;

const otherArgsGlobalRegistry = {
    abi: globalRegistryABI as Abi,
    address: GLOBAL_REGISTRY_ADDRESS,
    chainId: baseSepolia.id,
}

const entityRoles: Role[] = ["None", "Manufacturer", "Supplier", "Pharmacy", "Regulator"];

export { GLOBAL_REGISTRY_ADDRESS, otherArgsGlobalRegistry, entityRoles }
