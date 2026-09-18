export type AgeGroup = '10s' | '20s' | '30s' | '40s' | '50s'

export type Preference =
  | 'quiet'
  | 'nature'
  | 'view'
  | 'walk'
  | 'cafe'
  | 'food'
  | 'photo'
  | 'sunset'
  | 'nightview'
  | 'date'
  | 'solo'

export type User = {
  id: string
  ageGroup: AgeGroup
  preferences: Preference[]
}
