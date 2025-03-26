import { Outlet } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App: React.FC = () => {
	return (
		<>
			<h1>App</h1>
			<Outlet />
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
};

export default App;
