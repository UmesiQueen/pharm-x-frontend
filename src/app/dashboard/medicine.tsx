import React from "react";
import { format } from "date-fns";
import {
	EllipsisVertical,
	Plus,
	Search,
	SquareArrowOutUpRight,
} from "lucide-react";
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
import RegisterMedicine from "@/components/modals/RegisterMedicine";
import ClippableAddress from "@/components/ClippableAddress";
import type { Medicine as MedicineType } from "@/app/dashboard/types";

const defaultData: MedicineType[] = [
	{
		medicineId: "M-PAE01",
		name: "Paracetamol",
		brand: "Exzol",
		regDate: 1743310732,
		manufacturer: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
		manufacturerId: "MFG-201",
		approved: true,
	},
	{
		medicineId: "M-PAE02",
		name: "Panadol",
		brand: "Exzol",
		regDate: 1743310732,
		manufacturer: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
		manufacturerId: "MFG-201",
		approved: false,
	},
];

const columnHelper = createColumnHelper<MedicineType>();

const columns = [
	columnHelper.accessor("medicineId", {
		header: "Med. Id",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("brand", {
		header: "Brand",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("regDate", {
		header: "Reg. Date",
		cell: (row) => {
			const dateTime = new Date(row.getValue());
			return <span>{format(dateTime, "PP")}</span>;
		},
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("approved", {
		header: "Approved",
		cell: (row) => {
			const status = row.getValue() ? "True" : "False";
			return (
				<div
					className={cn("capitalize rounded-[60px] text-center py-1 w-16", {
						"text-[#2B8B38] bg-[#2B8B381A]": status === "True",
						"text-red-800 bg-[#7f1d1d4d]": status === "False",
					})}
				>
					{status}
				</div>
			);
		},
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("manufacturer", {
		header: "Mfg. Address",
		cell: (row) => <ClippableAddress text={row.getValue()} />,
		enableGlobalFilter: false,
	}),
	columnHelper.accessor("manufacturerId", {
		header: "Mfg. Id",
		cell: (row) => <span>{row.getValue()}</span>,
		enableGlobalFilter: false,
	}),
];

const Medicine: React.FC = () => {
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
			<PageTitle title="Medicine" header={true} />
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
						placeholder="Search by medicine id or name"
					/>
				</Button>
				<Modal>
					<ModalTrigger asChild>
						<Button variant="outline" className="h-[48px]">
							<Plus />
							<p> Register medicine</p>
						</Button>
					</ModalTrigger>
					<ModalContent>
						<RegisterMedicine />
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
							{table.getRowModel().rows.map((row) => {
								const status = row.getValue("approved");
								return (
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
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<div className="w-full inline-flex justify-center">
														<Button variant="ghost" size="icon">
															<span className="sr-only">Open menu</span>
															<EllipsisVertical strokeWidth={1} />
														</Button>
													</div>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className=" w-56 p-2 space-y-1"
												>
													<DropdownMenuItem>
														{status ? "Disapprove" : "Approve"} medicine
													</DropdownMenuItem>
													<DropdownMenuItem>
														<p className="text-red-600">Delete medicine</p>
													</DropdownMenuItem>
													<DropdownMenuItem>
														<div className="inline-flex w-full justify-between items-center text-blue-600">
															<p>View on block explorer</p>
															<SquareArrowOutUpRight
																strokeWidth={1}
																size={18}
																color="#2563eb"
															/>
														</div>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								);
							})}
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

export default Medicine;
