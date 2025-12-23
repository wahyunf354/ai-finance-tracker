import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionHeaderProps {
  onExport: () => void;
}

export function TransactionHeader({ onExport }: TransactionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
      <Button onClick={onExport} variant="outline" size="sm" className="gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
}
