import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={twMerge(
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";

