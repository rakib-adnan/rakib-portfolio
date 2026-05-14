import { useEffect, useRef } from 'react'

const CODE_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF{}[]<>/=+-*;:.,!?@#$%^&'

const CanvasBg = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const FONT_SIZE = 14
    let columns = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.floor(canvas.width / FONT_SIZE)
      columns = Array.from({ length: count }, (_, i) => ({
        x: i * FONT_SIZE,
        y: Math.random() * -canvas.height,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.85 ? '#06b6d4' : Math.random() > 0.7 ? '#3b82f6' : '#22c55e',
      }))
    }

    resize()
    window.addEventListener('resize', resize)

    // Sparse orbs for depth
    const orbs = [
      { x: 0.15, y: 0.3, r: 200, color: 'rgba(6,182,212,0.035)' },
      { x: 0.85, y: 0.6, r: 240, color: 'rgba(59,130,246,0.03)' },
      { x: 0.5,  y: 0.85, r: 180, color: 'rgba(139,92,246,0.025)' },
    ]

    const draw = () => {
      // Solid dark fill — clears the frame completely
      ctx.fillStyle = '#030712'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Subtle orbs
      for (const orb of orbs) {
        const ox = orb.x * canvas.width
        const oy = orb.y * canvas.height
        const grd = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r)
        grd.addColorStop(0, orb.color)
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Code rain columns
      ctx.font = `${FONT_SIZE}px monospace`
      for (const col of columns) {
        // Head character — brighter
        ctx.globalAlpha = col.opacity + 0.4
        ctx.fillStyle = '#a5f3fc'
        const headChar = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
        ctx.fillText(headChar, col.x, col.y)

        // Body chars — 6 trailing glyphs with fading opacity
        for (let t = 1; t <= 6; t++) {
          const alpha = col.opacity * (1 - t / 7)
          if (alpha <= 0) continue
          ctx.globalAlpha = alpha
          ctx.fillStyle = col.color
          const trailChar = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
          ctx.fillText(trailChar, col.x, col.y - t * FONT_SIZE)
        }

        // Advance column
        col.y += col.speed
        if (col.y - 6 * FONT_SIZE > canvas.height) {
          col.y = Math.random() * -canvas.height * 0.5
          col.speed = Math.random() * 1.5 + 0.5
          col.opacity = Math.random() * 0.4 + 0.1
          col.color = Math.random() > 0.85 ? '#06b6d4' : Math.random() > 0.7 ? '#3b82f6' : '#22c55e'
        }
      }

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  )
}

export default CanvasBg
