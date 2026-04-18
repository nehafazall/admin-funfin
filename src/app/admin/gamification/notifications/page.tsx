"use client"

import { createAdminNotification } from "@/api/engagement"
import PageContainer from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"
import { Send, Users } from "lucide-react"

export default function NotificationsPage() {
  const { data: session } = useSession()
  const token = session?.user?.token as string | undefined

  const [sending, setSending] = useState(false)
  const [recipientType, setRecipientType] = useState<"all" | "user">("all")
  const [userId, setUserId] = useState("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const onSendNotification = async () => {
    if (!token) return

    if (!title.trim()) {
      toast.error("Notification title is required")
      return
    }

    if (!body.trim()) {
      toast.error("Notification body is required")
      return
    }

    if (recipientType === "user" && !userId.trim()) {
      toast.error("User ID is required for single user notification")
      return
    }

    setSending(true)
    try {
      await createAdminNotification(
        {
          title: title.trim(),
          body: body.trim(),
          userId: recipientType === "user" ? userId.trim() : undefined,
        },
        token
      )

      toast.success(
        recipientType === "all"
          ? "Broadcast notification sent to all users"
          : `Notification sent to user ${userId}`
      )

      // Reset form
      setTitle("")
      setBody("")
      setUserId("")
      setRecipientType("all")
    } catch (error) {
      toast.error((error as Error).message || "Failed to send notification")
    } finally {
      setSending(false)
    }
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4 max-w-2xl w-full">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Send notifications to users or broadcast to all users.
          </p>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Create Notification
            </CardTitle>
            <CardDescription>
              Send a notification to specific user or broadcast to all
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Recipient Type Selection */}
              <div>
                <Label htmlFor="recipient-type">Recipient Type</Label>
                <Select
                  value={recipientType}
                  onValueChange={(value) => {
                    setRecipientType(value as "all" | "user")
                    if (value === "all") {
                      setUserId("")
                    }
                  }}
                >
                  <SelectTrigger id="recipient-type" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Broadcast to All Users
                      </span>
                    </SelectItem>
                    <SelectItem value="user">Send to Specific User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User ID Input (shown only for single user) */}
              {recipientType === "user" && (
                <div>
                  <Label htmlFor="user-id">User ID</Label>
                  <Input
                    id="user-id"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter recipient user ID"
                    className="mt-2"
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <Label htmlFor="notify-title">Notification Title</Label>
                <Input
                  id="notify-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., New Mission Available"
                  className="mt-2"
                />
              </div>

              {/* Body */}
              <div>
                <Label htmlFor="notify-body">Notification Body</Label>
                <Textarea
                  id="notify-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="e.g., Complete the trading challenge to earn extra coins"
                  className="mt-2 h-32"
                />
              </div>

              {/* Send Button */}
              <Button
                onClick={onSendNotification}
                disabled={sending || !token}
                size="lg"
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                {sending
                  ? "Sending..."
                  : recipientType === "all"
                    ? "Broadcast Notification"
                    : "Send Notification"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-base">Notification Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Keep notification titles concise and action-oriented</p>
            <p>• Use clear, user-friendly language in the body</p>
            <p>• Avoid overly frequent notifications to prevent user fatigue</p>
            <p>• Broadcast notifications are sent to all active users</p>
            <p>• Single user notifications require a valid user ID</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
