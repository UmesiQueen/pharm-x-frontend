import type { Address, Abi } from "viem";
import globalRegistryABI from "@/abis/GlobalRegistryABI.json";
import drugRegistryABI from "@/abis/DrugRegistryABI.json"
import supplyChainRegistryABI from "@/abis/SupplyChainRegistryABI.json"
import { baseSepolia } from "wagmi/chains";
import type { Role } from "@/app/dashboard/stakeholders/types";

const GLOBAL_REGISTRY_ADDRESS = "0x6986C15EEfA43Ff14C01bb18797d7124a95025a7" as Address;
const DRUG_REGISTRY_ADDRESS = "0x589B0657ACeA48e155a4BB463246C9A3A2a4E1Dd" as Address;
const SUPPLY_CHAIN_REGISTRY_ADDRESS = "0x9679F590E6E2dAe1fA2B6aE2979b3Fc6CE586609" as Address;

const otherArgsGlobalRegistry = {
    abi: globalRegistryABI as Abi,
    address: GLOBAL_REGISTRY_ADDRESS,
    chainId: baseSepolia.id,
}

const otherArgsDrugRegistry = {
    abi: drugRegistryABI as Abi,
    address: DRUG_REGISTRY_ADDRESS,
    chainId: baseSepolia.id,
}

const otherArgsSupplyChainRegistry = {
    abi: supplyChainRegistryABI as Abi,
    address: SUPPLY_CHAIN_REGISTRY_ADDRESS,
    chainId: baseSepolia.id,
}

const entityRoles: Role[] = ["None", "Manufacturer", "Supplier", "Pharmacy", "Regulator"];

export {
    GLOBAL_REGISTRY_ADDRESS,
    otherArgsGlobalRegistry,
    entityRoles,
    DRUG_REGISTRY_ADDRESS,
    SUPPLY_CHAIN_REGISTRY_ADDRESS,
    otherArgsDrugRegistry,
    otherArgsSupplyChainRegistry
}
