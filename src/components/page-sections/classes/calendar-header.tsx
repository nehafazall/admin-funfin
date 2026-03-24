"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Menu,
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMainCourse } from "@/hooks/useMaincourse";
import { useCourse } from "@/hooks/useCourse";
import { useState } from "react";
import { useCalander } from "@/hooks/useCalander";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarHeaderProps {
  currentDate: Date;
  onNavigate: (direction: "prev" | "next") => void;
  onToday: () => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  setSelectedMainCourse: (value: string) => void;
}

export function CalendarHeader({
  currentDate,
  onNavigate,
  onToday,
  setSelectedMainCourse,
  onMenuClick,
  showMenuButton,
}: CalendarHeaderProps) {
  const [selectedMainCourse, setSelectedMainCourse1] = useState<string | null>(
    null
  );
  const isMobile = useIsMobile();
  const { courses } = useMainCourse();
  const { courses: subCourses } = useCourse();
  const { setSelectedCourse, selectedCourse } = useCalander();
  return (
    <header className="flex md:flex-row flex-col md:items-center md:gap-0 gap-2 justify-between px-4 lg:px-6 py-4 border-b border-border rounded-t-md bg-card">
      <div className="flex items-center gap-2 lg:gap-4">
        {showMenuButton && (
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-4 w-4" />
          </Button>
        )}

        <div className="md:flex hidden items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              {format(currentDate, "dd")}
            </span>
          </div>
          <h1 className="text-lg lg:text-xl font-semibold text-foreground">
            Calendar
          </h1>
        </div>

        <Button
          variant="outline"
          onClick={onToday}
          className="text-sm bg-transparent"
        >
          Today
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onNavigate("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onNavigate("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-base lg:text-lg font-medium text-foreground">
          {format(currentDate, "MMMM yyyy")}
        </h2>
      </div>

      <div className="flex items-center gap-1 lg:gap-2">
        <Select
          onValueChange={(value) => {
            setSelectedMainCourse(value);
            setSelectedMainCourse1(value);
          }}
        >
          <SelectTrigger className="bg-accent/60">
            <SelectValue
              className="bg-accent/60"
              placeholder={isMobile ? "Select Main Course" : "main"}
            />
          </SelectTrigger>
          <SelectContent>
            {courses&& courses.length>0&&courses.map((course) => (
              <SelectItem key={course?._id} value={course?._id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            setSelectedCourse(value);
          }}
        >
          <SelectTrigger className="bg-accent/60">
            <SelectValue
              className="bg-accent/60"
              placeholder={isMobile ? "Select Course" : "course"}
            />
          </SelectTrigger>
          <SelectContent>
            {subCourses&& courses&& courses.length>0&&subCourses.length>0&&subCourses
              .filter((course) => course.mainCourseId?._id === selectedMainCourse)
              .map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
