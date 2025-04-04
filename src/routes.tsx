import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "@/app/index";
import DashboardLayout from "@/app/dashboard/_layout";
import Stakeholders from "@/app/dashboard/stakeholder";
import Medicine from "@/app/dashboard/medicine";
import Batch from "@/app/dashboard/batch";
import PageNotFound from "@/app/page-not-found";
import Search from "@/app/dashboard/search";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: App,
		children: [
			{ index: true, Component: Home },
			{
				path: "dashboard",
				Component: DashboardLayout,
				children: [
					{ path: "stakeholders", Component: Stakeholders },
					{ path: "medicine", Component: Medicine },
					{ path: "batch", Component: Batch },
					{ index: true, Component: Search },
				],
			},
			{ path: "*", Component: PageNotFound },
		],
	},
]);
