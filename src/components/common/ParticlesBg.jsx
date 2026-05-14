import { useCallback, useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

const ParticlesBg = () => {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesLoaded = useCallback(async () => {
    // particles loaded
  }, [])

  const options = {
    background: {
      color: { value: 'transparent' },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 80,
        density: { enable: true, area: 900 },
      },
      color: {
        value: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ffffff'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.05, max: 0.5 },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.05,
          sync: false,
        },
      },
      size: {
        value: { min: 0.5, max: 2.5 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.5,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 120,
        color: '#06b6d4',
        opacity: 0.08,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
        bounce: false,
      },
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: {
          enable: true,
          mode: 'grab',
        },
        resize: { enable: true },
      },
      modes: {
        grab: {
          distance: 140,
          links: { opacity: 0.3 },
        },
      },
    },
    detectRetina: true,
  }

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default ParticlesBg
