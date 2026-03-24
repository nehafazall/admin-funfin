"use client";

import { format, addDays, isSameDay, isToday, parse, isSameHour } from "date-fns";
import { cn } from "@/lib/utils";
import type { Task } from "./calendar-app";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSwipe } from "@/hooks/use-swipe";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IBookingGroupedByDateTime } from "@/types/IBooking";
import { useState } from "react";

interface WeekViewProps {
  weekStart: Date;

  onTimeSlotClick: (
    data: {
      _id: string;
      name: string;
      code: string;
      isActive: boolean;
      limit: number;
      email: string;
      courseName: string;
      isDeleted: boolean;
    }[],
    day: Date,
    time: string
  ) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  isMobile?: boolean;
  onTaskClick: (task: Task) => void;
  bookings: IBookingGroupedByDateTime;
}

const timeSlots = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function WeekView({
  weekStart,

  onTimeSlotClick,

  onSwipeLeft,
  onSwipeRight,
  isMobile,
  onTaskClick,
  bookings,
}: WeekViewProps) {
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  // const swipeRef = useSwipe({
  //   onSwipeLeft: onSwipeLeft,
  //   onSwipeRight: onSwipeRight,
  // });

  const handleDayClick = (day: Date) => {

    if(isSameDay(selectedDay,day)) {
    
      setSelectedDay(null); 
      return;
    }
 
    setSelectedDay(day);
  };
  const handleTimeClick = (time: string) => {
    
    if(time===selectedTime) {
      setSelectedTime(null);
      return;
    }
    setSelectedTime(time);
  };

  // const getTasksForDateAndTime = (date: Date, time: string) => {
  //   // Parse the time into a Date object
  //   const parsedTime = parse(time, "h a", new Date()); // handles "11 AM", "7 PM"

  //   // Format it consistently
  //   const formattedTime = format(parsedTime, "hh:mm a");

  //   const tasks = bookings[`${format(date, "yyyy-MM-dd")}/${formattedTime}`];
  //   // chat gpt this is my requast here only taking the exact time but i want in that hour how many booking , those whole bookings i need to get 
  //   return tasks;
  // };

  const getTasksForDateAndTime = (date: Date, time: string) => {
    // Parse the starting time of the hour
    const startOfHour = parse(time, "h a", date);
    const endOfHour = addDays(startOfHour, 0); // same day
    endOfHour.setMinutes(59, 59, 999); // end of that hour
  
    // Get all bookings for the selected date
    const allDateKeys = Object.keys(bookings).filter((key) =>
      key.startsWith(format(date, "yyyy-MM-dd"))
    );
  
    // Collect all bookings within this hour range
    const allBookingsInHour: any[] = [];
  
    for (const key of allDateKeys) {
      const [_, timePart] = key.split("/");
      if (!timePart) continue;
  
      const bookingTime = parse(timePart, "hh:mm a", date);
  
      if (bookingTime >= startOfHour && bookingTime <= endOfHour) {
        allBookingsInHour.push(...(bookings[key] || []));
      }
    }
  
    return allBookingsInHour.length > 0 ? allBookingsInHour : null;
  };

  return (
    <div className="flex-1 overflow-auto" >
      <ScrollArea className="md:w-[70vw] xl:w-[80vw] lg:w-[75vw] w-screen">
        <ScrollBar orientation="horizontal" />
        <div className="md:w-full border-x  w-[150vw]">
          {/* Header with days */}
          <div className="sticky z-[1] top-0 bg-background border-b border-border">
            <div className={cn("grid gap-0", "grid-cols-8")}>
              <div className="p-2 lg:p-4 text-xs text-muted-foreground border-r border-border"></div>

              {weekDays.slice(0, 7).map((day, index) => (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={cn("p-2 lg:p-4 cursor-pointer text-center border-r border-border last:border-r-0",
                    isToday(day) ? "bg-primary/20 " : "",
                   isSameDay(selectedDay,day) ? "bg-foreground/5 " : ""
                  )}
                >
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {dayNames[index]}
                  </div>
                  <div
                    className={cn(
                      "text-lg lg:text-2xl font-medium",
                      isToday(day)
                        ? "bg-primary text-primary-foreground rounded-full  lg:w-8 lg:h-8 flex items-center justify-center mx-auto text-sm lg:text-2xl"
                        : "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                 
                </div>
              ))}
            </div>
          </div>

          {/* Time slots grid */}
          <div className={cn("grid gap-0", "grid-cols-8")}>
            {timeSlots.map((time) => (
              <div onClick={() => handleTimeClick(time)} key={time} className="contents">
                <div  className={cn("p-2 text-xs text-muted-foreground border-r border-b border-border text-right pr-4 cursor-pointer",
                 time===selectedTime ? "bg-foreground/5 " : ""
                )}>
                  {time}
                </div>

                {/* Day columns */}
                {weekDays.slice(0, 7).map((day) => {
                  const dayTasks = {
                    data: getTasksForDateAndTime(day, time) || null,
                  };

                  return (
                    <div
                      key={`${day.toISOString()}-${time}`}
                      className={cn(
                        "border-r border-b border-border last:border-r-0 p-1 hover:bg-muted/50 cursor-pointer relative",
                        "min-h-[60px]",
                        isToday(day) ? "bg-primary/20 " : "",
                         isSameDay(selectedDay,day) ? "bg-foreground/5 " : "",
                          time===selectedTime ? "bg-foreground/5 " : ""
                      )}
                      onClick={e=>e.stopPropagation()}
                    >
                      {dayTasks.data &&
                        Object.values(
                          dayTasks.data.reduce((acc, curr) => {
                            acc[curr.courseName] = curr; // ✅ dedupe by courseName
                            return acc;
                          }, {} as Record<string, (typeof dayTasks.data)[number]>)
                        ).map((booking:any, idx) => {
                          // Parse the slot time into a full Date for comparison
                          const bookingDateTime = parse(time, "h a", day);
                       
                          const totalBookings = dayTasks.data.filter((b) => b.courseName === booking.courseName).length;
                          const isPast = bookingDateTime < new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));

                          return (
                            <div
                              key={`${time}-${idx}`}
                              className={cn(
                                "text-xs p-1 lg:p-2 rounded mb-1 text-white relative group cursor-pointer",
                                isPast ? "bg-red-500" : "bg-blue-500"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTimeSlotClick(dayTasks.data.filter((b) => b.courseName === booking.courseName), day, time);
                                onTaskClick(booking as any);
                              }}
                            >
                              <div className="font-medium truncate">
                                {booking.courseName}
                              </div>

                              <div className="opacity-90">{booking.time}</div>
                              <div className="opacity-90">{`${totalBookings} bookings`}</div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
