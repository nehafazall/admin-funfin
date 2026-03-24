"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Calendar, Clock, Palette, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "./calendar-app"

interface TaskSidebarProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

const colorOptions = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Pink", value: "bg-pink-500" },
]

export function TaskSidebar({ isOpen, onClose, task, onUpdateTask, onDeleteTask }: TaskSidebarProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("")
  const [selectedColor, setSelectedColor] = useState("bg-blue-500")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
    
      setTime(task.time)
      setSelectedColor(task.color || "bg-blue-500")
    }
  }, [task])

  const handleSave = () => {
    if (!task) return

    const updatedTask: Task = {
      ...task,
      title,
    
      time,
      color: selectedColor,
    }

    onUpdateTask(updatedTask)
  }

  const handleDelete = () => {
    if (!task) return
    onDeleteTask(task.id)
    onClose()
  }

  if (!isOpen || !task) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border z-50 transform transition-transform duration-300 lg:relative lg:w-80 lg:transform-none">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Task Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
            </div>

            {/* Task Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={4}
              />
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(task.date, "EEEE, MMMM d, yyyy")}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={time.split(" ")[0]}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(":")
                      const hour12 = Number.parseInt(hours) > 12 ? Number.parseInt(hours) - 12 : Number.parseInt(hours)
                      const ampm = Number.parseInt(hours) >= 12 ? "PM" : "AM"
                      setTime(`${hour12 === 0 ? 12 : hour12}:${minutes} ${ampm}`)
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 border-transparent",
                        color.value,
                        selectedColor === color.value && "border-foreground",
                      )}
                      onClick={() => setSelectedColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
