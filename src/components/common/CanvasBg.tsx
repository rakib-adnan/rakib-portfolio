import { useEffect, useRef } from 'react'

interface Dot {
  baseX: number
  baseY: number
  x: number
  y: number
  phase: number
  phaseY: number
  color: string
  size: number
  opacity: number
}

// VANTA.DOTS-style — wave-animated dot grid with connecting paths
// Primary: cyan #06b6d4 · Secondary: purple #8b5cf6
const CanvasBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const mouse = { x: -9999, y: -9999 }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    let dots: Dot[] = []

    const buildDots = () => {
      dots = []
      const SPACING = 85
      const cols = Math.ceil(canvas.width / SPACING) + 2
      const rows = Math.ceil(canvas.height / SPACING) + 2
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            baseX: i * SPACING + (Math.random() - 0.5) * 20,
            baseY: j * SPACING + (Math.random() - 0.5) * 20,
            x: 0,
            y: 0,
            phase: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            color: Math.random() > 0.45 ? '#06b6d4' : '#8b5cf6',
            size: Math.random() * 2.4 + 0.8,
            opacity: Math.random() * 0.55 + 0.25,
          })
        }
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      buildDots()
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    const CONNECT = 92
    const WAVE = 15
    let tick = 0

    const draw = () => {
      ctx.fillStyle = '#030712'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      tick += 0.005

      for (const d of dots) {
        d.x = d.baseX + Math.sin(tick + d.phase) * WAVE
        d.y = d.baseY + Math.cos(tick * 0.8 + d.phaseY) * WAVE
        // Mouse repulsion
        const mdx = d.x - mouse.x
        const mdy = d.y - mouse.y
        const md = Math.sqrt(mdx * mdx + mdy * mdy)
        if (md < 110 && md > 0) {
          const f = ((110 - md) / 110) * 20
          d.x += (mdx / md) * f
          d.y += (mdy / md) * f
        }
      }

      // Connecting paths
      ctx.lineWidth = 0.5
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > CONNECT) continue
          const a = (1 - dist / CONNECT) * 0.2
          ctx.beginPath()
          ctx.moveTo(dots[i].x, dots[i].y)
          ctx.lineTo(dots[j].x, dots[j].y)
          ctx.strokeStyle = `rgba(6,182,212,${a})`
          ctx.stroke()
        }
      }

      // Mouse → dot violet paths
      ctx.lineWidth = 0.8
      for (const d of dots) {
        const dx = d.x - mouse.x
        const dy = d.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 130) {
          const a = (1 - dist / 130) * 0.4
          ctx.beginPath()
          ctx.moveTo(mouse.x, mouse.y)
          ctx.lineTo(d.x, d.y)
          ctx.strokeStyle = `rgba(139,92,246,${a})`
          ctx.stroke()
        }
      }

      // Dots
      for (const d of dots) {
        if (d.size > 1.8) {
          ctx.beginPath()
          ctx.arc(d.x, d.y, d.size * 2.8, 0, Math.PI * 2)
          ctx.fillStyle = d.color
          ctx.globalAlpha = d.opacity * 0.1
          ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2)
        ctx.fillStyle = d.color
        ctx.globalAlpha = d.opacity
        ctx.fill()
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
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}

export default CanvasBg
