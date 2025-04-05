import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmationModalProps = {
	title: string;
	onCloseFn: () => void;
	onSubmit: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	title,
	onCloseFn,
	onSubmit,
}) => {
	return (
		<form className="font-space-grotesk" onSubmit={(e) => e.preventDefault()}>
			<h1 className="font-semibold text-lg px-6">{title}</h1>
			<hr className="my-4" />
			<div className="px-6 space-y-5">
				<p>Are you sure you want to proceed? This action cannot be undone</p>
				<div className="flex justify-end gap-2">
					<Button variant="outline" type="button" onClick={onCloseFn}>
						Cancel
					</Button>
					<Button
						type="submit"
						className={cn("bg-[#4E46B4] hover:bg-[#4d46b497]", {
							"bg-red-600 hover:bg-[#dc2626c3] ": ["Delete", "Deactivate"].some(
								(word) => title.includes(word)
							),
						})}
						onClick={onSubmit}
					>
						{title.includes("Delete") ? "Delete" : "Confirm"}
					</Button>
				</div>
			</div>
		</form>
	);
};

export default ConfirmationModal;
