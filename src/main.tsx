import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import "./index.css";
import { router } from "./routes.tsx";

// 0. Setup queryClient
const queryClient = new QueryClient({
	defaultOptions: {
		queries: { staleTime: 60 * 1000 },
	},
});

// 1. Get projectId from https://cloud.reown.com
const projectId = "608d402c6d140731cc2e6c9fefb202e1";

// 2. Create a metadata object - optional
const metadata = {
	name: "pharm-x-chain",
	description: "AppKit Example",
	url: "https://reown.com/appkit", // origin must match your domain & subdomain
	icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// 3. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
	networks,
	projectId,
	ssr: true,
});

// 5. Create modal
createAppKit({
	adapters: [wagmiAdapter],
	networks,
	projectId,
	metadata,
	features: {
		analytics: true, // Optional - defaults to your Cloud configuration
		email: false,
		socials: false,
	},
	themeMode: "light",
	themeVariables: {
		"--w3m-font-family": "Nato Sans",
		"--w3m-accent": "#4E46B4",
		// "--w3m-border-radius-master": "60px",
		// "--w3m-color-mix": "#4E46B4",
		// "--w3m-color-mix-strength": 40,
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<WagmiProvider config={wagmiAdapter.wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</WagmiProvider>
	</StrictMode>
);
