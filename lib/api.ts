// This is a mock API service for the quiz app
// In a real application, these functions would make actual API calls

interface QuizCategory {
  id: string
  name: string
  description: string
  questionCount: number
  difficulty: string
}

interface QuizQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

interface QuizResult {
  userId: string
  score: number
  answers: Record<string, string>
  timeSpent: number
}

// Mock data
const categories = [
  {
    id: "science",
    name: "Science",
    description: "Test your knowledge of scientific concepts and discoveries",
    questionCount: 10,
    difficulty: "medium",
  },
  {
    id: "history",
    name: "History",
    description: "Challenge yourself with questions about world history",
    questionCount: 10,
    difficulty: "hard",
  },
  {
    id: "geography",
    name: "Geography",
    description: "Explore your knowledge of countries, capitals, and landmarks",
    questionCount: 10,
    difficulty: "easy",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Questions about movies, music, and pop culture",
    questionCount: 10,
    difficulty: "medium",
  },
  {
    id: "sports",
    name: "Sports",
    description: "Test your knowledge of various sports and sporting events",
    questionCount: 10,
    difficulty: "medium",
  },
]

// Mock questions for each category
const questions: Record<string, QuizQuestion[]> = {
  science: [
    {
      id: "s1",
      text: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "Fe", "Gd"],
      correctAnswer: "Au",
    },
    {
      id: "s2",
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
    },
    // More questions would be added here
  ],
  history: [
    {
      id: "h1",
      text: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: "1945",
    },
    {
      id: "h2",
      text: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "John Adams", "George Washington", "James Madison"],
      correctAnswer: "George Washington",
    },
    // More questions would be added here
  ],
  // More categories would be added here
}

// Mock API functions
export async function fetchQuizCategories(): Promise<QuizCategory[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories)
    }, 800)
  })
}

export async function fetchQuizQuestions(categoryId: string): Promise<QuizQuestion[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const categoryQuestions = questions[categoryId]
      if (categoryQuestions) {
        resolve(categoryQuestions)
      } else {
        reject(new Error("Category not found"))
      }
    }, 1000)
  })
}

export async function submitQuizResults(categoryId: string, results: QuizResult): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Quiz results submitted for category ${categoryId}:`, results)
      resolve()
    }, 800)
  })
}

