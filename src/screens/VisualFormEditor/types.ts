export interface VisualDNA {
  colors: ColorPalette
  fonts: FontConfig
  layoutStyle: LayoutStyle
  emojiSet: EmojiSet
  photoConfig: PhotoConfig
  contentTone: ContentTone
  emojiFrequency: 'none' | 'low' | 'medium' | 'high'
}

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface FontConfig {
  heading: string
  body: string
}

export type LayoutStyle = 'minimal' | 'bento' | 'magazine' | 'bold'
export type EmojiSet = 'modern' | 'classic' | 'foodie' | 'vietnamese'
export type PhotoConfig = 'bright' | 'moody' | 'natural' | 'studio'
export type ContentTone = 'friendly' | 'professional' | 'casual' | 'premium'

export const DEFAULT_VISUAL_DNA: VisualDNA = {
  colors: { primary: '#3e2723', secondary: '#8d6e63', accent: '#ffb300', background: '#fff8e1', text: '#3e2723' },
  fonts: { heading: 'Be Vietnam Pro', body: 'Inter' },
  layoutStyle: 'minimal',
  emojiSet: 'modern',
  photoConfig: 'bright',
  contentTone: 'friendly',
  emojiFrequency: 'medium',
}
