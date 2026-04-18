"use client"

import { getBadges, createBadge, updateBadge } from "@/api/engagement"
import PageContainer from "@/components/layout/page-container"
import { Badge as BadgeComponent } from "@/components/ui/badge"
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
import { Badge } from "@/types/IEngagement"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, RefreshCcw, Edit2 } from "lucide-react"

export default function BadgesPage() {
  const { data: session } = useSession()
  const token = session?.user?.token as string | undefined

  const [loading, setLoading] = useState(true)
  const [badges, setBadges] = useState<Badge[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    iconUrl: "",
    isActive: true,
  })

  const loadBadges = async (isRefresh = false) => {
    if (!token) return
    if (!isRefresh) setLoading(true)

    try {
      const response = await getBadges(token)
      setBadges(response.badges || [])
    } catch (error) {
      toast.error((error as Error).message || "Failed to load badges")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBadges()
  }, [token])

  const onOpenDialog = (badge?: Badge) => {
    if (badge) {
      setEditingId(badge.id)
      setFormData({
        code: badge.code,
        name: badge.name,
        description: badge.description || "",
        iconUrl: badge.iconUrl || "",
        isActive: badge.isActive,
      })
    } else {
      setEditingId(null)
      setFormData({
        code: "",
        name: "",
        description: "",
        iconUrl: "",
        isActive: true,
      })
    }
    setDialogOpen(true)
  }

  const onSaveBadge = async () => {
    if (!token) return

    if (!formData.code.trim()) {
      toast.error("Badge code is required")
      return
    }

    if (!formData.name.trim()) {
      toast.error("Badge name is required")
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        const updated = await updateBadge(
          editingId,
          {
            code: formData.code.trim(),
            name: formData.name.trim(),
            description: formData.description || undefined,
            iconUrl: formData.iconUrl || undefined,
            isActive: formData.isActive,
          },
          token
        )
        setBadges(badges.map((b) => (b.id === editingId ? updated : b)))
        toast.success("Badge updated successfully")
      } else {
        const created = await createBadge(
          {
            code: formData.code.trim(),
            name: formData.name.trim(),
            description: formData.description || undefined,
            iconUrl: formData.iconUrl || undefined,
            isActive: formData.isActive,
          },
          token
        )
        setBadges([...badges, created])
        toast.success("Badge created successfully")
      }
      setDialogOpen(false)
    } catch (error) {
      toast.error((error as Error).message || "Failed to save badge")
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4 max-w-7xl w-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Badges</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage badges awarded to users for achievements.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => loadBadges(true)}
              disabled={loading || !token}
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => onOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Badge
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Badge" : "Create New Badge"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingId ? "Update badge details" : "Add a new badge"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="badge-code">Badge Code</Label>
                    <Input
                      id="badge-code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g., streak_7"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="badge-name">Badge Name</Label>
                    <Input
                      id="badge-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., 7-Day Streak"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="badge-desc">Description</Label>
                    <Textarea
                      id="badge-desc"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional description"
                      className="mt-1 h-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="badge-icon">Icon URL</Label>
                    <Input
                      id="badge-icon"
                      value={formData.iconUrl}
                      onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                      placeholder="https://example.com/icon.png"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="badge-active"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border"
                    />
                    <Label htmlFor="badge-active">Active</Label>
                  </div>

                  <Button onClick={onSaveBadge} disabled={saving} className="w-full">
                    {saving ? "Saving..." : editingId ? "Update Badge" : "Create Badge"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Badges Table */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : badges.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">No badges found</p>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {badges.map((badge) => (
                      <TableRow key={badge.id}>
                        <TableCell className="font-medium font-mono text-sm">
                          {badge.code}
                        </TableCell>
                        <TableCell>{badge.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {badge.description || "-"}
                        </TableCell>
                        <TableCell>
                          <BadgeComponent
                            variant={badge.isActive ? "default" : "secondary"}
                          >
                            {badge.isActive ? "Active" : "Inactive"}
                          </BadgeComponent>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenDialog(badge)}
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
