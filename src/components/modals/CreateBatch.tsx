import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, getUnixTime, addYears } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/components/ui/modal";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { useWriteDrugRegistry } from "@/hooks/useWriteDrugRegistry";
import type { CreateBatch as CreateBatchType } from "@/app/dashboard/batch/types";
import { useReadMedicineDetails } from "@/hooks/useReadMedicineDetails";

const CreateBatch: React.FC = () => {
	const { closeModal } = useModal();
	const { createBatch, isPending } = useWriteDrugRegistry();
	const { medicineIds } = useReadMedicineDetails();

	const FormSchema = z.object({
		medicineId: z
			.string({ required_error: "This field is required" })
			.toLowerCase()
			.refine(
				(val) => medicineIds.map((id) => id.toLowerCase()).includes(val),
				{
					message: "Medicine Id does not exist",
				}
			),
		quantity: z.coerce
			.number({
				required_error: "This field is required",
				invalid_type_error: "Please enter a number",
			})
			.positive({ message: "Please enter a quantity greater than 0" }),
		productionDate: z.date({
			required_error: "A production date is required",
		}),
		expiryDate: z.enum(["1", "2", "3", "4", "5"], {
			message: "Select an expiry duration",
		}),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		mode: "onChange",
		defaultValues: {
			medicineId: undefined,
			quantity: undefined,
			productionDate: undefined,
			expiryDate: undefined,
		},
	});

	const onSubmit = form.handleSubmit(async (formData) => {
		const batchId = `B-${formData.medicineId.slice(2, 5)}${uuid().slice(0, 3)}`;
		const batchDetails: CreateBatchType = {
			batchId: batchId.toLowerCase(),
			...formData,
			productionDate: getUnixTime(formData.productionDate),
			expiryDate: getUnixTime(
				addYears(new Date(formData.productionDate), Number(formData.expiryDate))
			),
		};

		createBatch(batchDetails, closeModal);
	});

	return (
		<div className="font-space-grotesk">
			<h1 className="font-semibold text-lg px-6">Create new batch</h1>
			<hr className="my-4" />
			<div className="px-6">
				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-5">
						<div className="grid grid-cols-2 gap-5">
							{/* Medicine ID */}
							<FormField
								control={form.control}
								name="medicineId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Medicine Id</FormLabel>
										<FormControl>
											<Input
												maxLength={35}
												type="text"
												{...field}
												placeholder="M-PA123"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Quantity */}
							<FormField
								control={form.control}
								name="quantity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Quantity</FormLabel>
										<FormControl>
											<Input type="text" {...field} placeholder="0" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Production Date */}
							<FormField
								control={form.control}
								name="productionDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Production Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"h-10 pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() || date < new Date("2025-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Expiry Date */}
							<FormField
								control={form.control}
								name="expiryDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Expiry Date</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select duration" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="font-space-grotesk">
												<SelectGroup>
													<SelectItem value="1">1 year</SelectItem>
													<SelectItem value="2">2 years</SelectItem>
													<SelectItem value="3">3 years</SelectItem>
													<SelectItem value="4">4 years</SelectItem>
													<SelectItem value="5">5 years</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end gap-2">
							<Button variant="outline" type="button" onClick={closeModal}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-[#4E46B4] hover:bg-[#4d46b497] "
								loading={isPending}
							>
								Create
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default CreateBatch;
