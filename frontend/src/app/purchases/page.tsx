'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/components/ui/button';

interface Purchase {
  id: string;
  description: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function PurchasesPage() {
  const { can } = useAuthStore();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const { data } = await api.get('/purchases');
      setPurchases(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/purchases/${id}/approve`);
      fetchPurchases();
    } catch (e) {
      alert('Failed to approve');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Purchases</h1>
        {can('purchases:create') && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Purchase Request
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-900">Description</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Amount</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-900">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {purchases.map((pur) => (
              <tr key={pur.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">{pur.description}</td>
                <td className="px-6 py-4 font-mono">${Number(pur.amount).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    pur.status === 'APPROVED' ? "bg-green-100 text-green-700" :
                    pur.status === 'REJECTED' ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  )}>
                    {pur.status}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(pur.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  {can('purchases:approve') && pur.status === 'PENDING' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleApprove(pur.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  )}
                </td>
              </tr>
            ))}
             {purchases.length === 0 && (
              <tr>
                 <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No purchases found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
