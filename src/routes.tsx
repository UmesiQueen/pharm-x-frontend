import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "@/app/index";
import DashboardLayout from "@/app/dashboard/layout";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: App,
		children: [
			{ index: true, Component: Home },
			{ path: "/dashboard", Component: DashboardLayout },
		],
	},
]);
