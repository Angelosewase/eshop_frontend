import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, X, Pencil } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  validate?: (value: string) => string | null;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onSave,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  className,
  validate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (required && !currentValue) {
      setError('This field is required');
      return;
    }
    
    if (validate) {
      const validationError = validate(currentValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    onSave(currentValue);
    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className={cn("mb-4", className)}>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium">{label}</label>
        {!isEditing && !disabled && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit {label}</span>
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="animate-scale-in">
          <Input
            type={type}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder={placeholder}
            className={cn(error && "border-destructive")}
            autoFocus
          />
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          <div className="flex mt-2 space-x-2">
            <Button size="sm" onClick={handleSave} className="h-8">
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-8">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="py-2 px-3 rounded-md bg-secondary/50 min-h-[2.5rem] flex items-center">
          <span className={cn("text-sm", !currentValue && "text-muted-foreground")}>
            {currentValue || placeholder || "Not set"}
          </span>
        </div>
      )}
    </div>
  );
};

export default EditableField;