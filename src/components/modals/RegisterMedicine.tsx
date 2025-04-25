import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuid } from "uuid";
import { useWriteDrugRegistry } from "@/hooks/useWriteDrugRegistry";
import type { MedicineRegister as MedicineRegisterType } from "@/app/dashboard/medicine/types";

const FormSchema = z.object({
	serialNo: z
		.string({ required_error: "This field is required" })
		.trim()
		.toLowerCase(),
	name: z
		.string({ required_error: "Field cannot be blank" })
		.min(2, { message: "Name must contain at least 2 character(s)" })
		.max(30, { message: "Name cannot contain more than 30 character(s)" })
		.trim()
		.toLowerCase(),
	brand: z
		.string({ required_error: "Field cannot be blank" })
		.min(2, { message: "Brand must contain at least 2 character(s)" })
		.max(30, {
			message: "Brand cannot contain more than 30 character(s)",
		})
		.trim()
		.toLowerCase(),
	ingredients: z
		.string({ required_error: "Field cannot be blank" })
		.min(2, { message: "Name must contain at least 2 character(s)" })
		.max(30, { message: "Name cannot contain more than 30 character(s)" })
		.trim()
		.toLowerCase(),
	details: z.string().trim().toLowerCase().optional(),
});

type RegisterMedicineProps = {
	onCloseFn: () => void;
};

const RegisterMedicine: React.FC<RegisterMedicineProps> = ({ onCloseFn }) => {
	const { registerMedicine } = useWriteDrugRegistry();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		mode: "onChange",
		defaultValues: {
			serialNo: undefined,
			name: undefined,
			brand: undefined,
			ingredients: undefined,
			details: undefined,
		},
	});

	const onSubmit = form.handleSubmit(async (formData) => {
		const medicineId = `M-${formData.name.slice(0, 2)}${uuid().slice(0, 3)}`;
		const medicineDetails: MedicineRegisterType = {
			medicineId,
			...formData,
		};

		try {
			const result = await registerMedicine(medicineDetails);
			if (result) onCloseFn();
		} catch (err) {
			console.error("Failed to register medicine:", err);
		}
	});

	return (
		<div className="font-space-grotesk">
			<h1 className="font-semibold text-lg px-6">Register medicine</h1>
			<hr className="my-4" />
			<div className="px-6">
				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-5">
						<FormField
							control={form.control}
							name="serialNo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Serial No.</FormLabel>
									<FormControl>
										<Input
											maxLength={35}
											type="text"
											{...field}
											placeholder="4094-2023-002"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
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

						<FormField
							control={form.control}
							name="brand"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Brand</FormLabel>
									<FormControl>
										<Input
											maxLength={35}
											type="text"
											{...field}
											placeholder="Exzol"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="ingredients"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ingredients</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Sodium..."
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="details"
							render={({ field }) => (
								<FormItem>
									<FormLabel>More details</FormLabel>
									<FormControl>
										<Textarea
											placeholder="More information on this medicine"
											className="resize-none"
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2">
							<Button variant="outline" type="button" onClick={onCloseFn}>
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

// Name, brand, role, license

export default RegisterMedicine;
