// import { SquareArrowOutUpRight } from "lucide-react";
import { format } from "date-fns";
import type { Batch } from "@/app/dashboard/batch/types";
import ClippableAddress from "@/components/ClippableAddress";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useReadContract } from "wagmi";
import { otherArgsSupplyChainRegistry } from "@/lib/constants";

type EventType = "MANUFACTURED" | "TO_SUPPLIER" | "TO_PHARMACY" | "DISPENSED";

const batchEvent: EventType[] = [
	"MANUFACTURED",
	"TO_SUPPLIER",
	"TO_PHARMACY",
	"DISPENSED",
];

type SupplyChainEvent = {
	batchId: string;
	medicineId: string;
	fromEntity: string;
	toEntity: string;
	eventType: EventType;
	patientId: string;
	timestamp: number;
};

const MedicineHistory: React.FC<Batch> = ({ batchId, medicineId }) => {
	const [supplyChainEvents, setSupplyChainEvents] = React.useState<
		SupplyChainEvent[] | []
	>([]);

	const { data, isFetched, isLoading } = useReadContract({
		...otherArgsSupplyChainRegistry,
		functionName: "getBatchEvents",
		args: [batchId],
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (isFetched) {
			if (Array.isArray(data)) {
				const batchEventsArray = data.map((event) => ({
					...event,
					timestamp: Number(event?.timestamp),
					eventType: batchEvent[event?.eventType],
				}));
				setSupplyChainEvents(batchEventsArray);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFetched]);

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
							<p className="uppercase">{batchId}</p>
						</div>
						<div className="flex items-baseline gap-2 font-light">
							<p className="text-sm text-muted-foreground">Medicine ID:</p>
							<p className="uppercase">{medicineId}</p>
						</div>
					</div>
				</div>

				<hr className="my-4" />

				{/* Batch Trail Section */}
				<div className="relative px-6">
					{/* Vertical timeline line */}
					<div className="absolute left-5 top-0 h-full w-px bg-gray-300" />

					<div className="space-y-6 pl-8">
						{!isLoading
							? supplyChainEvents.map((event, index) => {
									const dateTime = new Date(event.timestamp);
									const keyStr = `E-${index}`;
									return (
										<div key={keyStr} className="relative">
											<div className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-primary border-4 border-background" />
											<div className="flex justify-between items-center">
												<span className="font-medium">{event.eventType}</span>
												<span className="text-muted-foreground text-sm">
													{format(dateTime, "p")}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<p className="text-muted-foreground">
													From <ClippableAddress text={event.fromEntity} /> to{" "}
													<ClippableAddress text={event.toEntity} />
												</p>
												<p className="text-muted-foreground text-sm">
													{format(dateTime, "PP")}
												</p>
											</div>
											{/* <a
										href="/"
										className="text-sm hover:underline inline-flex gap-1 items-center  w-full  text-[#4E46B4] hover:text-[#4d46b4bc] "
									>
										<span>View on block explorer </span>
										<SquareArrowOutUpRight size={14} strokeWidth={1} />
									</a> */}
										</div>
									);
							  })
							: Array.from(new Array(3)).map((_, index) => {
									const keyStr = `SK-${index}`;
									return (
										<div key={keyStr} className="relative">
											{/* Circle dot indicator */}
											<div className="absolute -left-8 top-2 h-3 w-3 rounded-full bg-gray-200 border-4 border-background" />

											{/* First row with event type and time */}
											<div className="flex justify-between items-center mb-2">
												<Skeleton className="h-5 w-24" />
												<Skeleton className="h-4 w-16" />
											</div>

											{/* Second row with a single skeleton and date */}
											<div className="flex justify-between items-center">
												<Skeleton className="h-4 w-64" />
												<Skeleton className="h-4 w-20" />
											</div>
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
