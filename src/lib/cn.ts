import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know the theme's custom font sizes (text-body, text-label, …); otherwise it
 * reads them as text colours and drops the real colour class (e.g. a button's text-brown).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-xl", "display-lg", "display-md", "heading-lg", "heading-md", "body-lg", "body", "body-sm", "label", "label-lg"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
