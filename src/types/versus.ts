export type VersusCategory = 'songs' | 'albums' | 'performers';

export interface VersusCompetitor {
  id: string;
  title: string;
  subtitle: string;
  coverSrc: string;
  href: string;
  metrics: Record<string, number | string>;
}

export interface VersusCriterion {
  key: string;
  label: string;
  description: string;
  lowerIsBetter: boolean;
}

export interface CriterionResult {
  key: string;
  label: string;
  description: string;
  a: number | string;
  b: number | string;
  winner: 'a' | 'b' | 'tie';
  displayA: string;
  displayB: string;
  shareA: number;
  shareB: number;
}

export interface VersusOutcome {
  winner: 'a' | 'b' | 'tie';
  scoreA: number;
  scoreB: number;
  results: CriterionResult[];
}
