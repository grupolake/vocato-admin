import Link from "next/link";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap no-underline transition-colors disabled:cursor-not-allowed disabled:bg-[var(--ink-200)] disabled:text-[var(--ink-500)]";
const VARIANTS = {
  brand: "bg-brand text-white hover:bg-brand-hover",
  cta: "bg-cta text-white hover:bg-[var(--cta-hover)]",
  outline: "border border-line bg-card text-strong hover:bg-sunken",
  danger:
    "border border-line bg-card text-negative hover:bg-[var(--negative-50)]",
} as const;
const SIZES = { sm: "h-9 px-4 text-[12.5px]", md: "h-10 px-5 text-[13.5px]" };

export function buttonClass(
  variant: keyof typeof VARIANTS = "brand",
  size: keyof typeof SIZES = "md",
) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]}`;
}

type Common = {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
};

export function Button({
  variant,
  size,
  className = "",
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`${buttonClass(variant, size)} ${className}`}
      {...rest}
    />
  );
}

export function LinkButton({
  variant,
  size,
  className = "",
  ...rest
}: Common & React.ComponentProps<typeof Link>) {
  return (
    <Link className={`${buttonClass(variant, size)} ${className}`} {...rest} />
  );
}
