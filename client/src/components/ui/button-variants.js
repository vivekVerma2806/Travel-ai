import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8]/50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        /* Primary Teal Button (Authoritative Pathora) */
        default:
          "bg-[#00B4D8] hover:bg-[#0096B4] text-white shadow-md shadow-[#00B4D8]/25 hover:shadow-lg hover:shadow-[#00B4D8]/35 transition-all duration-200",

        /* Accent Sunset Orange Button (Hero CTA) */
        accent:
          "bg-[#FF6B35] hover:bg-[#E85A24] text-white shadow-md shadow-[#FF6B35]/30 hover:shadow-lg hover:shadow-[#FF6B35]/40 transition-all duration-200",

        /* Danger / Destructive */
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-200",

        /* Outline Button */
        outline:
          "border border-slate-200 hover:border-[#00B4D8] bg-white text-slate-700 hover:text-[#00B4D8] hover:bg-[#F0F9FF] shadow-sm transition-all duration-200",

        /* Glass Outline (For Hero / Dark surfaces) */
        glass:
          "border border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-200",

        /* Secondary soft background */
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors",

        /* Minimal ghost */
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900",

        /* Link style */
        link:
          "text-[#00B4D8] underline-offset-4 hover:underline p-0 h-auto font-medium",
      },

      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3 text-xs rounded-lg",
        lg: "h-12 px-7 text-base rounded-xl",
        icon: "size-10 rounded-xl",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)