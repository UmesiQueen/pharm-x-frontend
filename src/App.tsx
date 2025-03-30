import { Outlet } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App: React.FC = () => {
	return (
		<>
			<div className="font-space-grotesk">
				<Outlet />
			</div>
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
};

export default App;
