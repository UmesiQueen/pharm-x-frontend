import React from "react";
import {
	useAppKit,
	useAppKitAccount,
	useDisconnect,
} from "@reown/appkit/react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { entityRoles, otherArgsGlobalRegistry } from "@/lib/constants";
import { useReadContract } from "wagmi";
import type {
	Entity,
	EntityDetailsResults,
} from "@/app/dashboard/stakeholders/types";
import type { Address } from "viem";
import PageTitle from "@/components/PageTitle";
import { toast } from "sonner";

const Home: React.FC = () => {
	const { open } = useAppKit();
	const { isConnected, address } = useAppKitAccount();
	const { disconnect } = useDisconnect();
	const navigate = useNavigate();

	const {
		data: entityDetailsResult,
		isSuccess,
		isFetched,
		isFetching,
	} = useReadContract({
		...otherArgsGlobalRegistry,
		functionName: "getEntityDetails",
		args: [address],
		query: { enabled: isConnected },
	});

	const typedEntityDetailsResult = entityDetailsResult as EntityDetailsResults;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (isConnected && isFetched) {
			toast.dismiss("loader");
			if (isSuccess) {
				const entityDetails: Entity = {
					name: typedEntityDetailsResult[0],
					location: typedEntityDetailsResult[1],
					regNumber: typedEntityDetailsResult[2],
					license: typedEntityDetailsResult[3],
					role: entityRoles[typedEntityDetailsResult[4]],
					status: typedEntityDetailsResult[5],
					registrationDate: Number(typedEntityDetailsResult[6]),
					address: address as Address,
				};
				localStorage.setItem("user", JSON.stringify(entityDetails));
				navigate("/app");
			} else {
				toast.error("Entity is not recognized", {
					description: "Switch to registered address or signup to register",
				});
				disconnect();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFetched, isConnected]);

	React.useEffect(() => {
		if (isFetching)
			toast.loading("Retrieving entity details", { id: "loader" });
	}, [isFetching]);

	const handleConnectWallet = () => {
		if (!isConnected) open({ view: "Connect" });
	};

	return (
		<>
			<PageTitle title="Pharm-X-Chain" />
			<div className="min-h-screen flex flex-col *:w-full bg-hero-pattern bg-bottom bg-cover text-[#0F0F0F] p-[30px]">
				<nav>
					<ul
						id="nav-items"
						className="flex justify-between items-center *:flex-1 *:w-full font-medium"
					>
						<li className="inline-flex items-baseline gap-1 font-aldrich text-3xl">
							<p>Pharm</p>
							<span className="font-arsenal-sc font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF1CF7] to-[#00F0FF]">
								X
							</span>
							<p>Chain</p>
						</li>
						<li>
							<ul className="flex gap-5 justify-center cursor-pointer">
								<li>About us</li>
								<li>Documentation</li>
								<li>Contact</li>
							</ul>
						</li>
						<li className="inline-flex justify-end">
							<Button>Sign Up</Button>
						</li>
					</ul>
				</nav>
				<div className="flex-grow flex items-center justify-center">
					<div className="w-[954px] text-center">
						<div className="px-5 pb-5 space-y-5">
							<h1 className="font-acme text-7xl text-[#0D0D0D]">
								A Trustless System for Drug Traceability & Transparency
							</h1>
							<p className="text-xl">
								PharmXChain is a decentralized application that ensures
								pharmaceutical authenticity, prevents counterfeits, and enhances
								supply chain transparency with secure blockchain tracking
							</p>
						</div>
						<Button onClick={handleConnectWallet}>Connect Wallet</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
