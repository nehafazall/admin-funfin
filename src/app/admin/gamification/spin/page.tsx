"use client"

import { getSpinConfig, updateSpinConfig } from "@/api/engagement"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SpinConfig, SpinRewardTier } from "@/types/IEngagement"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Trash2, Plus, RefreshCcw } from "lucide-react"

export default function SpinConfigPage() {
  const { data: session } = useSession()
  const token = session?.user?.token as string | undefined

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [spinConfig, setSpinConfig] = useState<SpinConfig | null>(null)
  const [dailyLimit, setDailyLimit] = useState("5")
  const [rewardTiers, setRewardTiers] = useState<SpinRewardTier[]>([])
  const [newTier, setNewTier] = useState({
    coins: "",
    weight: "",
    isActive: true,
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadConfig = async (isRefresh = false) => {
    if (!token) return
    if (!isRefresh) setLoading(true)

    try {
      const config = await getSpinConfig(token)
      setSpinConfig(config)
      setDailyLimit(String(config.dailyLimit))
      setRewardTiers(config.rewardTiers || [])
    } catch (error) {
      toast.error((error as Error).message || "Failed to load spin config")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [token])

  const onSaveConfig = async () => {
    if (!token) return

    const limit = Number(dailyLimit)
    if (!Number.isFinite(limit) || limit <= 0) {
      toast.error("Daily limit must be a positive number")
      return
    }

    if (rewardTiers.length === 0) {
      toast.error("Add at least one reward tier")
      return
    }

    // Validate tiers
    for (const tier of rewardTiers) {
      if (!Number.isFinite(tier.coins) || tier.coins <= 0) {
        toast.error("Coins must be positive numbers")
        return
      }
      if (!Number.isFinite(tier.weight) || tier.weight <= 0) {
        toast.error("Weight must be positive numbers")
        return
      }
    }

    setSaving(true)
    try {
      const result = await updateSpinConfig(
        {
          dailyLimit: limit,
          rewardTiers,
        },
        token
      )
      setSpinConfig(result)
      toast.success("Spin config updated successfully")
    } catch (error) {
      toast.error((error as Error).message || "Failed to update config")
    } finally {
      setSaving(false)
    }
  }

  const onAddTier = () => {
    const coins = Number(newTier.coins)
    const weight = Number(newTier.weight)

    if (!Number.isFinite(coins) || coins <= 0) {
      toast.error("Coins must be a positive number")
      return
    }

    if (!Number.isFinite(weight) || weight <= 0) {
      toast.error("Weight must be a positive number")
      return
    }

    setRewardTiers([
      ...rewardTiers,
      {
        coins,
        weight,
        isActive: newTier.isActive,
      },
    ])

    setNewTier({ coins: "", weight: "", isActive: true })
    setDialogOpen(false)
    toast.success("Reward tier added")
  }

  const onRemoveTier = (index: number) => {
    setRewardTiers(rewardTiers.filter((_, i) => i !== index))
    toast.success("Reward tier removed")
  }

  const toggleTierActive = (index: number) => {
    const updated = [...rewardTiers]
    updated[index].isActive = !updated[index].isActive
    setRewardTiers(updated)
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4 max-w-6xl w-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Spin Configuration</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage daily spin limits and reward tier distribution.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => loadConfig(true)}
            disabled={loading || !token}
            className="shrink-0"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Separator />

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Daily Limit Section */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Limit</CardTitle>
                <CardDescription>
                  Number of spins users can perform per day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label htmlFor="daily-limit">Daily Spin Limit</Label>
                    <Input
                      id="daily-limit"
                      type="number"
                      min="1"
                      value={dailyLimit}
                      onChange={(e) => setDailyLimit(e.target.value)}
                      placeholder="5"
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reward Tiers Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Reward Tiers</CardTitle>
                  <CardDescription>
                    Configure coins and weight for each tier
                  </CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Tier
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Reward Tier</DialogTitle>
                      <DialogDescription>
                        Define coins, weight, and active status
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tier-coins">Coins</Label>
                        <Input
                          id="tier-coins"
                          type="number"
                          min="1"
                          value={newTier.coins}
                          onChange={(e) => setNewTier({ ...newTier, coins: e.target.value })}
                          placeholder="100"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tier-weight">Weight (Distribution)</Label>
                        <Input
                          id="tier-weight"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={newTier.weight}
                          onChange={(e) => setNewTier({ ...newTier, weight: e.target.value })}
                          placeholder="1.5"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="tier-active"
                          type="checkbox"
                          checked={newTier.isActive}
                          onChange={(e) => setNewTier({ ...newTier, isActive: e.target.checked })}
                          className="rounded border"
                        />
                        <Label htmlFor="tier-active">Active</Label>
                      </div>
                      <Button onClick={onAddTier} className="w-full">
                        Add Tier
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {rewardTiers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reward tiers configured yet</p>
                ) : (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Coins</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rewardTiers.map((tier, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{tier.coins}</TableCell>
                            <TableCell>{tier.weight.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={tier.isActive ? "default" : "secondary"}
                                className="cursor-pointer"
                                onClick={() => toggleTierActive(index)}
                              >
                                {tier.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveTier(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-2">
              <Button
                onClick={onSaveConfig}
                disabled={saving || !token}
                className="px-8"
              >
                {saving ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  )
}
