"use client"

import PageContainer from "@/components/layout/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Zap,
  Target,
  HelpCircle,
  Trophy,
  Sparkles,
  Bell,
} from "lucide-react"

export default function GamificationPage() {
  const router = useRouter()

  const sections = [
    {
      icon: Zap,
      title: "Spin Configuration",
      description: "Manage daily spin limits and reward tier distribution",
      href: "/admin/gamification/spin",
    },
    {
      icon: Target,
      title: "Missions",
      description: "Create and manage daily, weekly, and special missions",
      href: "/admin/gamification/missions",
    },
    {
      icon: HelpCircle,
      title: "Challenges",
      description: "Configure daily challenges and assign them to dates",
      href: "/admin/gamification/challenges",
    },
    {
      icon: Trophy,
      title: "Badges",
      description: "Manage achievement badges for user milestones",
      href: "/admin/gamification/badges",
    },
    {
      icon: Sparkles,
      title: "Titles",
      description: "Create and manage achievement titles",
      href: "/admin/gamification/titles",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Send notifications to users or broadcast to all",
      href: "/admin/gamification/notifications",
    },
  ]

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-6 max-w-6xl w-full">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gamification Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user engagement features including spins, missions, challenges, badges, titles, and notifications.
          </p>
        </div>

        <Separator />

        {/* Grid of Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                onClick={() => router.push(section.href)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="rounded-lg p-2 bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(section.href)}
                  >
                    Manage →
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Gamification Features Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Spin Configuration:</strong> Control daily spin limits and define reward tiers with weighted probabilities.
            </p>
            <p>
              <strong>Missions:</strong> Create daily, weekly, and special missions with target counts and coin rewards.
            </p>
            <p>
              <strong>Challenges:</strong> Design multiple-choice daily challenges with explanations and coin rewards.
            </p>
            <p>
              <strong>Badges:</strong> Define achievement badges that users can earn for various milestones.
            </p>
            <p>
              <strong>Titles:</strong> Create special titles awarded to users for significant achievements.
            </p>
            <p>
              <strong>Notifications:</strong> Send targeted or broadcast notifications to keep users engaged.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
