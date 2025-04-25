import React from "react";
import { format } from "date-fns";
import { EllipsisVertical, Plus, Search, X } from "lucide-react";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	createColumnHelper,
	getFilteredRowModel,
} from "@tanstack/react-table";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Modal, ModalTrigger, ModalContent } from "@/components/ui/modal";
import CreateBatch from "@/components/modals/CreateBatch";
import MedicineHistory from "@/components/modals/MedicineHistory";
import {
	Dialog,
	DialogContent,
	DialogClose,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import TransferOwnership from "@/components/modals/TransferOwnership";
import type { Batch as BatchType } from "@/app/dashboard/batch/types";
import { useReadBatchDetails } from "@/hooks/useReadBatchDetails";
import { Skeleton } from "@/components/ui/skeleton";

const columnHelper = createColumnHelper<BatchType>();

const columns = [
	columnHelper.accessor("batchId", {
		header: "Batch Id",
		cell: (row) => <span className="uppercase">{row.getValue()}</span>,
	}),
	columnHelper.accessor("medicineId", {
		header: "Medicine Id",
		cell: (row) => <span className="uppercase">{row.getValue()}</span>,
	}),
	columnHelper.accessor("quantity", {
		header: "Quantity",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("remainingQuantity", {
		header: "Remaining Qty",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("productionDate", {
		header: "Prod. Date",
		cell: (row) => {
			const dateTime = new Date(row.getValue());
			return <span>{format(dateTime, "PP")}</span>;
		},
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("expiryDate", {
		header: "Expiry Date",
		cell: (row) => {
			const dateTime = new Date(row.getValue());
			return <span>{format(dateTime, "PP")}</span>;
		},
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("isActive", {
		header: "Status",
		cell: (row) => {
			const status = row.getValue() ? "Active" : "Inactive";
			return (
				<div
					className={cn("capitalize rounded-[60px] text-center py-1 w-24", {
						"text-[#2B8B38] bg-[#2B8B381A]": status === "Active",
						"text-red-800 bg-[#7f1d1d4d]": status === "Inactive",
					})}
				>
					{status}
				</div>
			);
		},
		enableGlobalFilter: false,
	}),
];

const userStore = JSON.parse(localStorage.getItem("user") ?? "{}");
const Batch: React.FC = () => {
	const [data, setData] = React.useState<BatchType[] | []>([]);
	const [globalFilter, setGlobalFilters] = React.useState("");
	const { isAllBatchDetailsFetched, isAllBatchDetailsLoading, batchDetails } =
		useReadBatchDetails();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (isAllBatchDetailsFetched) setData(batchDetails);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAllBatchDetailsFetched]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onGlobalFilterChange: setGlobalFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter,
		},
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		table.setGlobalFilter(String(value));
	};

	return (
		<>
			<PageTitle title="Batch" header={true} />
			<div className="flex justify-between">
				<Button
					variant="outline"
					className="h-[48px] w-[360px] p-3 flex items-center gap-2"
				>
					<Search strokeWidth={1} />
					<input
						type="text"
						onChange={handleChange}
						className="bg-transparent w-full focus:outline-none py-1"
						placeholder="Search by batch or medicine id"
					/>
				</Button>
				{userStore.role === "Manufacturer" && (
					<Modal>
						<ModalTrigger asChild>
							<Button variant="outline" className="h-[48px]">
								<Plus />
								<p> Create new batch</p>
							</Button>
						</ModalTrigger>
						<ModalContent>
							<CreateBatch />
						</ModalContent>
					</Modal>
				)}
			</div>
			<Table className="border-separate border-spacing-y-2">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										className="text-black font-semibold"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{!isAllBatchDetailsLoading ? (
						table.getRowModel().rows?.length ? (
							<>
								{table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className="rounded-lg overflow-hidden bg-white hover:bg-[#4d46b412] "
									>
										{row.getVisibleCells().map((cell, index) => (
											<TableCell
												key={cell.id}
												className={cn({
													"rounded-l-lg pl-5": index === 0,
													"rounded-r-lg":
														index === row.getVisibleCells().length,
												})}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
										<TableCell className="rounded-r-lg ">
											<DropdownMenuAndDialog {...row.original} />
										</TableCell>
									</TableRow>
								))}
							</>
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)
					) : (
						Array.from(new Array(4)).map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<TableRow key={index}>
								{table.getVisibleLeafColumns().map((column) => (
									<TableCell key={column.id}>
										<Skeleton className="w-full h-12 rounded-lg" />
									</TableCell>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</>
	);
};

export default Batch;

const DropdownMenuAndDialog: React.FC<BatchType> = (row) => {
	const [showTransfer, setShowTransfer] = React.useState(false);
	const [showHistory, setShowHistory] = React.useState(false);

	function toggleHistory() {
		setShowHistory(!showHistory);
	}
	function toggleTransfer() {
		setShowTransfer(!showTransfer);
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="w-full inline-flex justify-center">
						<Button variant="ghost" size="icon">
							<span className="sr-only">Open menu</span>
							<EllipsisVertical strokeWidth={1} />
						</Button>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className=" w-56 p-2 space-y-1">
					<DropdownMenuItem onClick={toggleHistory}>
						View history
					</DropdownMenuItem>
					<DropdownMenuItem disabled={!row?.isActive} onClick={toggleTransfer}>
						Transfer ownership
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Dialog for medicine history */}
			<Dialog open={showHistory}>
				<DialogContent>
					<VisuallyHidden asChild>
						<DialogTitle>Medicine History</DialogTitle>
					</VisuallyHidden>
					<DialogClose onClick={toggleHistory} asChild>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 z-20 "
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogClose>
					<MedicineHistory {...row} />
					<VisuallyHidden asChild>
						<DialogDescription>
							Detailed life cycle of medicine
						</DialogDescription>
					</VisuallyHidden>
				</DialogContent>
			</Dialog>

			{/* Dialog for transfer */}
			<Dialog open={showTransfer}>
				<DialogContent>
					<VisuallyHidden asChild>
						<DialogTitle>Transfer Ownership</DialogTitle>
					</VisuallyHidden>
					<DialogClose onClick={toggleTransfer} asChild>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 z-20 "
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogClose>
					<TransferOwnership props={{ row, onCloseFn: toggleTransfer }} />
					<VisuallyHidden asChild>
						<DialogDescription>
							Transfer ownership of medicine
						</DialogDescription>
					</VisuallyHidden>
				</DialogContent>
			</Dialog>
		</>
	);
};
