'use client';
import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShoppingCart, 
  LogOut, 
  User as UserIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/button'; // Reuse cn

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, can } = useAuthStore();

  const links = [
    { href: '/', label: 'Overview', icon: LayoutDashboard, show: true },
    { href: '/clients', label: 'Clients', icon: Users, show: can('clients:read') },
    { href: '/invoices', label: 'Invoices', icon: FileText, show: can('invoices:read') },
    { href: '/purchases', label: 'Purchases', icon: ShoppingCart, show: can('purchases:read') },
  ];

  return (
    <div className="flex flex-col w-64 h-full bg-slate-900 text-slate-100 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          ERP System
        </h1>
        {user && <p className="text-xs text-slate-400 mt-2">Logged in as: <span className="text-slate-200">{user.name}</span></p>}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.filter(l => l.show).map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:bg-red-950/20 hover:text-red-300"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
