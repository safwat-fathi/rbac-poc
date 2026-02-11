'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/components/ui/button';

interface Invoice {
  id: string;
  amount: number;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';
  client: { name: string };
  createdAt: string;
}

export default function InvoicesPage() {
  const { can } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const { data } = await api.get('/invoices');
      setInvoices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/invoices/${id}/approve`);
      fetchInvoices(); // Refresh
    } catch (e) {
      alert('Failed to approve');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
        {can('invoices:create') && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-900">Client</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Amount</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">{inv.client?.name || 'Unknown'}</td>
                <td className="px-6 py-4 font-mono">${Number(inv.amount).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    inv.status === 'PAID' ? "bg-green-100 text-green-700" :
                    inv.status === 'PENDING' ? "bg-orange-100 text-orange-700" :
                    "bg-gray-100 text-gray-700"
                  )}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  {can('invoices:approve') && inv.status === 'DRAFT' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleApprove(inv.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  )}
                </td>
              </tr>
            ))}
             {invoices.length === 0 && (
              <tr>
                 <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No invoices found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
