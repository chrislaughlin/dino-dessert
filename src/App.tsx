import { useEffect, useMemo, useRef, useState } from 'react'
import { dessertNames, dinosaurNames, letters } from './data/names'
import './App.css'

type ReelState = {
  dinosaur: string
  dessert: string
}

const SPIN_DURATION = 2200
const SPIN_TICK = 110

export default function App() {
  const [letterIndex, setLetterIndex] = useState(0)
  const [display, setDisplay] = useState<ReelState>(() => ({
    dinosaur: dinosaurNames[letters[0]][0],
    dessert: dessertNames[letters[0]][0],
  }))
  const [finalName, setFinalName] = useState<string>('')
  const [isSpinning, setIsSpinning] = useState(false)
  const spinIntervalRef = useRef<number | null>(null)

  const selectedLetter = letters[letterIndex]
  const dinosaurOptions = useMemo(() => dinosaurNames[selectedLetter], [selectedLetter])
  const dessertOptions = useMemo(() => dessertNames[selectedLetter], [selectedLetter])

  useEffect(() => {
    setDisplay({ dinosaur: dinosaurOptions[0], dessert: dessertOptions[0] })
    setFinalName(`${dinosaurOptions[0]} ${dessertOptions[0]}`)
  }, [dinosaurOptions, dessertOptions])

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current !== null) {
        window.clearInterval(spinIntervalRef.current)
      }
    }
  }, [])

  const changeLetter = (direction: 1 | -1) => {
    if (isSpinning) return
    setLetterIndex((current) => {
      const next = (current + direction + letters.length) % letters.length
      return next
    })
  }

  const spin = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setFinalName('')

    if (spinIntervalRef.current !== null) {
      window.clearInterval(spinIntervalRef.current)
    }

    spinIntervalRef.current = window.setInterval(() => {
      const randomDino = dinosaurOptions[Math.floor(Math.random() * dinosaurOptions.length)]
      const randomDessert = dessertOptions[Math.floor(Math.random() * dessertOptions.length)]
      setDisplay({ dinosaur: randomDino, dessert: randomDessert })
    }, SPIN_TICK)

    window.setTimeout(() => {
      if (spinIntervalRef.current !== null) {
        window.clearInterval(spinIntervalRef.current)
        spinIntervalRef.current = null
      }

      const finalDino = dinosaurOptions[Math.floor(Math.random() * dinosaurOptions.length)]
      const finalDessert = dessertOptions[Math.floor(Math.random() * dessertOptions.length)]
      setDisplay({ dinosaur: finalDino, dessert: finalDessert })
      setFinalName(`${finalDino} ${finalDessert}`)
      setIsSpinning(false)
    }, SPIN_DURATION)
  }

  return (
    <div className="app">
      <main className="card">
        <header className="card__header">
          <h1 className="card__title">DinoDessert Name Generator</h1>
          <p className="card__subtitle">Spin the reels to find a roaringly sweet name!</p>
        </header>

        <section className="card__letter">
          <button
            className="letter-wheel__control"
            type="button"
            onClick={() => changeLetter(-1)}
            aria-label="Previous letter"
            disabled={isSpinning}
          >
            ▲
          </button>
          <div className="letter-wheel">
            <div className="letter-wheel__window">
              <span className="letter-wheel__letter">{selectedLetter}</span>
            </div>
            <div className="letter-wheel__glow" aria-hidden="true" />
          </div>
          <button
            className="letter-wheel__control"
            type="button"
            onClick={() => changeLetter(1)}
            aria-label="Next letter"
            disabled={isSpinning}
          >
            ▼
          </button>
        </section>

        <section className="slot-display">
          <div className={`slot-window ${isSpinning ? 'slot-window--spinning' : ''}`}>
            <div className="slot-window__label">Dinosaur</div>
            <div className="slot-window__value" aria-live="assertive">
              {display.dinosaur}
            </div>
          </div>
          <div className="slot-display__plus" aria-hidden="true">
            <span>+</span>
          </div>
          <div className={`slot-window ${isSpinning ? 'slot-window--spinning' : ''}`}>
            <div className="slot-window__label">Dessert</div>
            <div className="slot-window__value" aria-live="assertive">
              {display.dessert}
            </div>
          </div>
        </section>

        <button className="spin-button" type="button" onClick={spin} disabled={isSpinning}>
          {isSpinning ? 'Spinning...' : 'Spin'}
        </button>

        <section className="result" aria-live="polite">
          {finalName && <h2 className="result__name">{finalName}</h2>}
          {!finalName && !isSpinning && <p className="result__hint">Pick a letter and spin to get started!</p>}
          {isSpinning && <p className="result__hint">Matching munchies in motion...</p>}
        </section>

        <footer className="card__footer">
          <div className="pill">{dinosaurOptions.length} dinos ready</div>
          <div className="pill">{dessertOptions.length} treats tasty</div>
        </footer>
      </main>
    </div>
  )
}
