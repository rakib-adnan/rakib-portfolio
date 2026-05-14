import { useEffect, useRef } from 'react'

// Laser grid + floating network paths — Vanta-inspired, pure canvas
const CanvasBg = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let mouse = { x: -9999, y: -9999 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMouseMove)

    // ── Particles ─────────────────────────────────────────────────────────
    const COUNT = Math.min(Math.floor(window.innerWidth / 12), 90)
    const CONNECT_DIST = 160
    const MOUSE_DIST = 120

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6,
      color: Math.random() > 0.7 ? '#06b6d4' : Math.random() > 0.5 ? '#3b82f6' : '#8b5cf6',
      opacity: Math.random() * 0.6 + 0.3,
    }))

    // ── Grid config ────────────────────────────────────────────────────────
    const GRID_SIZE = 60
    let tick = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Solid background
      ctx.fillStyle = '#030712'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      tick += 0.008

      // ── Laser grid ──────────────────────────────────────────────────────
      const gridAlpha = 0.06
      ctx.strokeStyle = `rgba(6,182,212,${gridAlpha})`
      ctx.lineWidth = 0.5

      // Vertical grid lines
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      // Horizontal grid lines
      for (let y = 0; y < canvas.height; y += GRID_SIZE) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Animated scan lines — horizontal laser sweeps
      const scanY1 = ((tick * 80) % (canvas.height + 200)) - 100
      const scanY2 = ((tick * 55 + canvas.height * 0.5) % (canvas.height + 200)) - 100
      for (const sy of [scanY1, scanY2]) {
        const grad = ctx.createLinearGradient(0, sy - 2, 0, sy + 2)
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(0.5, 'rgba(6,182,212,0.15)')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, sy - 2, canvas.width, 4)
      }

      // Animated scan lines — vertical
      const scanX1 = ((tick * 60) % (canvas.width + 200)) - 100
      const vgrad = ctx.createLinearGradient(scanX1 - 2, 0, scanX1 + 2, 0)
      vgrad.addColorStop(0, 'transparent')
      vgrad.addColorStop(0.5, 'rgba(59,130,246,0.1)')
      vgrad.addColorStop(1, 'transparent')
      ctx.fillStyle = vgrad
      ctx.fillRect(scanX1 - 2, 0, 4, canvas.height)

      // ── Move & wrap particles ────────────────────────────────────────────
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        // Slight mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_DIST && dist > 0) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.015
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 0.8) { p.vx *= 0.8 / speed; p.vy *= 0.8 / speed }
      }

      // ── Draw connecting paths ────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > CONNECT_DIST) continue

          const alpha = (1 - dist / CONNECT_DIST) * 0.35
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(6,182,212,${alpha})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      // Mouse lines to nearby particles
      for (const p of particles) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_DIST * 1.2) {
          const alpha = (1 - dist / (MOUSE_DIST * 1.2)) * 0.5
          ctx.beginPath()
          ctx.moveTo(mouse.x, mouse.y)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      // ── Draw particle dots ───────────────────────────────────────────────
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()

        // Glow for larger dots
        if (p.r > 1.5) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.opacity * 0.15
          ctx.fill()
        }
      }

      // Corner glow orbs for depth
      const orbs = [
        { x: 0, y: 0, r: 350, c: 'rgba(6,182,212,0.04)' },
        { x: canvas.width, y: canvas.height, r: 400, c: 'rgba(59,130,246,0.035)' },
        { x: canvas.width, y: 0, r: 300, c: 'rgba(139,92,246,0.03)' },
      ]
      ctx.globalAlpha = 1
      for (const o of orbs) {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        g.addColorStop(0, o.c)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}

export default CanvasBg
