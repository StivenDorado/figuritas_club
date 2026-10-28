export type StickerState = 'missing' | 'owned' | 'repeat'
export type CardInventory = { state: StickerState; repeats: number }

export type PokemonCard = {
  id: string
  name: string
  number: string
  rarity: string
  setName: string
  supertype: string
  types: string[]
  imageSmall: string
  imageLarge: string
}

export type ChestReward = {
  cardId: string
  rarity: string
  wasOwned: boolean
  openedAt: number
}

export type User = {
  id: string
  name: string
  emoji: string
  inventory: Record<string, CardInventory>
  chests: number
  nextChestAt?: number
  lastReward?: ChestReward
}

export type AppState = {
  albumSize: 20
  users: User[]
  activeUserId: string
  compareUserId: string
}
