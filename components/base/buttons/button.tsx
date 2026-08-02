import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonColor = "primary" | "secondary" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { color = "primary", size = "md", className = "", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-color={color}
      data-size={size}
      className={`ui-button ${className}`.trim()}
      {...props}
    />
  );
});
