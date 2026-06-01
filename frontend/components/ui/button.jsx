import * as React from "react";

import { cn } from "@/lib/utils";

const variantStyles = {
  default:
    "bg-cyan-500 text-slate-950 hover:bg-cyan-400 focus-visible:ring-cyan-300",
  outline:
    "border border-white/20 bg-transparent text-white hover:border-cyan-300 hover:text-cyan-200 focus-visible:ring-cyan-300",
  secondary:
    "bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white/40",
};

const sizeStyles = {
  default: "h-11 px-5 py-2",
  sm: "h-9 px-3 text-sm",
  lg: "h-12 px-7 text-base",
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          "disabled:pointer-events-none disabled:opacity-50",
          "hover:scale-105 active:scale-95",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
