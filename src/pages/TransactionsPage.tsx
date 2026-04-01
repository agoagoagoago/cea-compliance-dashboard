import { TransactionRegister } from '@/components/transactions/TransactionRegister';

export function TransactionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transaction Records</h2>
        <p className="text-sm text-gray-500">Transaction Records Regulations 2021 &amp; Estate Agency Work Regulations</p>
      </div>
      <TransactionRegister />
    </div>
  );
}
