"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Globe,
  User,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { IBooking } from "@/types/IBooking";
import React from "react";

const TodayBookingList = ({
  bookings,
  BOOKINGS_PER_PAGE = 1,
}: {
  bookings: IBooking[];
  BOOKINGS_PER_PAGE: number;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(bookings.length / BOOKINGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKINGS_PER_PAGE;
  const endIndex = startIndex + BOOKINGS_PER_PAGE;
  const currentBookings = bookings.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    console.log("Current page:", currentPage,totalPages,);
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="flex flex-col gap-1 justify-between h-full w-full">
      {currentBookings.map((booking) => (
        <Card
          key={booking._id}
          className="overflow-hidden  bg-background/50 hover:shadow-md transition-shadow"
        >
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              {/* Course Image */}

              {/* Booking Details */}
              <div className="flex-1 p-2">
                <div className="space-y-2 flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    {/* Course Name */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm capitalize font-semibold text-foreground">
                          {booking.courseId.name}
                        </h3>
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {booking.studentId.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {booking.studentId.email}
                        </span>
                      </div>
                    </div>

                    {/* Section Details */}
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.section.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.section.language}</span>
                      </div>
                    </div>

                    {/* Booking Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Booked: {formatDate(booking.bookingDate)}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {booking.studentCode}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative w-20 h-20 rounded-md overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${booking.courseId.image}`}
                      alt={booking.courseId.name}
                      className="object-cover md:block hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Pagination */}
          </CardContent>
        </Card>
      ))}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, bookings.length)} of{" "}
            {bookings.length} bookings
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayBookingList;
