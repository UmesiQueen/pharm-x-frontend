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
import type { Batch as BatchType } from "@/app/dashboard/types";

const defaultData: BatchType[] = [
	{
		batchId: "B1-PAE01",
		medicineId: "M-PAE01",
		name: "Paracetamol",
		brand: "Exzol",
		quantity: 2000,
		remainingQuantity: 300,
		productionDate: 1743310732,
		expiryDate: 1743310732,
		isActive: true,
		supplyChainEvents: [
			{
				blockHash:
					"0000000000000000027307617d9af9bd8e93b0dd3873b52903196f6068cffa77",
				from: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
				to: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
				eventType: "MANUFACTURED",
				patientId: null,
				timestamp: 1743310742,
			},
			{
				blockHash:
					"000000000000000002730761752903196f6068cd9af9bd8e93b0dd3873bffa77",
				from: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
				to: "0xd03fee254729296a45a3885639AC7E10F9d5A148",
				eventType: "TO_SUPPLIER",
				patientId: null,
				timestamp: 1743310732,
			},
			{
				blockHash:
					"0000000000000000027307617d73b52903196f6068cf9af9bd8e93b0dd38fa77",
				from: "0xd03fee254729296a45a3885639AC7E10F9d5A148",
				to: "0x44444cf1046e68e36E1aA2E0E07105eDDD1d1E9",
				eventType: "TO_PHARMACY",
				patientId: null,
				timestamp: 1743310731,
			},
		],
	},
	{
		batchId: "B1-PAE012",
		medicineId: "M-PAE02",
		name: "Panadol",
		brand: "Exzol",
		quantity: 2000,
		remainingQuantity: 300,
		productionDate: 1743310732,
		expiryDate: 1743310732,
		isActive: false,
		supplyChainEvents: [
			{
				blockHash:
					"00027307617d9af9bd8e93b0dd3873b52903196f6068cff00000000000000a77",
				from: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
				to: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
				eventType: "MANUFACTURED",
				patientId: null,
				timestamp: 1743310742,
			},
		],
	},
];

const columnHelper = createColumnHelper<BatchType>();

const columns = [
	columnHelper.accessor("batchId", {
		header: "Batch Id",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("medicineId", {
		header: "Medicine Id",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("quantity", {
		header: "Quantity",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("remainingQuantity", {
		header: "Remaining Quantity",
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

const Batch: React.FC = () => {
	// const [data, setData] = React.useState(defaultData);
	const [globalFilter, setGlobalFilters] = React.useState("");

	const table = useReactTable({
		data: defaultData,
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
					{table.getRowModel().rows?.length ? (
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
												"rounded-r-lg": index === row.getVisibleCells().length,
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
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
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
				<DialogContent className="overflow-y-scroll max-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
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
