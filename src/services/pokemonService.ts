import type { PokemonCard } from '../types'

export const POKEMON_CARDS_URL = 'https://api.pokemontcg.io/v2/cards?pageSize=20'
const requestUrl = import.meta.env.DEV ? '/pokemon-tcg-api/cards?pageSize=20' : POKEMON_CARDS_URL

const fallbackIds = [
  ['base1-4', 'Charizard'], ['base1-2', 'Blastoise'], ['base1-15', 'Venusaur'], ['base1-10', 'Mewtwo'],
  ['base1-7', 'Hitmonchan'], ['base1-20', 'Pikachu'], ['base1-5', 'Clefairy'], ['base1-14', 'Jynx'],
  ['base1-13', 'Jigglypuff'], ['base1-17', 'Nidoking'], ['base1-16', 'Nidoqueen'], ['base1-11', 'Machamp'],
  ['base1-12', 'Gyarados'], ['base1-3', 'Chansey'], ['base1-1', 'Alakazam'], ['base1-6', 'Gyarados'],
  ['base1-8', 'Gyarados'], ['base1-9', 'Magneton'], ['base1-18', 'Dragonair'], ['base1-19', 'Dugtrio'],
] as const

const fallbackCards: PokemonCard[] = fallbackIds.map(([id, name]) => {
  const [set, number] = id.split('-')
  const image = `https://images.pokemontcg.io/${set}/${number}_hires.png`
  return { id, name, number, rarity: number === '20' ? 'Rare Holo' : Number(number) % 3 === 0 ? 'Rare' : 'Common', setName: 'Base Set · demo remoto', supertype: 'Pokémon', types: [], imageSmall: image, imageLarge: image }
})

type ApiCard = {
  id?: string
  name?: string
  number?: string
  rarity?: string
  supertype?: string
  types?: string[]
  set?: { name?: string }
  images?: { small?: string; large?: string }
}

export async function fetchPokemonCards(signal?: AbortSignal): Promise<{ cards: PokemonCard[]; source: 'api' | 'fallback'; warning?: string }> {
  try {
    const response = await fetch(requestUrl, { signal, headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`La API respondió con ${response.status}`)
    const payload = await response.json() as { data?: ApiCard[] }
    const cards = Array.isArray(payload.data) ? payload.data.slice(0, 20) : []
    if (cards.length !== 20) throw new Error('La API no devolvió exactamente 20 cartas')
    return { source: 'api', cards: cards.map((card, index) => ({
      id: card.id ?? `pokemon-${index + 1}`,
      name: card.name ?? `Carta ${index + 1}`,
      number: card.number ?? String(index + 1),
      rarity: card.rarity ?? 'Common',
      setName: card.set?.name ?? 'Pokémon TCG',
      supertype: card.supertype ?? 'Pokémon',
      types: card.types ?? [],
      imageSmall: card.images?.small ?? '',
      imageLarge: card.images?.large ?? card.images?.small ?? '',
    })) }
  } catch (reason: unknown) {
    if (reason instanceof DOMException && reason.name === 'AbortError') throw reason
    return { source: 'fallback', cards: fallbackCards, warning: reason instanceof Error ? reason.message : 'La API no respondió' }
  }
}
