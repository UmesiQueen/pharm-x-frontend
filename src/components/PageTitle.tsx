import React from "react";
import { useLocation } from "react-router";

type PageTitleProp = {
	title: string;
};

const PageTitle: React.FC<PageTitleProp> = ({ title }) => {
	const location = useLocation();

	React.useEffect(() => {
		document.title = title;
	}, [location, title]);

	return null;
};

export default PageTitle;
