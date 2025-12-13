import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900",
        outline:
          "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-slate-900",
        ghost: "text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-900",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

