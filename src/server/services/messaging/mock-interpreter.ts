import { OwnerMessageInterpreter, InterpretationResult } from "./interpreter.interface";

export class MockOwnerMessageInterpreter implements OwnerMessageInterpreter {
  async interpret(messageBody: string, context?: any): Promise<InterpretationResult> {
    const text = messageBody.trim().toLowerCase();

    // 1. Positive / Available patterns
    const availablePatterns = [
      "yes",
      "available",
      "yeah",
      "yea",
      "yep",
      "sure",
      "confirmed",
      "it's available",
      "its available",
      "it's free",
      "its free",
      "free",
      "good to go",
      "all good",
      "approved"
    ];

    // 2. Negative / Unavailable patterns
    const unavailablePatterns = [
      "no",
      "not available",
      "unavailable",
      "already booked",
      "booked",
      "taken",
      "can't",
      "cant",
      "cannot",
      "full",
      "busy",
      "out of service"
    ];

    // 3. Clarification required patterns
    const clarificationPatterns = [
      "let me check",
      "not sure",
      "maybe",
      "hold on",
      "give me a minute",
      "check later",
      "need to see"
    ];

    // Evaluate exact/includes matches
    if (availablePatterns.some(pattern => text === pattern || text.includes(pattern))) {
      return {
        decision: "AVAILABLE",
        reason: "Owner confirmed availability via message",
        confidence: 0.95
      };
    }

    if (unavailablePatterns.some(pattern => text === pattern || text.includes(pattern))) {
      return {
        decision: "UNAVAILABLE",
        reason: messageBody.length > 3 ? messageBody : "Owner declared yacht unavailable",
        confidence: 0.95
      };
    }

    if (clarificationPatterns.some(pattern => text === pattern || text.includes(pattern))) {
      return {
        decision: "NEEDS_CLARIFICATION",
        reason: "Owner requested time to verify schedule",
        confidence: 0.8
      };
    }

    return {
      decision: "UNKNOWN",
      reason: "Unrecognized owner response format",
      confidence: 0.3
    };
  }
}

export const mockOwnerMessageInterpreter = new MockOwnerMessageInterpreter();
