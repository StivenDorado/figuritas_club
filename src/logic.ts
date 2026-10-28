import type { CardInventory, PokemonCard, StickerState, User } from './types'

export const getCollectionStats = (user: User, cards: PokemonCard[]) => {
  const values = cards.map((card) => user.inventory[card.id] ?? { state: 'missing' as const, repeats: 0 })
  const owned = values.filter((item) => item.state !== 'missing').length
  const repeats = values.reduce((total, item) => total + item.repeats, 0)
  return { owned, repeats, missing: Math.max(cards.length - owned, 0), percent: cards.length ? Math.round((owned / cards.length) * 100) : 0 }
}

export const calculateExchange = (from: User | undefined, to: User | undefined, cards: PokemonCard[]) => {
  if (!from || !to || from.id === to.id) return { give: [] as string[], receive: [] as string[] }
  const fromRepeats = new Set(cards.filter(({ id }) => (from.inventory[id]?.repeats ?? 0) > 0).map(({ id }) => id))
  const toRepeats = new Set(cards.filter(({ id }) => (to.inventory[id]?.repeats ?? 0) > 0).map(({ id }) => id))
  return { give: [...fromRepeats].filter((id) => (to.inventory[id]?.state ?? 'missing') === 'missing'), receive: [...toRepeats].filter((id) => (from.inventory[id]?.state ?? 'missing') === 'missing') }
}

export const cycleInventory = (current: CardInventory | undefined): CardInventory => {
  const state: StickerState = current?.state ?? 'missing'
  if (state === 'missing') return { state: 'owned', repeats: 0 }
  if (state === 'owned') return { state: 'repeat', repeats: 1 }
  return { state: 'missing', repeats: 0 }
}

export const addOneCopy = (current: CardInventory | undefined): CardInventory => {
  if (!current || current.state === 'missing') return { state: 'owned', repeats: 0 }
  return { state: 'repeat', repeats: current.repeats + 1 }
}

export const removeOneCopy = (current: CardInventory | undefined): CardInventory => {
  if (!current || current.state === 'missing') return { state: 'missing', repeats: 0 }
  if (current.repeats > 1) return { state: 'repeat', repeats: current.repeats - 1 }
  return { state: 'owned', repeats: 0 }
}

export const drawChest = (user: User, cards: PokemonCard[]) => {
  const count = Math.min(cards.length, 3 + Math.floor(Math.random() * 2))
  const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, count)
  return shuffled.map((card) => {
    const current = user.inventory[card.id]
    return { card, wasOwned: current?.state !== undefined && current.state !== 'missing', nextInventory: addOneCopy(current) }
  })
}

export const formatCountdown = (timestamp: number | undefined, now: number) => {
  if (!timestamp) return ''
  const seconds = Math.max(0, Math.ceil((timestamp - now) / 1000))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
