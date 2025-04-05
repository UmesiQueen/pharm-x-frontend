import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ClippableAddress = ({ text }: { text: string }) => {
	const [copyStatus, setCopyStatus] = React.useState(false);

	React.useEffect(() => {
		if (copyStatus) toast.success("Copied to clipboard");
	}, [copyStatus]);

	const onCopyText = () => {
		setCopyStatus(true);
		setTimeout(() => setCopyStatus(false), 4000); // Reset status after 2 seconds
	};
	return (
		<CopyToClipboard text={text} onCopy={onCopyText}>
			<Button
				variant={"link"}
				className="font-normal px-0 text-inherit font-space-grotesk"
			>
				<p className="inline-flex gap-1 items-center">
					<span>{truncateAddress(text)}</span>
					{copyStatus ? (
						<Check strokeWidth={1} width={14} height={14} />
					) : (
						<Copy strokeWidth={1} width={14} height={14} />
					)}
				</p>
			</Button>
		</CopyToClipboard>
	);
};

export default ClippableAddress;
