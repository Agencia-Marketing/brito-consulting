# Guía rápida — Editar el contenido de tu web

Tu web tiene un panel para cambiar textos, precios, imágenes, etc. **sin tocar código**.
No necesitas saber nada técnico. Sigue estos pasos.

## 1. Entrar al panel

1. Abre: **https://brito-consulting.programacionagencia.workers.dev/keystatic**
2. Pulsa **"Sign in with GitHub"** e inicia sesión.
3. Verás el panel de administración.

## 2. Editar

1. En la barra izquierda, pulsa **"Contenido del sitio"**.
2. Verás todas las secciones de la web (Hero, Servicios, Portafolio, Testimonios, etc.).
3. Cambia los textos, precios o imágenes que quieras.
4. Pulsa **"Save"** (arriba a la derecha).

✅ Listo. En **~1 minuto** los cambios aparecen en la web pública.

## 3. Subir imágenes

- En Portafolio y Testimonios hay campos de imagen.
- Si subes una imagen, sustituye al color/iniciales de fondo.
- Si lo dejas vacío, se usa el fondo de color o las iniciales.

## 4. Cobrar planes online (Stripe)

Cada plan de la sección **Servicios** tiene un apartado **"Opciones de compra (Stripe)"**.
Ahí decides qué se cobra y por cuánto — **no hace falta crear nada en Stripe**:

- **Etiqueta:** el texto del botón (ej: `Pago único`, `30 segundos`, `A la medida`).
- **Importe a cobrar (USD):** el precio en dólares, **solo el número** (ej: `250`).

Reglas:
- **1 opción** → el plan muestra un botón **"Comprar"**.
- **Varias opciones** → aparece un botón por cada una (útil para vídeos por duración, piezas sueltas…).
- **Sin opciones** (lista vacía) → el botón vuelve a ser **"Solicitar"** y lleva al formulario de contacto.

Al pulsar Comprar, el cliente paga en la pasarela segura de Stripe y vuelve a una página de *gracias*.
El recibo lo envía Stripe automáticamente; la entrega del servicio la gestionas tú.

> La **clave secreta de Stripe** la configura una sola vez el desarrollador (no se toca desde aquí).

---

## ⚠️ Cosas que puedes IGNORAR

El panel está en inglés y muestra opciones técnicas que **no necesitas tocar**:

- **"Current branch" / "main" / "New branch…"** → ignóralo. Edita siempre y pulsa Save, nada más.
- **"Dashboard"** → es la pantalla de inicio.
- **"Hello, …"** → solo te saluda con tu usuario.

**Regla de oro:** entra → *Contenido del sitio* → edita → **Save**. El resto, ignóralo.

## ❓ Problemas

- Si el login falla o algo no guarda, contacta al desarrollador.
- Los cambios NO se pierden: cada *Save* queda registrado.
