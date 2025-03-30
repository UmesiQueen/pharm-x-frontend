import PageTitle from "@/components/PageTitle";
import { Outlet, NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleHelp, Library, Pill, Settings, UsersRound } from "lucide-react";
import WalletAvatar from "@/assets/avatar.png";
import { Button } from "@/components/ui/button";

const DashboardLayout: React.FC = () => {
	return (
		<>
			<PageTitle title="Dashboard" />
			<div className="p-5 bg-[#F5F5F5] min-h-screen grid grid-cols-10 grid-row-12 gap-5 ">
				<div
					id="sidebar"
					className="row-span-12 col-span-2 bg-white rounded-[20px] p-6 pb-4 divide-y-2 flex flex-col gap-10 justify-between"
				>
					<div className="space-y-4">
						<div className="inline-flex items-baseline gap-1 font-aldrich text-2xl">
							<p>Pharm</p>
							<span className="font-arsenal-sc font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF1CF7] to-[#00F0FF]">
								X
							</span>
							<p>Chain</p>
						</div>
						<ul className="*:flex *:items-center *:gap-4 space-y-2">
							<li className="pb-3">
								<Avatar className="cursor-pointer">
									<AvatarImage src="" alt="avatar" />
									<AvatarFallback className="font-acme bg-[#4E46B41F] text-[#4E46B4]">
										MR
									</AvatarFallback>
								</Avatar>
								<div>
									<h2 className="font-medium font-acme">The MRA</h2>
									<p className="text-sm">Regulator</p>
								</div>
							</li>
							<li>
								<NavMenuItem
									slug="stakeholders"
									icon={<UsersRound strokeWidth={1} />}
									title="Stakeholders"
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
				<div className="row-span-1 col-span-8 inline-flex justify-end">
					<Button
						size="lg"
						variant="outline"
						className="flex items-center gap-2 rounded-full px-3 h-12 w-fit"
					>
						<Avatar className="h-8 w-8">
							<AvatarImage src={WalletAvatar} alt="avatar" />
							<AvatarFallback className="font-acme bg-[#4E46B41F] text-[#4E46B4]">
								PFP
							</AvatarFallback>
						</Avatar>
						<p className="font-medium text-sm">0x0ef...8402</p>
					</Button>
				</div>
				<div className="row-span-11 col-span-8 space-y-5">
					<Outlet />
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
};

const NavMenuItem: React.FC<NavMenuItemProps> = ({ slug, icon, title }) => {
	return (
		<NavLink
			to={slug}
			className="inline-flex w-full items-center gap-4 p-2 hover:bg-[#4d46b412] rounded-lg transition-all ease-in duration-200 cursor-pointer hover:font-medium [&.active]:font-medium [&.active]:bg-[#4d46b412]"
		>
			{icon}
			<p>{title}</p>
		</NavLink>
	);
};
