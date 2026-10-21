import { useEffect, useRef } from 'react'

/**
 * Spring-driven 3D tilt, written against Apple's fluid-interface rules:
 * - one independent spring per axis (rotateX / rotateY), critically damped by default
 * - always animates from the live value, so it can be interrupted at any frame
 * - fine pointers tilt toward the cursor; touch can drag (1:1, rubber-banded) and the
 *   release velocity is handed to the spring so there is no seam between drag and settle
 * Writes `--rx` / `--ry` (deg) and the sheen position `--sx` / `--sy` on the element.
 */

interface Spring { x: number; v: number; target: number }

interface Options {
  /** Max tilt in degrees for hover. */
  max?: number
  /** Seconds to reach target (Apple's "response"). */
  response?: number
  /** 1 = no overshoot. */
  damping?: number
  /** Allow touch drag to rotate around Y. */
  drag?: boolean
}

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

function rubberband(over: number, dim: number, c = 0.55) {
  return (over * dim * c) / (dim + c * Math.abs(over))
}

export function useTilt<T extends HTMLElement>({ max = 8, response = 0.45, damping = 1, drag = false }: Options = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return

    const rx: Spring = { x: 0, v: 0, target: 0 }
    const ry: Spring = { x: 0, v: 0, target: 0 }
    const k = (2 * Math.PI / response) ** 2
    const cHover = (4 * Math.PI * damping) / response
    // A flick carried momentum, so its settle may overshoot a touch (Apple: damping ~0.8)
    const cFling = (4 * Math.PI * Math.min(damping, 0.8)) / response
    let c = cHover
    let raf = 0
    let last = 0
    let dragging = false

    const step = (s: Spring, dt: number) => {
      const a = -k * (s.x - s.target) - c * s.v
      s.v += a * dt
      s.x += s.v * dt
    }
    const settled = (s: Spring) => Math.abs(s.x - s.target) < 0.01 && Math.abs(s.v) < 0.01

    const write = () => {
      el.style.setProperty('--rx', `${rx.x.toFixed(3)}deg`)
      el.style.setProperty('--ry', `${ry.x.toFixed(3)}deg`)
      // unitless copies for the light sheen position
      el.style.setProperty('--sx', `${(50 - ry.x * 4).toFixed(2)}%`)
      el.style.setProperty('--sy', `${(20 + rx.x * 4).toFixed(2)}%`)
    }

    const tick = (t: number) => {
      const dt = Math.min(0.032, last ? (t - last) / 1000 : 1 / 60)
      last = t
      if (!dragging) step(ry, dt)
      step(rx, dt)
      write()
      if (dragging || !settled(rx) || !settled(ry)) raf = requestAnimationFrame(tick)
      else { raf = 0; last = 0 }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }

    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches

    // Hover: aim at the cursor. Springs carry the motion, so fast mouse moves stay smooth.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || dragging) return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      c = cHover
      ry.target = px * 2 * max
      rx.target = -py * 2 * max
      kick()
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      rx.target = 0
      ry.target = 0
      kick()
    }

    // Touch drag around Y: 1:1 tracking from the grab point, rubber-band past the limit.
    let startX = 0, startY = 0, startRy = 0, decided = false
    const hist: { x: number; t: number }[] = []
    const limit = 28
    const onDown = (e: PointerEvent) => {
      if (!drag || e.pointerType === 'mouse') return
      startX = e.clientX; startY = e.clientY; startRy = ry.x
      decided = false
      hist.length = 0
      hist.push({ x: e.clientX, t: e.timeStamp })
    }
    const onTouchMove = (e: PointerEvent) => {
      if (!drag || e.pointerType === 'mouse' || !hist.length) return
      const dx = e.clientX - startX, dy = e.clientY - startY
      if (!decided) {
        if (Math.hypot(dx, dy) < 10) return // hysteresis before committing to a direction
        decided = true
        if (Math.abs(dy) > Math.abs(dx)) { hist.length = 0; return } // it's a scroll, let it go
        dragging = true
        el.setPointerCapture(e.pointerId)
        ry.v = 0
      }
      if (!dragging) return
      const raw = startRy + dx * 0.35
      const over = Math.abs(raw) - limit
      ry.x = over > 0 ? Math.sign(raw) * (limit + rubberband(over, 60)) : raw
      rx.target = 0
      hist.push({ x: e.clientX, t: e.timeStamp })
      if (hist.length > 5) hist.shift()
      kick()
    }
    const onUp = () => {
      if (!dragging) { hist.length = 0; return }
      dragging = false
      const a = hist[0], b = hist[hist.length - 1]
      const dt = (b.t - a.t) / 1000
      ry.v = dt > 0 ? ((b.x - a.x) / dt) * 0.35 : 0 // hand release velocity (deg/s) to the spring
      ry.target = 0
      c = cFling
      hist.length = 0
      kick()
    }

    if (fine) {
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
    }
    if (drag) {
      el.addEventListener('pointerdown', onDown)
      el.addEventListener('pointermove', onTouchMove)
      el.addEventListener('pointerup', onUp)
      el.addEventListener('pointercancel', onUp)
    }
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onTouchMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [max, response, damping, drag])

  return ref
}
