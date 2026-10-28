import type { AppState, CardInventory, PokemonCard, StickerState, User } from './types'

export const ALBUM_SIZE = 20
export const MAX_CHESTS = 3
export const CHEST_INTERVAL_MS = 120_000

const emptyInventory = () => ({ state: 'missing' as const, repeats: 0 })
const inventoryForSlots = (owned: number[], repeats: number[]) => {
  const inventory: Record<string, CardInventory> = {}
  for (let id = 1; id <= ALBUM_SIZE; id += 1) inventory[`slot:${id}`] = emptyInventory()
  owned.forEach((id) => { if (id <= ALBUM_SIZE) inventory[`slot:${id}`] = { state: 'owned', repeats: 0 } })
  repeats.forEach((id) => { if (id <= ALBUM_SIZE) inventory[`slot:${id}`] = { state: 'repeat', repeats: 1 } })
  return inventory
}

const user = (id: string, name: string, emoji: string, owned: number[], repeats: number[]): User => ({ id, name, emoji, inventory: inventoryForSlots(owned, repeats), chests: MAX_CHESTS })

export const seedState = (): AppState => ({ albumSize: ALBUM_SIZE, users: [
  user('vale', 'Vale', '🌼', [1, 2, 3, 4, 7, 8, 9, 12, 14, 18], [2, 7, 14]),
  user('santi', 'Santi', '🛹', [1, 3, 5, 6, 9, 10, 11, 13, 16, 17, 20], [3, 9, 16]),
  user('maca', 'Maca', '🍓', [2, 4, 5, 8, 11, 13, 15, 17, 19], [5, 11]),
], activeUserId: 'vale', compareUserId: 'santi' })

const normalizeInventory = (raw: Partial<User> & { stickers?: Record<number, StickerState> }): Record<string, CardInventory> => {
  const inventory: Record<string, CardInventory> = {}
  if (raw.inventory) Object.entries(raw.inventory).forEach(([id, value]) => { if (value && typeof value === 'object') inventory[id] = { state: value.state ?? 'missing', repeats: Math.max(0, value.repeats ?? 0) } })
  if (!Object.keys(inventory).length && raw.stickers) Object.entries(raw.stickers).forEach(([slot, state]) => { inventory[`slot:${slot}`] = { state, repeats: state === 'repeat' ? 1 : 0 } })
  return inventory
}

export const normalizeState = (candidate: Partial<AppState>): AppState => {
  const fallback = seedState()
  const rawUsers = Array.isArray(candidate.users) && candidate.users.length ? candidate.users : fallback.users
  const users = rawUsers.map((raw, index) => ({
    id: raw.id ?? `member-${index}`,
    name: raw.name ?? `Persona ${index + 1}`,
    emoji: raw.emoji ?? ['🌼', '🛹', '🍓', '🪩'][index % 4],
    inventory: normalizeInventory(raw as Partial<User> & { stickers?: Record<number, StickerState> }),
    chests: raw.chests === 0 && !raw.nextChestAt ? MAX_CHESTS : typeof raw.chests === 'number' ? Math.max(0, Math.min(MAX_CHESTS, raw.chests)) : MAX_CHESTS,
    nextChestAt: raw.nextChestAt,
    lastReward: raw.lastReward,
  }))
  const activeUserId = users.some((item) => item.id === candidate.activeUserId) ? candidate.activeUserId! : users[0].id
  const compareUserId = users.some((item) => item.id === candidate.compareUserId && item.id !== activeUserId) ? candidate.compareUserId! : users.find((item) => item.id !== activeUserId)?.id ?? users[0].id
  return { albumSize: ALBUM_SIZE, users, activeUserId, compareUserId }
}

export const hydrateState = (state: AppState, cards: PokemonCard[]): AppState => ({
  ...state,
  albumSize: ALBUM_SIZE,
  users: state.users.map((user) => {
    const inventory: Record<string, CardInventory> = {}
    cards.forEach((card, index) => { inventory[card.id] = user.inventory[card.id] ?? user.inventory[`slot:${index + 1}`] ?? emptyInventory() })
    return { ...user, inventory }
  }),
})

export const refreshChestCharges = (state: AppState, now: number): AppState => ({
  ...state,
  users: state.users.map((user) => {
    let chests = user.chests
    let nextChestAt = user.nextChestAt
    while (nextChestAt && now >= nextChestAt && chests < MAX_CHESTS) { chests += 1; nextChestAt += CHEST_INTERVAL_MS }
    if (chests >= MAX_CHESTS) nextChestAt = undefined
    return chests === user.chests && nextChestAt === user.nextChestAt ? user : { ...user, chests, nextChestAt }
  }),
})
