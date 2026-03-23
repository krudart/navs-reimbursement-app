import { ReimbursementType } from './types';

export const COVERAGE_RATES: Record<ReimbursementType, number> = {
  medical_consultation: 80,
  pharmaceutical: 70,
  lab_tests: 90,
  hospitalization: 85,
  dental: 60,
  other: 50,
};

export function calculateCoverage(type: ReimbursementType, amount: number) {
  const percentage = COVERAGE_RATES[type];
  const coveredAmount = Math.round((amount * percentage) / 100 * 100) / 100;
  return {
    percentage,
    coveredAmount,
    outOfPocket: Math.round((amount - coveredAmount) * 100) / 100,
  };
}
