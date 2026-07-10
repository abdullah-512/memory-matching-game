'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Card {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

const SYMBOLS = ['🌟', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎬']

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  // Initialize the game
  useEffect(() => {
    initializeGame()
  }, [])

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      const delay = setTimeout(() => {
        if (cards[first].symbol === cards[second].symbol) {
          // Match found
          setMatched([...matched, first, second])
          setFlipped([])
        } else {
          // No match, flip back
          setFlipped([])
        }
      }, 600)

      return () => clearTimeout(delay)
    }
  }, [flipped, cards, matched])

  // Check for win condition
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length && cards.length > 0) {
      setGameWon(true)
    }
  }, [matched, cards.length])

  const initializeGame = () => {
    const shuffled = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (id: number) => {
    if (
      flipped.includes(id) ||
      matched.includes(id) ||
      flipped.length === 2 ||
      gameWon
    ) {
      return
    }

    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
    }
  }

  const isCardFlipped = (id: number) => flipped.includes(id) || matched.includes(id)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            Memory Match
          </h1>
          <p className="text-foreground/60 text-lg">Find all the matching pairs</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 text-center border border-border">
            <div className="text-sm text-foreground/60 mb-1">Moves</div>
            <div className="text-3xl font-bold text-primary">{moves}</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center border border-border">
            <div className="text-sm text-foreground/60 mb-1">Pairs Found</div>
            <div className="text-3xl font-bold text-accent">
              {matched.length / 2}/{cards.length / 2}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-lg mb-8">
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-lg font-bold text-3xl transition-all duration-300 transform ${
                  isCardFlipped(card.id)
                    ? 'bg-gradient-to-br from-primary to-secondary text-white scale-100 shadow-md'
                    : 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-foreground/30 hover:shadow-lg hover:scale-105 active:scale-95'
                } ${matched.includes(card.id) ? 'ring-2 ring-accent' : ''}`}
                disabled={isCardFlipped(card.id) || flipped.length === 2 || gameWon}
              >
                <span className="inline-block">
                  {isCardFlipped(card.id) ? card.symbol : '?'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Win Screen */}
        {gameWon && (
          <div className="bg-gradient-to-r from-accent to-secondary rounded-xl p-6 mb-6 text-center border border-accent/50">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              You Won!
            </h2>
            <p className="text-foreground/70 mb-4">
              Completed in <span className="font-bold text-accent">{moves} moves</span>
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={initializeGame}
            className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-lg transition-all"
          >
            {gameWon ? 'Play Again' : 'New Game'}
          </Button>
          {moves > 0 && !gameWon && (
            <Button
              onClick={initializeGame}
              variant="outline"
              className="h-12 text-lg font-semibold rounded-lg"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
