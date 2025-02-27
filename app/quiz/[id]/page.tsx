"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { fetchQuizQuestions, submitQuizResults } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Timer } from "@/components/timer"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer?: string
}

interface QuizParams {
  params: {
    id: string
  }
}

export default function QuizPage({ params }: QuizParams) {
  const { id } = params
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false)
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const data = await fetchQuizQuestions(id)
        setQuestions(data)
      } catch (error) {
        console.error("Failed to fetch questions:", error)
      } finally {
        setLoading(false)
      }
    }

    getQuestions()
  }, [id])

  useEffect(() => {
    if (!quizStarted || quizCompleted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleQuizComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, quizCompleted])

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const handleSelectAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      handleQuizComplete()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleQuizComplete = async () => {
    setQuizCompleted(true)

    // Calculate score
    let correctAnswers = 0
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(finalScore)

    // Submit results if authenticated
    if (isAuthenticated && user) {
      try {
        await submitQuizResults(id, {
          userId: user.id,
          score: finalScore,
          answers: selectedAnswers,
          timeSpent: 300 - timeRemaining,
        })
      } catch (error) {
        console.error("Failed to submit quiz results:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading quiz...</div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Start?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This quiz contains {questions.length} questions.</p>
            <p className="mb-4">You will have 5 minutes to complete the quiz.</p>
            <p>Click the button below when you're ready to begin.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartQuiz} className="w-full">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2">{score}%</div>
              <p>Your Score</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Correct Answers:</span>
                <span className="font-medium">
                  {questions.filter((q) => selectedAnswers[q.id] === q.correctAnswer).length} / {questions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time Spent:</span>
                <span className="font-medium">
                  {Math.floor((300 - timeRemaining) / 60)}m {(300 - timeRemaining) % 60}s
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={() => router.push("/quizzes")} className="w-full">
              Try Another Quiz
            </Button>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full">
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <div>
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <Timer seconds={timeRemaining} />
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="pt-6">
          <CardTitle className="text-xl mb-6">{currentQuestion.text}</CardTitle>
          <RadioGroup
            value={selectedAnswers[currentQuestion.id] || ""}
            onValueChange={(value) => handleSelectAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-muted"
                onClick={() => handleSelectAnswer(currentQuestion.id, option)}
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline">
            Previous
          </Button>
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

