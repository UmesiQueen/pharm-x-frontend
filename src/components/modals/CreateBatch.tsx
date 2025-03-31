import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
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

const FormSchema = z.object({
	medicineId: z
		.string({ required_error: "Field cannot be empty" })
		.min(2, { message: "Invalid Medicine Id" }), // use regex pattern
	quantity: z.number({ required_error: "Field cannot be empty" }),
	prodDate: z.date({
		required_error: "A date of birth is required.",
	}),
	expiryDate: z.date({
		required_error: "A date of birth is required.",
	}),
});

const CreateBatch: React.FC = () => {
	const { closeModal } = useModal();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		mode: "onChange",
		defaultValues: {
			medicineId: "",
			quantity: undefined,
			prodDate: undefined,
			expiryDate: undefined,
		},
	});

	const onSubmit = form.handleSubmit((formData) => {
		console.log(formData, "formData");
		const promise = () =>
			new Promise((resolve) => setTimeout(() => resolve({}), 2000));

		toast.promise(promise, {
			loading: "Creating...",
			success: () => {
				closeModal();
				return "New medicine has been created";
			},
			error: "Error",
		});
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
												placeholder="Paracetamol"
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
								name="prodDate"
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
														date > new Date() || date < new Date("1900-01-01")
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
													disabled={(date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
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
