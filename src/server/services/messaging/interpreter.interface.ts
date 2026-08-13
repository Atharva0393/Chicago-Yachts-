export type DecisionType = "AVAILABLE" | "UNAVAILABLE" | "NEEDS_CLARIFICATION" | "UNKNOWN";

export interface InterpretationResult {
  decision: DecisionType;
  reason?: string;
  confidence?: number;
}

export interface OwnerMessageInterpreter {
  interpret(messageBody: string, context?: any): Promise<InterpretationResult>;
}
