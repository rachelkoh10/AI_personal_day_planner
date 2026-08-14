import { AgentStep, TripPlan, UserPreferences } from '../types';

export interface PlanGenerationResult {
  plan: TripPlan;
  steps: AgentStep[];
}

export async function generateAIAgentPlan(
  preferences: UserPreferences,
  promptOverride?: string
): Promise<PlanGenerationResult> {
  const response = await fetch('/api/planner/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferences, promptOverride }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate plan from AI agent server.');
  }

  return await response.json();
}

export async function replanAIAgentPlan(
  existingPlan: TripPlan,
  triggerReason: 'weather_rain' | 'transport_delay' | 'user_request',
  customInstruction?: string
): Promise<PlanGenerationResult> {
  const response = await fetch('/api/planner/replan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      existingPlan,
      triggerReason,
      customInstruction,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to replan itinerary.');
  }

  return await response.json();
}
