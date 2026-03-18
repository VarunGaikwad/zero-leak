export default function StatGrid({
  title,
  amount,
  totalTransaction,
  className,
  color = "text-black",
}: {
  className?: string;
  color?: string;
  title: string;
  totalTransaction: number;
  amount: number;
}) {
  return (
    <div
      className={`border rounded-xl py-3 px-4 flex flex-col items-center gap-1 ${className}`}
    >
      <div className="text-xs">{title}</div>
      <div className={`font-bold text-lg ${color}`}>${amount}</div>
      <div className="text-xs">{totalTransaction} transaction</div>
    </div>
  );
}
