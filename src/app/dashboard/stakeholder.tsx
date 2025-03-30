import PageTitle from "@/components/PageTitle";
import { Copy, EllipsisVertical, Plus, Search } from "lucide-react";
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
	flexRender,
	getCoreRowModel,
	useReactTable,
	createColumnHelper,
} from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn, truncateAddress } from "@/lib/utils";

const Stakeholders: React.FC = () => {
	return (
		<>
			<PageTitle title="Stakeholders" header={true} />
			<div className="flex justify-between">
				<Button
					variant="outline"
					className="h-[48px] w-[360px] p-3 flex items-center gap-2"
				>
					<Search strokeWidth={1} />
					<input
						type="text"
						className="bg-transparent w-full focus:outline-none py-1"
						placeholder="Search by reg.no, name or address"
					/>
				</Button>
				<Button variant="outline" className="h-[48px]">
					<Plus />
					<p> Add entity</p>
				</Button>
			</div>
			<DataTable />
		</>
	);
};

export default Stakeholders;

type Role = "Manufacturer" | "Supplier" | "Pharmacy";

type Entity = {
	name: string;
	location: string;
	regNumber: string;
	regDate: number;
	role: Role;
	status: boolean;
	address: string;
};

const defaultData: Entity[] = [
	{
		name: "MediCure Labs",
		location: "Nairobi, Kenya",
		regNumber: "MFG-201",
		regDate: 1743310732,
		role: "Manufacturer",
		status: true,
		address: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
	},
	{
		name: "MediCure Labs",
		location: "Nairobi, Kenya",
		regNumber: "MFG-201",
		regDate: 1743310732,
		role: "Manufacturer",
		status: true,
		address: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
	},
	{
		name: "MediCure Labs",
		location: "Nairobi, Kenya",
		regNumber: "MFG-201",
		regDate: 1743310732,
		role: "Manufacturer",
		status: true,
		address: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
	},
	{
		name: "MediCure Labs",
		location: "Nairobi, Kenya",
		regNumber: "MFG-201",
		regDate: 1743310732,
		role: "Manufacturer",
		status: false,
		address: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
	},
	{
		name: "MediCure Labs",
		location: "Nairobi, Kenya",
		regNumber: "MFG-201",
		regDate: 1743310732,
		role: "Manufacturer",
		status: true,
		address: "0x2A3Ee8aA2E2985015dDA5841E00Db04cdf099D5b",
	},
];

const columnHelper = createColumnHelper<Entity>();

const columns = [
	columnHelper.accessor("regNumber", {
		header: "Reg. Number",
		cell: (row) => <span className="uppercase">{row.getValue()}</span>,
	}),
	columnHelper.accessor("name", {
		header: "Name",
		cell: (row) => <span>{row.getValue()}</span>,
	}),
	columnHelper.accessor("location", {
		header: "Location",
		cell: (row) => <span className="capitalize">{row.getValue()}</span>,
	}),
	columnHelper.accessor("role", {
		header: "Role",
		cell: (row) => <span className="capitalize">{row.getValue()}</span>,
	}),
	columnHelper.accessor("status", {
		header: "Status",
		cell: (row) => {
			const status = row.getValue() ? "Active" : "Inactive";
			return (
				<div
					className={cn("capitalize rounded-[60px] text-center py-1 w-28", {
						"text-[#2B8B38] bg-[#2B8B381A]": status === "Active",
						"text-red-800 bg-[#7f1d1d4d]": status === "Inactive",
					})}
				>
					{status}
				</div>
			);
		},
	}),
	columnHelper.accessor("address", {
		header: "Wallet Address",
		cell: (row) => <span>{truncateAddress(row.getValue())}</span>,
	}),
];

const DataTable: React.FC = () => {
	// const [data, setData] = React.useState(defaultData);

	const table = useReactTable({
		data: defaultData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
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
								const status = row.getValue("status");
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
														<div className="inline-flex w-full justify-between items-center">
															<p>Copy address</p>
															<Copy strokeWidth={1} size={18} />
														</div>
													</DropdownMenuItem>
													<DropdownMenuItem>
														{status ? "Deactivate" : "Activate"} entity
													</DropdownMenuItem>
													<DropdownMenuItem>
														<p className="text-red-600">Delete account</p>
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
