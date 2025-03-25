import * as React from "react";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="range"
        className={`w-full cursor-pointer ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Slider.displayName = "Slider";

export default Slider;
