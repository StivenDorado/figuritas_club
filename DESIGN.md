---
version: alpha
colors:
  ink: "#18323a"
  paper: "#f6f2ea"
  line: "#d9dfd7"
  coral: "#e8785f"
  mint: "#c7eadb"
  blue: "#b9d9e4"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    lineHeight: "0.98"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: "1.5"
  utility:
    fontFamily: "DM Mono, monospace"
    fontSize: "0.6875rem"
    lineHeight: "1.3"
rounded:
  card: "24px"
  control: "12px"
  pill: "999px"
spacing:
  base: "4px"
  section: "32px"
components:
  stickerCell:
    radius: "12px"
    states: "missing / owned / repeat"
  primaryButton:
    radius: "12px"
    background: "#18323a"
---

## Overview

Figuritas Club es un producto para una escena física y social: amigos sentados alrededor de una mesa, álbum abierto y montones de repetidas. La interfaz se siente como una libreta de intercambio bien cuidada, no como un panel administrativo. El registro es de producto: claridad, feedback y lectura rápida ganan a la decoración. El MVP usa exactamente 20 cartas de Pokémon TCG para que cada sesión sea corta, visible y jugable. La API es la fuente primaria de imagen y contenido; si no está disponible, el producto hace explícito un modo demo remoto para no dejar una colección vacía.

La firma visual es la cuadrícula de tarjetas coleccionables sobre una trama de papel: cada carta combina número, rareza, nombre, icono y estado. El cofre funciona como segundo gesto memorable, una pequeña recompensa animada que hace que “conseguir” sea una acción y no solo un formulario.

## Colors

`ink` es la tinta estructural y el principal contraste. `paper` es el fondo cálido de la libreta. `coral` marca acción y repetida; `mint` marca colección confirmada; `blue` queda para información auxiliar. Las rarezas se expresan con gradientes de tarjeta y texto explícito: Común, Rara, Épica y Legendaria. El color nunca es el único indicador: cada estado usa texto accesible y etiqueta ARIA.

## Typography

Space Grotesk da a los títulos la energía de una etiqueta de álbum. DM Sans sostiene lectura y controles. DM Mono se reserva para números, porcentajes y etiquetas breves de sistema.

## Layout

El shell usa una columna lateral estable en escritorio y se apila en móvil. La densidad es aireada cerca del encabezado y compacta dentro de la cuadrícula. Las tarjetas de intercambio comparten la misma geometría y cambian solo su tono semántico.

## Elevation & Depth

Las superficies son mayoritariamente planas. La colección usa una sombra baja y desplazada, como una tarjeta apoyada sobre papel; no se usan sombras difusas para cada control.

## Shapes

Las tarjetas usan radios generosos de 24px; los controles usan 12px; las pills quedan para estados y metadatos. Los bordes son finos y verdosos para continuar la sensación de papel reciclado.

## Components

La cuadrícula de cartas es un conjunto de botones, no un elemento visual pasivo: cada tarjeta tiene nombre accesible, imagen remota y avanza por los tres estados. El cofre por persona persiste sus usos disponibles, recarga una unidad cada dos minutos hasta tres y guarda la última recompensa. El trueque muestra pares entrega/recibe y permite completarlos de forma bilateral. Los formularios usan validación propia y la persistencia es localStorage con fallback seguro a datos remotos de demostración.

## Do's and Don'ts

- Do: escribir acciones en lenguaje del grupo: “La tengo”, “Repetida”, “Copiar resumen”.
- Do: mostrar el resultado del cruce bilateral de un vistazo.
- Don't: convertir el álbum en una tabla fría o esconder el estado en hover.
- Don't: usar alertas del navegador o depender de color sin texto.
