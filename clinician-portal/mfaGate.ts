/*
 * mfaGate.ts
 *
 * Implements: SWR-CP-4 (Require MFA before displaying patient telemetry)
 *
 * Illustrative MFA session gate. Demo content only.
 */

export class MfaRequiredError extends Error {
  constructor() {
    super("Multi-factor authentication required before telemetry display");
  }
}

/**
 * Resolves once a valid MFA session exists for the current clinician,
 * or throws MfaRequiredError. Every telemetry-displaying view (patient
 * list, trends dashboard) must await this before rendering patient
 * data, per SWR-CP-4.
 */
export async function requireMfaSession(): Promise<void> {
  const hasValidMfaSession = await checkMfaSessionStatus();
  if (!hasValidMfaSession) {
    throw new MfaRequiredError();
  }
}

async function checkMfaSessionStatus(): Promise<boolean> {
  // Demo stub: real implementation checks session state against the
  // portal's MFA provider.
  return true;
}
