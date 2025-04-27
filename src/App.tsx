import { Outlet } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";

const App: React.FC = () => {
	return (
		<ErrorBoundary FallbackComponent={Fallback}>
			<div className="font-space-grotesk">
				<Outlet />
			</div>
			<Toaster position="bottom-left" />
			<ReactQueryDevtools initialIsOpen={false} />
		</ErrorBoundary>
	);
};

export default App;

const Fallback = ({
	error,
	resetErrorBoundary,
}: {
	error: Error;
	resetErrorBoundary: () => void;
}) => {
	// Call resetErrorBoundary() to reset the error boundary and retry the render.
	setTimeout(() => resetErrorBoundary(), 5000);
	return (
		<div>
			<p>Something went wrong:</p>
			<pre style={{ color: "red" }}>{error.message}</pre>
		</div>
	);
};
