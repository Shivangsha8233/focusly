// Safety and Medical Guardrails for Spark AI

export interface SafetyCheckResult {
  isBlocked: boolean;
  type: "medication" | "crisis" | null;
  message: string | null;
}

const MEDICATION_KEYWORDS = [
  "adderall",
  "ritalin",
  "vyvanse",
  "concerta",
  "strattera",
  "wellbutrin",
  "modafinil",
  "dexedrine",
  "atomoxetine",
  "guanfacine",
  "clonidine",
  "medication",
  "meds",
  "medicine",
  "dosage",
  "mg dose",
  "pill",
  "pills",
  "prescription",
  "prescribed",
  "side effect",
  "side effects",
  "antidepressant",
  "stimulant",
];

const CRISIS_KEYWORDS = [
  "kill myself",
  "suicide",
  "suicidal",
  "end my life",
  "want to die",
  "self harm",
  "cutting myself",
  "don't want to live",
  "better off dead",
];

export function checkSafety(input: string): SafetyCheckResult {
  const lower = input.toLowerCase();

  // 1. Crisis / Self-Harm Check (Highest Priority)
  for (const keyword of CRISIS_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        isBlocked: true,
        type: "crisis",
        message:
          "I hear how much pain you are in, and I want you to be safe. Please know that you do not have to carry this alone. Please reach out to someone who can help right now:\n\n" +
          "• India: Tele-MANAS at 14416 (24/7 toll-free) or AASRA at +91 9820466726\n" +
          "• US / Canada: Call or text 988 (Suicide & Crisis Lifeline)\n" +
          "• UK: Call 111 or text SHOUT to 85258\n\n" +
          "Please reach out to a trusted loved one, counselor, or professional right away. You matter.",
      };
    }
  }

  // 2. Medication / Medical Advice Check
  // If user asks about medication, dosage, or if a medicine is good/effective
  for (const keyword of MEDICATION_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        isBlocked: true,
        type: "medication",
        message:
          "I'm here as your gentle daily motivation and focus helper, not a healthcare professional. Everyone's body and brain chemistry is unique, so I cannot evaluate, recommend, or discuss medications or dosages. Please speak directly with your doctor or psychiatrist—they are the best person to give you personalized, safe guidance.",
      };
    }
  }

  return {
    isBlocked: false,
    type: null,
    message: null,
  };
}
