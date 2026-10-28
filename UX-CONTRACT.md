# Figuritas Club · contrato UX

## Alcance

MVP local, sin backend ni cuentas. El álbum tiene exactamente 20 cartas cargadas desde `https://api.pokemontcg.io/v2/cards?pageSize=20`. En desarrollo, Vite usa un proxy del mismo origen para evitar CORS; si la API no responde, se muestra un modo demo explícito con imágenes remotas. El estado de álbum, personas, cofres y marcas vive en `localStorage` bajo `figuritas-club-v3`; se migra desde las claves anteriores y, si el almacenamiento no está disponible, se usa la semilla en memoria.

## Mapa canónico

| Capacidad | Owner | Decisión | Verificación |
|---|---|---|---|
| Formulario | Formularios nativos con validación propia | `noValidate`, texto y preservación de valor | `npm run check` + flujo manual |
| Select/listbox | Select nativo | Se acepta popup del sistema para elegir amigo | teclado + flujo manual |
| Toast | Estado `role=status` en `App` | feedback breve, no crítico | flujo manual |
| CRUD de personas | `addUser` en `App` | crear sin recargar; no hay borrado destructivo en MVP | flujo manual |
| Colección | componente `StickerCard` | carta con rareza + ciclo faltante → poseída → repetida → faltante | flujo manual |
| Cofre | `ChestPanel` + `drawChest` | 3–4 cartas aleatorias, 3 cargas por persona, nueva/repetida, recarga cada 2 minutos | flujo manual |
| API | `usePokemonCards` + `pokemonService.ts` | petición cancelable, exactamente 20 cartas, loading/error/retry/fallback remoto | flujo manual |
| Trueque | `TradePair` + `completeTrade` | entrega/recibe bilateral y actualización de las dos colecciones | flujo manual |
| Intercambio | `calculateExchange` en `logic.ts` | `Set` + cruce bilateral defensivo | `npm run check` |

## Estados y feedback

- Colección: cada clic actualiza al instante y guarda de forma automática.
- Intercambio vacío: el panel explica qué falta marcar para generar coincidencias.
- Persistencia: recargar conserva el estado cuando el navegador permite almacenamiento.
- Errores de almacenamiento: no bloquean la app; se mantiene el estado en memoria.

## Accesibilidad y responsive

Controles nativos o botones semánticos, nombres accesibles, foco visible, `role=progressbar` y `role=status`. La navegación lateral se apila en pantallas estrechas. Se respeta `prefers-reduced-motion`.
