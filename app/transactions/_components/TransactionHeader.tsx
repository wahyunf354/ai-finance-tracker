import { Download, FileText, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionHeaderProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
  isPremium?: boolean;
}

export function TransactionHeader({
  onExportExcel,
  onExportPDF,
  isPremium,
}: TransactionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
      <div className="flex gap-2">
        <Button
          onClick={onExportExcel}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Excel</span>
          <span className="sm:hidden">XLS</span>
        </Button>
        <Button
          onClick={onExportPDF}
          variant="outline"
          size="sm"
          className="gap-2 border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/5 group"
        >
          {isPremium ? (
            <FileText className="h-4 w-4 text-purple-500" />
          ) : (
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
          <span className="hidden sm:inline">PDF Report</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>
    </div>
  );
}
