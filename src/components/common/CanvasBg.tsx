import { useEffect, useRef } from 'react'

// Wave dot grid — replicates RyanCV Digital theme WebGL animation
// GLSL wave: pos.y += (cos(x/w * PI*8 + t*speed) + sin(z/d * PI*8 + t*speed)) * amp
// Color: brand cyan (#06b6d4) left → purple (#8b5cf6) right, alpha fades near→far
const CanvasBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    const t0 = performance.now()
    const PI = Math.PI

    const COLS = 58
    const ROWS = 34
    const HORIZON = 0.40   // horizon position as fraction of screen height
    const WAVE_AMP = 24    // max wave amplitude (pixels, at near)
    const WAVE_SPEED = 5.0 // matches original uniforms.speed = 5

    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    onResize()
    window.addEventListener('resize', onResize)

    const render = () => {
      const t = (performance.now() - t0) * 0.001 * WAVE_SPEED

      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const cx = W * 0.5
      const horizonY = H * HORIZON
      const groundH = H - horizonY

      // Draw far→near so near rows render on top
      for (let zi = 0; zi < ROWS; zi++) {
        // zr: 0=far(top), 1=near(bottom)
        const zr = zi / (ROWS - 1)

        // Exponential depth: far rows tightly packed, near rows spread out
        const rowY = horizonY + Math.pow(zr, 1.8) * groundH * 0.88

        // Perspective scale: near=wide, far=narrow
        const ps = 0.03 + Math.pow(zr, 1.3) * 0.97

        // Dot size and opacity increase toward camera
        const dotR = 0.5 + zr * 2.4
        const alpha = 0.05 + zr * 0.72

        for (let xi = 0; xi < COLS; xi++) {
          const xr = xi / (COLS - 1)   // 0=left, 1=right

          // Screen x: centered, spread by perspective scale
          const sx = cx + (xr - 0.5) * W * ps

          // Wave: exact GLSL formula translation
          // original: (cos(pos.x/field.x * PI*8 + t) + sin(pos.z/field.z * PI*8 + t)) * field.y
          const waveY = (
            Math.cos(xr * PI * 8 + t) +
            Math.sin(zr * PI * 8 + t)
          ) * WAVE_AMP * ps

          const sy = rowY - waveY

          // Color: matches original GL color buffer formula
          // original: (R=0, G=1-x/w, B=0.5+x/w*0.5, A=z/depth)
          // mapped to brand: cyan (#06b6d4) → purple (#8b5cf6)
          const r = Math.round(6 + xr * 133)   // 6 → 139
          const g = Math.round(182 - xr * 90)  // 182 → 92
          const b = Math.round(212 + xr * 34)  // 212 → 246

          // Soft glow halo (large faint circle)
          ctx.beginPath()
          ctx.arc(sx, sy, dotR * 3.8, 0, PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},${(alpha * 0.13).toFixed(3)})`
          ctx.fill()

          // Core dot
          ctx.beginPath()
          ctx.arc(sx, sy, dotR, 0, PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(render)
    }

    render()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
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
