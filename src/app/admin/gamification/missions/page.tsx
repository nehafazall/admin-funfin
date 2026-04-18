"use client"

import { getMissions, createMission, updateMission } from "@/api/engagement"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Mission, MissionType } from "@/types/IEngagement"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, RefreshCcw, Edit2 } from "lucide-react"

export default function MissionsPage() {
  const { data: session } = useSession()
  const token = session?.user?.token as string | undefined

  const [loading, setLoading] = useState(true)
  const [missions, setMissions] = useState<Mission[]>([])
  const [selectedType, setSelectedType] = useState<"all" | MissionType>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    missionType: "daily" as MissionType,
    rewardCoins: "",
    targetCount: "",
    isActive: true,
  })

  const loadMissions = async (isRefresh = false) => {
    if (!token) return
    if (!isRefresh) setLoading(true)

    try {
      const params = selectedType !== "all" ? { missionType: selectedType } : undefined
      const response = await getMissions(token, params)
      setMissions(response.missions || [])
    } catch (error) {
      toast.error((error as Error).message || "Failed to load missions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMissions()
  }, [token, selectedType])

  const onOpenDialog = (mission?: Mission) => {
    if (mission) {
      setEditingId(mission.id)
      setFormData({
        code: mission.code,
        title: mission.title,
        description: mission.description || "",
        missionType: mission.missionType,
        rewardCoins: String(mission.rewardCoins),
        targetCount: String(mission.targetCount),
        isActive: mission.isActive,
      })
    } else {
      setEditingId(null)
      setFormData({
        code: "",
        title: "",
        description: "",
        missionType: "daily",
        rewardCoins: "",
        targetCount: "",
        isActive: true,
      })
    }
    setDialogOpen(true)
  }

  const onSaveMission = async () => {
    if (!token) return

    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    const missionCode = formData.code.trim()
    if (!missionCode) {
      toast.error("Mission code is required")
      return
    }

    if (formData.description.trim().length < 2) {
      toast.error("Description must be at least 2 characters")
      return
    }

    const coins = Number(formData.rewardCoins)
    const target = Number(formData.targetCount)

    if (!Number.isFinite(coins) || coins <= 0) {
      toast.error("Reward coins must be a positive number")
      return
    }

    if (!Number.isFinite(target) || target <= 0) {
      toast.error("Target count must be a positive number")
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        const updated = await updateMission(
          editingId,
          {
            title: formData.title.trim(),
            description: formData.description.trim(),
            missionType: formData.missionType,
            rewardCoins: coins,
            targetCount: target,
            isActive: formData.isActive,
          },
          token
        )
        setMissions(missions.map((m) => (m.id === editingId ? updated : m)))
        toast.success("Mission updated successfully")
      } else {
        const created = await createMission(
          {
            code: missionCode,
            title: formData.title.trim(),
            description: formData.description.trim(),
            missionType: formData.missionType,
            rewardCoins: coins,
            targetCount: target,
            isActive: formData.isActive,
          },
          token
        )
        setMissions([...missions, created])
        toast.success("Mission created successfully")
      }
      setDialogOpen(false)
    } catch (error) {
      toast.error((error as Error).message || "Failed to save mission")
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4 max-w-7xl w-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Missions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage daily, weekly, and special missions.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => loadMissions(true)}
              disabled={loading || !token}
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => onOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Mission
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Mission" : "Create New Mission"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingId ? "Update mission details" : "Add a new mission"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mission-code">Mission Code</Label>
                    <Input
                      id="mission-code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g., daily_trade_5"
                      className="mt-1"
                      disabled={!!editingId}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mission-title">Title</Label>
                    <Input
                      id="mission-title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Complete 5 trades"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mission-desc">Description</Label>
                    <Textarea
                      id="mission-desc"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what the user needs to do"
                      className="mt-1 h-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mission-type">Mission Type</Label>
                    <Select
                      value={formData.missionType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, missionType: value as MissionType })
                      }
                    >
                      <SelectTrigger id="mission-type" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="mission-coins">Reward Coins</Label>
                      <Input
                        id="mission-coins"
                        type="number"
                        min="1"
                        value={formData.rewardCoins}
                        onChange={(e) => setFormData({ ...formData, rewardCoins: e.target.value })}
                        placeholder="100"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mission-target">Target Count</Label>
                      <Input
                        id="mission-target"
                        type="number"
                        min="1"
                        value={formData.targetCount}
                        onChange={(e) =>
                          setFormData({ ...formData, targetCount: e.target.value })
                        }
                        placeholder="5"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="mission-active"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border"
                    />
                    <Label htmlFor="mission-active">Active</Label>
                  </div>

                  <Button onClick={onSaveMission} disabled={saving} className="w-full">
                    {saving ? "Saving..." : editingId ? "Update Mission" : "Create Mission"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Filter */}
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="special">Special</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Missions Table */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : missions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">No missions found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missions.map((mission) => (
                      <TableRow key={mission.id}>
                        <TableCell className="font-mono text-sm">{mission.code}</TableCell>
                        <TableCell className="font-medium">{mission.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {mission.missionType}
                          </Badge>
                        </TableCell>
                        <TableCell>{mission.rewardCoins} coins</TableCell>
                        <TableCell>{mission.targetCount}</TableCell>
                        <TableCell>
                          <Badge variant={mission.isActive ? "default" : "secondary"}>
                            {mission.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenDialog(mission)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
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
