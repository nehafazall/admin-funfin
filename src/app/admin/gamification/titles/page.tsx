"use client"

import { getTitles, createTitle, updateTitle } from "@/api/engagement"
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
import { Title } from "@/types/IEngagement"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, RefreshCcw, Edit2 } from "lucide-react"

export default function TitlesPage() {
  const { data: session } = useSession()
  const token = session?.user?.token as string | undefined

  const [loading, setLoading] = useState(true)
  const [titles, setTitles] = useState<Title[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    isActive: true,
  })

  const loadTitles = async (isRefresh = false) => {
    if (!token) return
    if (!isRefresh) setLoading(true)

    try {
      const response = await getTitles(token)
      setTitles(response.titles || [])
    } catch (error) {
      toast.error((error as Error).message || "Failed to load titles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTitles()
  }, [token])

  const onOpenDialog = (title?: Title) => {
    if (title) {
      setEditingId(title.id)
      setFormData({
        code: title.code,
        name: title.name,
        description: title.description || "",
        isActive: title.isActive,
      })
    } else {
      setEditingId(null)
      setFormData({
        code: "",
        name: "",
        description: "",
        isActive: true,
      })
    }
    setDialogOpen(true)
  }

  const onSaveTitle = async () => {
    if (!token) return

    if (!formData.code.trim()) {
      toast.error("Title code is required")
      return
    }

    if (!formData.name.trim()) {
      toast.error("Title name is required")
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        const updated = await updateTitle(
          editingId,
          {
            code: formData.code.trim(),
            name: formData.name.trim(),
            description: formData.description || undefined,
            isActive: formData.isActive,
          },
          token
        )
        setTitles(titles.map((t) => (t.id === editingId ? updated : t)))
        toast.success("Title updated successfully")
      } else {
        const created = await createTitle(
          {
            code: formData.code.trim(),
            name: formData.name.trim(),
            description: formData.description || undefined,
            isActive: formData.isActive,
          },
          token
        )
        setTitles([...titles, created])
        toast.success("Title created successfully")
      }
      setDialogOpen(false)
    } catch (error) {
      toast.error((error as Error).message || "Failed to save title")
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4 max-w-7xl w-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Titles</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage achievement titles awarded to users.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => loadTitles(true)}
              disabled={loading || !token}
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => onOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Title
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Title" : "Create New Title"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingId ? "Update title details" : "Add a new title"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title-code">Title Code</Label>
                    <Input
                      id="title-code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g., consistent_trader"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="title-name">Title Name</Label>
                    <Input
                      id="title-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Consistent Trader"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="title-desc">Description</Label>
                    <Textarea
                      id="title-desc"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional description"
                      className="mt-1 h-20"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="title-active"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border"
                    />
                    <Label htmlFor="title-active">Active</Label>
                  </div>

                  <Button onClick={onSaveTitle} disabled={saving} className="w-full">
                    {saving ? "Saving..." : editingId ? "Update Title" : "Create Title"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Titles Table */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : titles.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">No titles found</p>
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
                    {titles.map((title) => (
                      <TableRow key={title.id}>
                        <TableCell className="font-medium font-mono text-sm">
                          {title.code}
                        </TableCell>
                        <TableCell>{title.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {title.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={title.isActive ? "default" : "secondary"}>
                            {title.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenDialog(title)}
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
