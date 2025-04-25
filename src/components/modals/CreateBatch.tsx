import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, getUnixTime } from "date-fns";
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
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useWriteDrugRegistry } from "@/hooks/useWriteDrugRegistry";
import type { CreateBatch as CreateBatchType } from "@/app/dashboard/batch/types";
import { useReadMedicineDetails } from "@/hooks/useReadMedicineDetails";

const CreateBatch: React.FC = () => {
	const { closeModal } = useModal();
	const { createBatch } = useWriteDrugRegistry();
	const { medicineIds } = useReadMedicineDetails();

	const FormSchema = z
		.object({
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
			expiryDate: z.date({
				required_error: "An expiry date is required",
			}),
		})
		.refine(({ expiryDate, productionDate }) => expiryDate > productionDate, {
			message: "Expiry date must be after production date",
			path: ["expiryDate"],
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
		const batchId = `B-${formData.medicineId.slice(2, 6)}${uuid().slice(0, 2)}`;
		const batchDetails: CreateBatchType = {
			batchId,
			...formData,
			productionDate: getUnixTime(formData.productionDate),
			expiryDate: getUnixTime(formData.expiryDate),
		};

		try {
			const result = await createBatch(batchDetails);
			if (result) closeModal();
		} catch (err) {
			console.error("An error occurred:", err);
		}
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
													disabled={(date) => {
														const productionDate = form.watch("productionDate");
														return productionDate
															? date < new Date(productionDate)
															: date < new Date();
													}}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
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
