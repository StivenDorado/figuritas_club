import { useCallback, useEffect, useState } from 'react'
import { fetchPokemonCards } from '../services/pokemonService'
import type { PokemonCard } from '../types'

export type PokemonCardsStatus = 'loading' | 'ready' | 'error'

export function usePokemonCards() {
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [status, setStatus] = useState<PokemonCardsStatus>('loading')
  const [error, setError] = useState('')
  const [source, setSource] = useState<'api' | 'fallback'>('api')
  const [retryToken, setRetryToken] = useState(0)
  const retry = useCallback(() => setRetryToken((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setError('')
    fetchPokemonCards(controller.signal).then((result) => {
      setCards(result.cards)
      setSource(result.source)
      setError(result.warning ?? '')
      setStatus('ready')
    }).catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === 'AbortError') return
      setStatus('error')
      setError(reason instanceof Error ? reason.message : 'No se pudo cargar el álbum')
    })
    return () => controller.abort()
  }, [retryToken])

  return { cards, status, error, source, retry }
}
