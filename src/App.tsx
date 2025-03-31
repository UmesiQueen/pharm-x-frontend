import { Outlet } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

const App: React.FC = () => {
	return (
		<>
			<div className="font-space-grotesk">
				<Outlet />
			</div>
			<Toaster position="bottom-right" />
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
};

export default App;
