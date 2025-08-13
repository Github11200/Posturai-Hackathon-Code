import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function softmax(logits: Float32Array): Float32Array {
  let exponentsSum = 0;
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