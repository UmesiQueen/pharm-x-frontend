import React from "react";
import { useLocation } from "react-router";

type PageTitleProp = {
	title: string;
	header?: boolean;
};

const PageTitle: React.FC<PageTitleProp> = ({ title, header = false }) => {
	const location = useLocation();

	React.useEffect(() => {
		document.title = title;
	}, [location, title]);

	return (
		<>
			{header ? (
				<h1 className="font-acme text-3xl font-medium w-fit capitalize">
					{title}
				</h1>
			) : null}
		</>
	);
};

export default PageTitle;
