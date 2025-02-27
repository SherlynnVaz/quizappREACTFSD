"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  stats?: {
    completed: number
    averageScore: number
    bestCategory: string
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    // For demo purposes, we'll simulate a successful login
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate validation
        if (email === "user@example.com" && password === "password") {
          const user: User = {
            id: "1",
            name: "Demo User",
            email: "user@example.com",
            stats: {
              completed: 5,
              averageScore: 78,
              bestCategory: "Science",
            },
          }
          setUser(user)
          localStorage.setItem("user", JSON.stringify(user))
          resolve()
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  }

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call
    // For demo purposes, we'll simulate a successful registration
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: "1",
          name,
          email,
          stats: {
            completed: 0,
            averageScore: 0,
            bestCategory: "N/A",
          },
        }
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        resolve()
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

