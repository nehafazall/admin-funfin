"use client"

import {
  getChallenges,
  createChallenge,
  updateChallenge,
  assignChallengeToday,
} from "@/api/engagement"
import PageContainer from "@/components/layout/page-container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DailyChallenge } from "@/types/IEngagement"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, RefreshCcw, Edit2, Clock } from "lucide-react"

export default function ChallengesPage() {
  const { data: session } = useSession()
  const token = session?.user?.token as string | undefined

  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState<DailyChallenge[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [assigningId, setAssigningId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [challengeDate, setChallengeDate] = useState("")

  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctOptionIndex: "0",
    explanation: "",
    rewardCoins: "",
    isActive: true,
  })

  const loadChallenges = async (isRefresh = false) => {
    if (!token) return
    if (!isRefresh) setLoading(true)

    try {
      const response = await getChallenges(token)
      setChallenges(response.challenges || response.items || [])
    } catch (error) {
      toast.error((error as Error).message || "Failed to load challenges")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChallenges()
  }, [token])

  const onOpenDialog = (challenge?: DailyChallenge) => {
    if (challenge) {
      setEditingId(challenge.id)
      setFormData({
        question: challenge.question,
        option1: challenge.options[0] || "",
        option2: challenge.options[1] || "",
        option3: challenge.options[2] || "",
        option4: challenge.options[3] || "",
        correctOptionIndex: String(challenge.correctOptionIndex),
        explanation: challenge.explanation || "",
        rewardCoins: String(challenge.rewardCoins),
        isActive: challenge.isActive,
      })
    } else {
      setEditingId(null)
      setFormData({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctOptionIndex: "0",
        explanation: "",
        rewardCoins: "",
        isActive: true,
      })
    }
    setDialogOpen(true)
  }

  const onSaveChallenge = async () => {
    if (!token) return

    if (!formData.question.trim()) {
      toast.error("Question is required")
      return
    }

    const options = [formData.option1, formData.option2, formData.option3, formData.option4]
    if (options.some((opt) => !opt.trim())) {
      toast.error("All 4 options are required")
      return
    }

    const correctIdx = Number(formData.correctOptionIndex)
    if (!Number.isFinite(correctIdx) || correctIdx < 0 || correctIdx > 3) {
      toast.error("Valid correct option index required")
      return
    }

    const coins = Number(formData.rewardCoins)
    if (!Number.isFinite(coins) || coins <= 0) {
      toast.error("Reward coins must be a positive number")
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        const updated = await updateChallenge(
          editingId,
          {
            question: formData.question.trim(),
            options: options.map((opt) => opt.trim()),
            correctOptionIndex: correctIdx,
            explanation: formData.explanation || undefined,
            rewardCoins: coins,
            isActive: formData.isActive,
          },
          token
        )
        setChallenges(challenges.map((c) => (c.id === editingId ? updated : c)))
        toast.success("Challenge updated successfully")
      } else {
        const created = await createChallenge(
          {
            question: formData.question.trim(),
            options: options.map((opt) => opt.trim()),
            correctOptionIndex: correctIdx,
            explanation: formData.explanation || undefined,
            rewardCoins: coins,
            isActive: formData.isActive,
          },
          token
        )
        setChallenges([...challenges, created])
        toast.success("Challenge created successfully")
      }
      setDialogOpen(false)
    } catch (error) {
      toast.error((error as Error).message || "Failed to save challenge")
    } finally {
      setSaving(false)
    }
  }

  const onAssignChallenge = async () => {
    if (!token || !assigningId) return

    setSaving(true)
    try {
      await assignChallengeToday(assigningId, token, challengeDate || undefined)
      toast.success("Challenge assigned successfully")
      setAssignDialogOpen(false)
      setChallengeDate("")
      setAssigningId(null)
      await loadChallenges(true)
    } catch (error) {
      toast.error((error as Error).message || "Failed to assign challenge")
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4 max-w-7xl w-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Daily Challenges</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage daily challenge questions and assign them to specific dates.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => loadChallenges(true)}
              disabled={loading || !token}
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => onOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Challenge
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Challenge" : "Create New Challenge"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingId ? "Update challenge details" : "Create a new daily challenge"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="challenge-question">Question</Label>
                    <Textarea
                      id="challenge-question"
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      placeholder="Enter the challenge question"
                      className="mt-1 h-20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Answer Options</Label>
                    {[1, 2, 3, 4].map((idx) => (
                      <div key={idx}>
                        <div className="flex gap-2 items-end">
                          <Input
                            value={
                              formData[`option${idx}` as "option1" | "option2" | "option3" | "option4"]
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [`option${idx}`]: e.target.value,
                              } as any)
                            }
                            placeholder={`Option ${idx}`}
                          />
                          <label className="flex items-center gap-2 pb-2">
                            <input
                              type="radio"
                              name="correct"
                              value={idx - 1}
                              checked={formData.correctOptionIndex === String(idx - 1)}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  correctOptionIndex: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">Correct</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="challenge-explanation">Explanation</Label>
                    <Textarea
                      id="challenge-explanation"
                      value={formData.explanation}
                      onChange={(e) =>
                        setFormData({ ...formData, explanation: e.target.value })
                      }
                      placeholder="Optional explanation for the correct answer"
                      className="mt-1 h-16"
                    />
                  </div>

                  <div>
                    <Label htmlFor="challenge-coins">Reward Coins</Label>
                    <Input
                      id="challenge-coins"
                      type="number"
                      min="1"
                      value={formData.rewardCoins}
                      onChange={(e) =>
                        setFormData({ ...formData, rewardCoins: e.target.value })
                      }
                      placeholder="50"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="challenge-active"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="rounded border"
                    />
                    <Label htmlFor="challenge-active">Active</Label>
                  </div>

                  <Button onClick={onSaveChallenge} disabled={saving} className="w-full">
                    {saving ? "Saving..." : editingId ? "Update Challenge" : "Create Challenge"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Challenges Table */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : challenges.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">No challenges found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="max-w-xs">Question</TableHead>
                      <TableHead>Options</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {challenges.map((challenge) => (
                      <TableRow key={challenge.id}>
                        <TableCell className="max-w-xs truncate font-medium">
                          {challenge.question}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {challenge.options.length} options
                        </TableCell>
                        <TableCell>{challenge.rewardCoins} coins</TableCell>
                        <TableCell>
                          <Badge variant={challenge.isActive ? "default" : "secondary"}>
                            {challenge.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onOpenDialog(challenge)}
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Dialog
                              open={
                                assignDialogOpen && assigningId === challenge.id
                              }
                              onOpenChange={(open) => {
                                setAssignDialogOpen(open)
                                if (!open) {
                                  setAssigningId(null)
                                  setChallengeDate("")
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setAssigningId(challenge.id)
                                    setAssignDialogOpen(true)
                                  }}
                                  title="Assign to date"
                                >
                                  <Clock className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Assign Challenge to Date</DialogTitle>
                                  <DialogDescription>
                                    Optionally specify a date. Leave empty for today.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="assign-date">Date (YYYY-MM-DD)</Label>
                                    <Input
                                      id="assign-date"
                                      type="date"
                                      value={challengeDate}
                                      onChange={(e) => setChallengeDate(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <Button
                                    onClick={onAssignChallenge}
                                    disabled={saving}
                                    className="w-full"
                                  >
                                    {saving ? "Assigning..." : "Assign Challenge"}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  )
}
