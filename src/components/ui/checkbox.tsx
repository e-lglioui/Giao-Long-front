import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        {...props}
      />
      {label && <span className="text-gray-700">{label}</span>}
    </label>
  );
};

export default Checkbox;
