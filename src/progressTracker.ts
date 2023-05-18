import { emitDebouncedProgressUpdate } from './socket';

interface ProgressInfo {
  currentStep: number;
  totalSteps: number;
  baseMessage: string;
}

export function trackProgress({ currentStep, totalSteps, baseMessage }: ProgressInfo): void {
  const progressPercentage = Math.floor((currentStep / totalSteps) * 100);
  const progressMessage = `${baseMessage} - ${progressPercentage}%`;

  emitDebouncedProgressUpdate(progressMessage);
}
