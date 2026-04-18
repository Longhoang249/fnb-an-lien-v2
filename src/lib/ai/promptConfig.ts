// Stub: Prompt configuration from V1 — to be implemented in V2 Phase 2+

export interface PromptConfig {
  aiSystemPrompt?: string
  customToneGuide?: string
  writingDos?: string[]
  writingDonts?: string[]
  hookTemplates?: string[]
  [key: string]: unknown
}
