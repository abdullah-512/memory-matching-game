'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Card {
  id: number
  image: string
  isFlipped: boolean
  isMatched: boolean
}

interface DifficultyLevel {
  name: string
  grid: number
  cards: number
}

const DIFFICULTY_LEVELS: Record<string, DifficultyLevel> = {
  easy: { name: 'Easy', grid: 4, cards: 8 },
  medium: { name: 'Medium', grid: 4, cards: 12 },
  hard: { name: 'Hard', grid: 6, cards: 18 },
}

const CARD_IMAGES = [
  '/cards/butterfly.png',
  '/cards/flower.png',
  '/cards/rocket.png',
  '/cards/star.png',
  '/cards/gem.png',
  '/cards/heart.png',
  '/cards/moon.png',
  '/cards/sun.png',
  '/cards/butterfly.png',
  '/cards/flower.png',
  '/cards/rocket.png',
  '/cards/star.png',
  '/cards/gem.png',
  '/cards/heart.png',
  '/cards/moon.png',
  '/cards/sun.png',
  '/cards/butterfly.png',
  '/cards/flower.png',
]

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY_LEVELS>('easy')
  const [gameStarted, setGameStarted] = useState(false)

  // Initialize the game
  useEffect(() => {
    initializeGame()
  }, [])

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      const delay = setTimeout(() => {
        if (cards[first].image === cards[second].image) {
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

  const initializeGame = (selectedDifficulty?: keyof typeof DIFFICULTY_LEVELS) => {
    const diff = selectedDifficulty || difficulty
    const numPairs = DIFFICULTY_LEVELS[diff].cards / 2
    const selectedImages = CARD_IMAGES.slice(0, numPairs)
    const shuffled = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
    setDifficulty(diff)
    setGameStarted(true)
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

  const gridCols = DIFFICULTY_LEVELS[difficulty].grid

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
            Memory Match
          </h1>
          <p className="text-foreground/60 text-xl mb-8">
            Select a difficulty level to start playing
          </p>
          
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
              <button
                key={key}
                onClick={() => initializeGame(key as keyof typeof DIFFICULTY_LEVELS)}
                className={`py-4 px-6 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                  key === 'easy'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : key === 'medium'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                }`}
              >
                {level.name} • {level.cards / 2} Pairs
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <div className="w-full" style={{ maxWidth: `${gridCols * 120}px` }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            Memory Match
          </h1>
          <p className="text-foreground/60 text-lg capitalize">
            {DIFFICULTY_LEVELS[difficulty].name} Mode
          </p>
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
          <div className={`grid gap-3 justify-center mx-auto`} style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(100px, 1fr))` }}>
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-xl font-bold text-3xl transition-all duration-300 transform overflow-hidden ${
                  isCardFlipped(card.id)
                    ? 'bg-white dark:bg-slate-800 scale-100 shadow-md ring-2 ring-primary/50'
                    : 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                } ${matched.includes(card.id) ? 'ring-2 ring-accent ring-offset-2' : ''}`}
                disabled={isCardFlipped(card.id) || flipped.length === 2 || gameWon}
              >
                {isCardFlipped(card.id) ? (
                  <img
                    src={card.image}
                    alt="card"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">?</span>
                )}
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
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <Button
              onClick={() => initializeGame(difficulty)}
              className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-lg transition-all"
            >
              {gameWon ? 'Play Again' : 'New Game'}
            </Button>
            {moves > 0 && !gameWon && (
              <Button
                onClick={() => setGameStarted(false)}
                variant="outline"
                className="h-12 text-lg font-semibold rounded-lg px-6"
              >
                Change Level
              </Button>
            )}
          </div>
          {gameWon && (
            <Button
              onClick={() => setGameStarted(false)}
              variant="outline"
              className="h-12 text-lg font-semibold rounded-lg w-full"
            >
              Try Another Level
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
