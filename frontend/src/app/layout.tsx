import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const inter = Instrument_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "RBAC ERP POC",
	description: "Role-Based Access Control ERP System",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
