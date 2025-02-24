import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onChange, onValueChange, value, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    return (
      <select
        ref={ref}
        value={value}
        onChange={handleChange}
        className={cn("border rounded-md p-2 w-full", className)}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export const SelectTrigger = ({ children, ...props }) => (
  <div className="relative border rounded-md p-2 cursor-pointer bg-white" {...props}>
    {children}
  </div>
);

export const SelectContent = ({ children, ...props }) => (
  <div className="absolute bg-white border rounded-md shadow-md mt-1 w-full z-10" {...props}>
    {children}
  </div>
);

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({ children, value, ...props }) => (
  <option value={value} {...props}>
    {children}
  </option>
);

export const SelectValue = ({ placeholder, value }: { placeholder?: string; value?: string }) => (
  <span className="text-gray-700">{value || placeholder}</span>
);
