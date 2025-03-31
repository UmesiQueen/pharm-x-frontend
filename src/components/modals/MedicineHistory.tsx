import { SquareArrowOutUpRight } from "lucide-react";

const MedicineHistory = () => {
	return (
		<div className="font-space-grotesk">
			<h1 className="font-semibold text-lg px-6">Medicine history</h1>
			<hr className="my-4" />

			<div className="space-y-6">
				{/* Details Section */}
				<div>
					<h2 className="mb-2 px-6">Details</h2>
					<div className="px-6 grid grid-cols-2 gap-y-2">
						<div className="flex items-baseline gap-2 font-light">
							<p className="text-sm text-muted-foreground">Batch ID:</p>
							<p>B1-JSJS3</p>
						</div>
						<div className="flex items-baseline gap-2 font-light">
							<p className="text-sm text-muted-foreground">Medicine ID:</p>
							<p>M-JSJS01</p>
						</div>
					</div>
				</div>

				<hr className="my-4" />

				{/* Batch Trail Section */}
				<div className="relative px-6">
					{/* Vertical timeline line */}
					<div className="absolute left-5 top-0 h-full w-px bg-gray-300"></div>

					<div className="space-y-6 pl-8">
						{/* Manufacturer */}
						<div className="relative">
							<div className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-primary border-4 border-background"></div>
							<div className="flex justify-between items-center">
								<span className="font-medium">Manufactured</span>
								<span className="text-muted-foreground text-sm">5:30pm</span>
							</div>
							<div className="flex justify-between items-center">
								<p className="text-muted-foreground">
									From 0x9e28..49D2 to 0x28f4...d204
								</p>
								<p className="text-muted-foreground text-sm">25th Mar 2025</p>
							</div>
							<a
								href="/"
								className="text-sm hover:underline inline-flex gap-2 items-end justify-end w-full  text-[#4E46B4] hover:text-[#4d46b4bc] "
							>
								<span>View on block explorer </span>
								<SquareArrowOutUpRight size={16} strokeWidth={1} />
							</a>
						</div>

						{/* Supplier */}
						<div className="relative">
							<div className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-primary border-4 border-background"></div>
							<div className="flex justify-between items-center">
								<span className="font-medium">Supplier</span>
								<span className="text-muted-foreground text-sm">5:30pm</span>
							</div>
							<div className="flex justify-between items-center gap-2">
								<p className="text-muted-foreground">
									From 0x9e28..49D2 to 0x28f4...d204
								</p>
								<p className="text-muted-foreground text-sm">25th Mar 2025</p>
							</div>
							<a
								href="/"
								className="text-sm hover:underline inline-flex gap-2 items-end justify-end w-full  text-[#4E46B4] hover:text-[#4d46b4bc]"
							>
								<span>View on block explorer </span>
								<SquareArrowOutUpRight size={16} strokeWidth={1} />
							</a>
						</div>

						{/* Pharmacy */}
						<div className="relative">
							<div className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-primary border-4 border-background"></div>
							<div className="flex justify-between items-center">
								<span className="font-medium">Pharmacy</span>
								<span className="text-muted-foreground text-sm">5:30pm</span>
							</div>
							<div className="flex justify-between items-center">
								<p className="text-muted-foreground">
									From 0x9e28..49D2 to 0x28f4...d204
								</p>
								<p className="text-muted-foreground text-sm">25th Mar 2025</p>
							</div>
							<a
								href="/"
								className="text-sm hover:underline inline-flex gap-2 items-end justify-end w-full  text-[#4E46B4] hover:text-[#4d46b4bc]"
							>
								<span>View on block explorer </span>
								<SquareArrowOutUpRight size={16} strokeWidth={1} />
							</a>
						</div>

						{/* Dispensed */}
						<div className="relative">
							<div className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-primary border-4 border-background"></div>
							<div className="flex justify-between items-center">
								<span className="font-medium">Dispensed</span>
								<span className="text-muted-foreground text-sm">5:30pm</span>
							</div>
							<div className="flex justify-between items-center">
								<p className="text-muted-foreground">
									From 0x9e28..49D2 to 0x28f4...d204
								</p>
								<p className="text-muted-foreground text-sm">25th Mar 2025</p>
							</div>
							<a
								href="/"
								className="text-sm hover:underline inline-flex gap-2 items-end justify-end w-full  text-[#4E46B4] hover:text-[#4d46b4bc]"
							>
								<span>View on block explorer </span>
								<SquareArrowOutUpRight size={16} strokeWidth={1} />
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MedicineHistory;
