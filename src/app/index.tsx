import React from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
	const { open } = useAppKit();
	const { isConnected } = useAppKitAccount();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (isConnected) navigate("/dashboard");
	}, [isConnected, navigate]);

	const handleConnectWallet = () => {
		if (!isConnected) open({ view: "Connect" });
	};

	return (
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
							A Trustless System for Drug Transparency & Traceability
						</h1>
						<p className="text-xl">
							PharmXChain ensures pharmaceutical authenticity, prevents
							counterfeits, and enhances supply chain transparency with secure
							blockchain tracking
						</p>
					</div>
					<Button onClick={handleConnectWallet}>Connect Wallet</Button>
				</div>
			</div>
		</div>
	);
};

export default Home;
