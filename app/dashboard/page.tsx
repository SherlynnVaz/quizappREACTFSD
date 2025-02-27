"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
            <CardDescription>View your quiz performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Quizzes Completed:</span>
                <span className="font-medium">{user?.stats?.completed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Score:</span>
                <span className="font-medium">{user?.stats?.averageScore || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>Best Category:</span>
                <span className="font-medium">{user?.stats?.bestCategory || "N/A"}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/profile" className="w-full">
              <Button variant="outline" className="w-full">
                View Detailed Stats
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Start a New Quiz</CardTitle>
            <CardDescription>Choose from various categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Challenge yourself with our curated quizzes across different topics.</p>
          </CardContent>
          <CardFooter>
            <Link href="/quizzes" className="w-full">
              <Button className="w-full">Browse Quizzes</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>See how you rank against others</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Compare your performance with other quiz takers.</p>
          </CardContent>
          <CardFooter>
            <Link href="/leaderboard" className="w-full">
              <Button variant="outline" className="w-full">
                View Leaderboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

