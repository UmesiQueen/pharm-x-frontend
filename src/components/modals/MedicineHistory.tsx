import { SquareArrowOutUpRight } from "lucide-react";
import { format } from "date-fns";
import type { Batch } from "@/app/dashboard/types";
import ClippableAddress from "@/components/ClippableAddress";

const MedicineHistory: React.FC<Batch> = ({
	batchId,
	medicineId,
	supplyChainEvents,
}) => {
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
							<p>{batchId}</p>
						</div>
						<div className="flex items-baseline gap-2 font-light">
							<p className="text-sm text-muted-foreground">Medicine ID:</p>
							<p>{medicineId}</p>
						</div>
					</div>
				</div>

				<hr className="my-4" />

				{/* Batch Trail Section */}
				<div className="relative px-6">
					{/* Vertical timeline line */}
					<div className="absolute left-5 top-0 h-full w-px bg-gray-300" />

					<div className="space-y-6 pl-8">
						{supplyChainEvents.map((event) => {
							const dateTime = new Date(event.timestamp);
							return (
								<div key={event.blockHash} className="relative">
									<div className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-primary border-4 border-background" />
									<div className="flex justify-between items-center">
										<span className="font-medium">{event.eventType}</span>
										<span className="text-muted-foreground text-sm">
											{format(dateTime, "p")}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<p className="text-muted-foreground">
											From <ClippableAddress text={event.from} /> to{" "}
											<ClippableAddress text={event.to} />
										</p>
										<p className="text-muted-foreground text-sm">
											{format(dateTime, "PP")}
										</p>
									</div>
									<a
										href="/"
										className="text-sm hover:underline inline-flex gap-1 items-center  w-full  text-[#4E46B4] hover:text-[#4d46b4bc] "
									>
										<span>View on block explorer </span>
										<SquareArrowOutUpRight size={14} strokeWidth={1} />
									</a>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MedicineHistory;
