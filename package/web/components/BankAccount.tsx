export default function BankAccount({
  title,
  balance,
  currency,
  totalTransaction,
}: {
  title: string;
  balance: number;
  currency: string;
  totalTransaction: number;
}) {
  return (
    <div className="border rounded-xl py-3 px-5 shrink-0 snap-start min-w-32 flex flex-col gap-1">
      <p className="font-semibold text-sm">{title}</p>
      <p className="font-bold text-lg">
        {currency}
        {String(balance)}
      </p>
      <span className="text-xs">{totalTransaction} transactions</span>
    </div>
  );
}
