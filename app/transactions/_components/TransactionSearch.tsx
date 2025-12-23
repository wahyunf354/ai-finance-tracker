import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

interface TransactionSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TransactionSearch({ value, onChange }: TransactionSearchProps) {
  const { t } = useLanguage();
  return (
    <div className="px-4 pb-4 border-b">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t.history.search_placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 bg-muted/50 border-input"
        />
      </div>
    </div>
  );
}
