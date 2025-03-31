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
import { useModal } from "@/components/ui/modal";
import { toast } from "sonner";

const formSchema = z.object({
	name: z
		.string({ required_error: "Field cannot be empty" })
		.min(2, { message: "Name must contain at least 2 character(s)" })
		.max(30, { message: "Name cannot contain more than 30 character(s)" }),
	brand: z
		.string({ required_error: "Field cannot be empty" })
		.min(2, { message: "Brand must contain at least 2 character(s)" })
		.max(30, {
			message: "Brand cannot contain more than 30 character(s)",
		}),
});

const RegisterMedicine: React.FC = () => {
	const { closeModal } = useModal();
	const form = useForm({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			brand: "",
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
			<h1 className="font-semibold text-lg px-6">Register medicine</h1>
			<hr className="my-4" />
			<div className="px-6">
				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-5">
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

// Name, brand, role, license

export default RegisterMedicine;
