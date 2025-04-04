import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeftSquare } from "lucide-react";
import { useNavigate } from "react-router";

const PageNotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="w-full min-h-screen grid grid-cols-2 *:w-full *:h-full p-5">
			<div className="p-5 flex flex-col">
				<Link to="/">
					<div className="inline-flex items-baseline gap-1 font-aldrich text-2xl">
						<p>Pharm</p>
						<span className="font-arsenal-sc font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF1CF7] to-[#00F0FF]">
							X
						</span>
						<p>Chain</p>
					</div>
				</Link>
				<div className="flex-grow flex items-center">
					<div className="space-y-7">
						<p className="text-[#7B5FF1] text-xl font-semibold ">404</p>
						<h1 className="font-bold text-6xl ">Page not found</h1>
						<p className="text-lg">
							Sorry, we couldn’t find the page you’re looking for.
						</p>
						<Button onClick={() => navigate("/dashboard")}>
							<ArrowLeftSquare /> Back to home
						</Button>
					</div>
				</div>
			</div>
			<div className="bg-error bg-contain bg-no-repeat bg-center" />
		</div>
	);
};

export default PageNotFound;
