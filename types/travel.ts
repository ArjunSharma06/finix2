export interface TravelSuggestion {
  name: string
  category: 'accommodation' | 'flight' | 'restaurant' | 'activity'
  price: number
  priceLabel: string
  rating: number
  description: string
  features: string[]
  imageUrl: string
  timing?: string
  airline?: string
  cuisine?: string
  location?: string
}