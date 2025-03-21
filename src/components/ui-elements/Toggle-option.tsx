import { Switch } from "../ui/switch";
import { cn } from "../../lib/utils";

interface ToggleOptionProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn("flex items-start justify-between py-3", className)}>
      <div className="space-y-1">
        <div className="text-sm font-medium leading-none">{label}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center h-6">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default ToggleOption;
