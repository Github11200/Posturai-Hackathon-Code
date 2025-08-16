import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// NOTE: Replace these with your real contact details.
export const SUPPORT_EMAIL = "jinayunity22@gmail.com"; // TODO: Change the email possibly
export const LINKEDIN_URL = "https://www.linkedin.com/in/jinay-patel-6369002b4/"; // TODO: set real LinkedIn
export const DISCORD_URL = "https://discord.gg/GY7cNrpd";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function softmax(logits: Float32Array): Float32Array {
  let exponentsSum = 0;
  // @ts-ignore
  for (let logit of logits)
    exponentsSum += Math.exp(logit);

  const probabilities = logits.map(logit => {
    return Math.exp(logit) / exponentsSum;
  });
  return probabilities;
}

export function argMax(probabilities: Float32Array): number {
  let max = -Infinity;
  let maxIndex = 0
  for (let i = 0; i < probabilities.length; ++i) {
    if (probabilities[i] > max) {
      max = probabilities[i];
      maxIndex = i;
    }
  }
  return maxIndex;
}