"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Users, FileText, ShoppingCart, DollarSign } from "lucide-react";

export default function DashboardPage() {
	const { user } = useAuthStore();

	const stats = [
		{
			label: "Total Clients",
			value: "128",
			icon: Users,
			color: "text-blue-500",
			bg: "bg-blue-50",
		},
		{
			label: "Pending Invoices",
			value: "$24,500",
			icon: FileText,
			color: "text-orange-500",
			bg: "bg-orange-50",
		},
		{
			label: "Total Revenue",
			value: "$1.2M",
			icon: DollarSign,
			color: "text-green-500",
			bg: "bg-green-50",
		},
		{
			label: "Open Purchases",
			value: "12",
			icon: ShoppingCart,
			color: "text-purple-500",
			bg: "bg-purple-50",
		},
	];

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
					<p className="text-slate-500">Welcome back, {user?.name}</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map(stat => (
					<div
						key={stat.label}
						className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4"
					>
						<div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
							<stat.icon className="w-6 h-6" />
						</div>
						<div>
							<p className="text-sm font-medium text-slate-500">{stat.label}</p>
							<h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
						</div>
					</div>
				))}
			</div>

			<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
				<h2 className="text-lg font-semibold text-slate-900 mb-4">
					Recent Activity
				</h2>
				<div className="space-y-4">
					{[1, 2, 3].map(i => (
						<div
							key={i}
							className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
						>
							<div className="flex items-center space-x-3">
								<div className="w-2 h-2 rounded-full bg-blue-500" />
								<p className="text-sm text-slate-700">
									New invoice created for{" "}
									<span className="font-medium">Acme Corp</span>
								</p>
							</div>
							<span className="text-xs text-slate-400">2h ago</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
