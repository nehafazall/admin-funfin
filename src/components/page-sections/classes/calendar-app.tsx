"use client";

import { useState } from "react";
import { CalendarHeader } from "./calendar-header";

import { WeekView } from "./week-view";

import { addWeeks, subWeeks, startOfWeek, format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { TaskSidebar } from "./task-sidebar";
import { useCalander } from "@/hooks/useCalander";
import { SheetReuse } from "@/components/global/sheet";
import { useClasses } from "@/hooks/useClasses";

export interface Task {
  id: string;
  title: string;
  time: string;
  date: Date;
  color?: string;
}

export function ClassesCalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { sections } = useClasses();
  const [selectedBooking, setSelectedBooking] = useState<
    | {
        _id: string;
        name: string;
        code: string;
        isActive: boolean;
        limit: number;
        email: string;
        isDeleted: boolean;
        courseName: string;
      }[]
    | []
  >([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const closeSheet = () => setIsTaskDialogOpen(false);
  const openSheet = () => setIsTaskDialogOpen(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskSidebarOpen, setIsTaskSidebarOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    date: Date;
    time: string;
  } | null>(null);

  const isMobile = useIsMobile();
  const { setSelectedMainCourse, bookings } = useCalander();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleTimeSlotClick = (
    data: {
      _id: string;
      name: string;
      code: string;
      isActive: boolean;
      limit: number;
      email: string;
      isDeleted: boolean;
      courseName: string;
    }[],
    day: Date,
    time: string
  ) => {
    setSelectedTimeSlot({ date: day, time: time });
    setIsTaskDialogOpen(true);
    setSelectedBooking(data);
  };

  const handleTaskClick = (task: Task) => {
 
    
  };

  const handleSwipeLeft = () => {
    navigateWeek("next");
  };

  const handleSwipeRight = () => {
    navigateWeek("prev");
  };

  return (
    <div className="flex h-screen bg-background">

      <SheetReuse
        className="w-full md:w-full"
        title={` booking details on ${format(selectedDate, "dd/MM/yyyy")} ${selectedTimeSlot?.time} ${selectedBooking?.length > 0 ? selectedBooking[0]?.courseName : ""} `}
        description="details of bookings"
        open={isTaskDialogOpen}
        closeFn={closeSheet}
      >
        <div className=" mt-4 grid md:grid-cols-2 grid-cols-1 gap-2">
          {selectedBooking.map((booking) => (
            <div className="flex flex-col bg-accent/20 rounded-md p-2 border border-accent/50 gap-2" key={booking._id}>
              <h1>{booking.name}</h1>
              <p>{booking.email}</p>

            </div>
          ))}
        </div>
      </SheetReuse>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <CalendarHeader
          currentDate={currentDate}
          onNavigate={navigateWeek}
          onToday={goToToday}
          setSelectedMainCourse={setSelectedMainCourse}
          showMenuButton={isMobile}
        />

        <WeekView
          weekStart={weekStart}
          bookings={sections}
          onTimeSlotClick={handleTimeSlotClick}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onTaskClick={handleTaskClick}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
