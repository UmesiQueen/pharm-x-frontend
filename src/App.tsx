import { Outlet } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import NoMobileViewImg from "./assets/no_mobile_view.jpg"; // Adjust path as needed
import { useState, useEffect } from "react";

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    return isMobile;
}

function NoMobileView() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="px-5 pt-14 flex flex-col gap-5 items-center max-w-[500px] mx-auto">
                <img src={NoMobileViewImg} alt="NoMobileView" className="mix-blend-multiply w-40 aspect-square" />
                <p className="text-center font-medium">
                    We&apos;re sorry, but it seems the current page cannot be viewed on your
                    device due to the screen size limitation. To ensure the best user experience
                    and readability, the page you&apos;re trying to access requires a larger screen size (min-width 1024px).
                </p>
            </div>
        </div>
    );
}

function Fallback({
    error,
    resetErrorBoundary,
}: {
    error: Error;
    resetErrorBoundary: () => void;
}) {
    setTimeout(() => resetErrorBoundary(), 5000);
    return (
        <div>
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>{error.message}</pre>
        </div>
    );
}

const App: React.FC = () => {
    const isMobile = useIsMobile();

    if (isMobile) return <NoMobileView />;

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
