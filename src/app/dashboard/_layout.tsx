import React from "react";
import Badge from "@mui/material/Badge";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import PageTitle from "@/components/PageTitle";
import { Outlet, NavLink, Link, Navigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Bell,
	CircleHelp,
	Library,
	Pill,
	Search,
	Settings,
	ShieldCheck,
	UsersRound,
} from "lucide-react";
import WalletAvatar from "@/assets/avatar.png";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { truncateAddress } from "@/lib/utils";

const appKitConnectionStatus =
	localStorage.getItem("@appkit/connection_status") ?? "";
const userStore = JSON.parse(localStorage.getItem("user") ?? "{}");

const DashboardLayout: React.FC = () => {
	const { open } = useAppKit();
	const { address, isConnected } = useAppKitAccount();

	React.useEffect(() => {
		if (Object.keys(userStore).length) {
			if (userStore.address !== address || !isConnected) {
				localStorage.removeItem("user");
			}
		}
	}, [address, isConnected]);

	const handleAccountClick = () => {
		open({ view: "Account" });
	};

	const isAuthenticated =
		appKitConnectionStatus === "connected" && Object.keys(userStore).length > 0;

	if (!isAuthenticated) return <Navigate to="/" />;

	return (
		<>
			<PageTitle title="Dashboard" />
			<div className="p-5 bg-[#F5F5F5] min-h-screen grid grid-cols-10 grid-row-12 gap-5 ">
				<div
					id="sidebar"
					className="row-span-12 col-span-2 bg-white rounded-[20px] p-6 pb-4 divide-y-2 flex flex-col gap-10 justify-between"
				>
					<div className="space-y-4">
						<Link to="/">
							<div className="inline-flex items-baseline gap-1 font-aldrich text-2xl">
								<p>Pharm</p>
								<span className="font-arsenal-sc font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF1CF7] to-[#00F0FF]">
									X
								</span>
								<p>Chain</p>
							</div>
						</Link>
						<ul className="*:flex *:items-center *:gap-4 space-y-2">
							<li className="pb-3">
								<Avatar className="cursor-pointer">
									<AvatarImage src="" alt="avatar" />
									<AvatarFallback className="font-acme bg-[#4E46B41F] text-[#4E46B4]">
										{userStore.regNumber.split("-")[0]}
									</AvatarFallback>
								</Avatar>
								<div>
									<h2 className="font-medium text-xl font-acme capitalize">
										{userStore.name}
									</h2>
									<p className="text-sm"> {userStore.role}</p>
								</div>
							</li>
							<li>
								<NavMenuItem
									slug="/app"
									icon={<Search strokeWidth={1} />}
									title="Search"
								/>
							</li>
							<li>
								<NavMenuItem
									slug="verify"
									icon={<ShieldCheck strokeWidth={1} />}
									title="Verify Drug"
								/>
							</li>
							<li>
								<NavMenuItem
									slug="medicine"
									icon={<Pill strokeWidth={1} />}
									title="Medicine"
								/>
							</li>
							<li>
								<NavMenuItem
									slug="batch"
									icon={<Library strokeWidth={1} />}
									title="Batch"
								/>
							</li>
							<li>
								<NavMenuItem
									slug="stakeholders"
									icon={<UsersRound strokeWidth={1} />}
									title="Stakeholders"
								/>
							</li>
						</ul>
					</div>
					<div className="pt-3">
						<ul className="*:flex *:items-center *:gap-4 space-y-2">
							<li>
								<NavMenuItem
									slug="settings"
									icon={<Settings strokeWidth={1} />}
									title="Settings"
								/>
							</li>
							<li>
								<NavMenuItem
									slug="support"
									icon={<CircleHelp strokeWidth={1} />}
									title="Support"
								/>
							</li>
						</ul>
					</div>
				</div>
				<div className="row-span-12 col-span-8 space-y-5">
					<div className="flex gap-3 items-center justify-end">
						<NotificationBadge />
						<Button
							size="lg"
							variant="outline"
							onClick={handleAccountClick}
							className="flex items-center gap-2 rounded-full px-3 h-10 w-fit"
						>
							<Avatar className="h-6 w-6">
								<AvatarImage src={WalletAvatar} alt="avatar" />
								<AvatarFallback className="font-acme bg-[#4E46B41F] text-[#4E46B4]">
									PFP
								</AvatarFallback>
							</Avatar>
							<p className="font-medium text-xs">
								{truncateAddress(String(address ?? userStore?.address))}
							</p>
						</Button>
					</div>
					<div className="space-y-5">
						<Outlet />
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardLayout;

type NavMenuItemProps = {
	slug: string;
	icon: React.ReactNode;
	title: string;
	disabled?: boolean;
};

const NavMenuItem: React.FC<NavMenuItemProps> = ({ slug, icon, title }) => {
	return (
		<NavLink
			to={slug}
			end
			className="inline-flex w-full items-center gap-4 p-2 hover:bg-[#4d46b412] rounded-lg transition-all ease-in duration-200 cursor-pointer hover:font-medium [&.active]:font-medium [&.active]:bg-[#4d46b412]"
		>
			{icon}
			<p>{title}</p>
		</NavLink>
	);
};

const NotificationBadge = () => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					className="rounded-full w-10 h-10"
					variant="outline"
				>
					<Badge
						badgeContent={2}
						color="info"
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
					>
						<Bell absoluteStrokeWidth />
					</Badge>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-3 min-w-80 ">
				<div className="min-h-56 font-space-grotesk space-y-2">
					<div className="shadow-[0px_3px_8px_rgba(0,0,0,0.24)] rounded-md p-2">
						<h3 className="text-sm font-medium text-red-800">
							Low Stock Alert
						</h3>
						<div className="flex justify-between items-center gap-2 text-xs">
							<p>
								<span className="font-light">Medicine Id:</span>{" "}
								<span>M-PAE302</span>
							</p>
							<p>
								<b>4</b> left
							</p>
						</div>
					</div>
					<div className="shadow-[0px_3px_8px_rgba(0,0,0,0.24)] rounded-md p-2">
						<h3 className="text-sm font-medium text-red-800">
							Low Stock Alert
						</h3>
						<div className="flex justify-between items-center gap-2 text-xs">
							<p>
								<span className="font-light">Medicine Id:</span>{" "}
								<span>M-PAE302</span>
							</p>
							<p>
								<b>2</b> left
							</p>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
