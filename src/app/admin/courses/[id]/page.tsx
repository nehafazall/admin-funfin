"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock,
  Edit,
  Image as ImageIcon,
  LayoutGrid,
  Plus,
  Star,
  Video,
} from "lucide-react";
import { SheetReuse } from "@/components/global/sheet";
import CourseForm from "@/components/forms/courseForm";
import SyllabusForm from "@/components/forms/syllabusForm";
import TopicForm from "@/components/forms/topicForm";
import TopicList from "@/components/table/topic/topicList";
import { useCourseById } from "@/hooks/useCourse";
import { useSyllabus } from "@/hooks/useSyllabus";
import { ICourse } from "@/types/ICourse";
import { ISyllabus } from "@/types/ISyllabus";

// ─── Curriculum Tab ───────────────────────────────────────────────────────────
// Separated into its own component so useSyllabus is always called at the top level.

interface CurriculumProps {
  course: ICourse;
}

const CurriculumSection = ({ course }: CurriculumProps) => {
  const [selectedSyllabus, setSelectedSyllabus] = useState<ISyllabus | null>(null);
  const [createSyllabusOpen, setCreateSyllabusOpen] = useState(false);
  const [createTopicOpen, setCreateTopicOpen] = useState(false);

  const { syllabuses, isPending } = useSyllabus(course.id);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Syllabus list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Modules</h3>
              <p className="text-xs text-muted-foreground">
                {syllabuses.length} syllabus{syllabuses.length !== 1 ? "es" : ""}
              </p>
            </div>
            <Button size="sm" onClick={() => setCreateSyllabusOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Syllabus
            </Button>
          </div>

          {isPending ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : syllabuses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg text-center">
              <BookOpen className="h-7 w-7 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No modules yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add a syllabus module to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {syllabuses.map((s) => (
                <button
                  key={s.id || s._id}
                  type="button"
                  onClick={() => setSelectedSyllabus(s)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                    (selectedSyllabus?.id || selectedSyllabus?._id) === (s.id || s._id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{s.title}</p>
                    {s.moduleLabel && (
                      <p className="text-xs text-muted-foreground mt-1">{s.moduleLabel}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {s.topics.length} {s.topics.length === 1 ? "topic" : "topics"}
                  </Badge>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Topics for selected syllabus */}
        <div className="lg:col-span-3 space-y-3">
          {selectedSyllabus ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{selectedSyllabus.title}</h3>
                  {selectedSyllabus.moduleLabel && (
                    <p className="text-xs text-muted-foreground">{selectedSyllabus.moduleLabel}</p>
                  )}
                </div>
                <Button size="sm" onClick={() => setCreateTopicOpen(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Topic
                </Button>
              </div>
              <TopicList syllabusId={selectedSyllabus.id || selectedSyllabus._id} courseId={course.id} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[240px] border border-dashed rounded-lg text-center">
              <ChevronRight className="h-7 w-7 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">No module selected</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select a module on the left to view its topics
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Syllabus Sheet */}
      <SheetReuse
        title="Add Syllabus 📚"
        description="Add a new module to this course"
        open={createSyllabusOpen}
        closeFn={() => setCreateSyllabusOpen(false)}
      >
        <SyllabusForm courseId={course.id} />
      </SheetReuse>

      {/* Add Topic Sheet */}
      {selectedSyllabus && (
        <SheetReuse
          title="Add Topic 🎬"
          description={`Add a topic to ${selectedSyllabus.title}`}
          open={createTopicOpen}
          closeFn={() => setCreateTopicOpen(false)}
        >
          <TopicForm syllabusId={selectedSyllabus.id || selectedSyllabus._id} courseId={course.id} />
        </SheetReuse>
      )}
    </>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [editOpen, setEditOpen] = useState(false);
  const { course, isPending } = useCourseById(id);

  // ── Loading ──
  if (isPending) {
    return (
      <PageContainer scrollable>
        <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
          <Skeleton className="h-60 w-full rounded-xl" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  // ── Not found ──
  if (!course) {
    return (
      <PageContainer scrollable>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-semibold">Course not found</p>
          <Button variant="ghost" className="mt-4" onClick={() => router.push("/admin/courses")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      {/* Edit Course Sheet */}
      <SheetReuse
        className="w-full md:w-full"
        title="Edit Course 📜"
        description="Update course details"
        open={editOpen}
        closeFn={() => setEditOpen(false)}
      >
        <CourseForm data={course as any} />
      </SheetReuse>

      <PageContainer scrollable>
        <div className="space-y-6 max-w-5xl mx-auto px-4 py-6">

          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="mt-0.5 shrink-0"
                onClick={() => router.push("/admin/courses")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold leading-tight">{course.title}</h1>
                <p className="text-muted-foreground text-sm mt-1 max-w-xl line-clamp-2">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.duration}
                  </Badge>
                  <Badge variant={course.isPublished ? "default" : "secondary"}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => setEditOpen(true)} className="shrink-0">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </div>

          <Separator />

          {/* ── Tabs ── */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            </TabsList>

            {/* ── Overview Tab ── */}
            <TabsContent value="overview" className="space-y-6 mt-4">

              {/* Media preview */}
              {course.photo && (
                <div className="rounded-xl overflow-hidden border bg-muted">
                  <img
                    src={course.photo}
                    alt={course.title}
                    className="w-full max-h-72 object-cover"
                  />
                </div>
              )}
              {!course.photo && course.videoUrl && (
                <div className="rounded-xl overflow-hidden border bg-muted">
                  <video src={course.videoUrl} controls className="w-full max-h-72" />
                </div>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Duration
                  </p>
                  <p className="font-semibold text-sm">{course.duration}</p>
                </div>
                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="h-3 w-3" /> Rating
                  </p>
                  <p className="font-semibold text-sm">
                    {course.rating != null ? `${course.rating} / 5` : "—"}
                  </p>
                </div>
                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <LayoutGrid className="h-3 w-3" /> Modules
                  </p>
                  <p className="font-semibold text-sm">{course.totalModules ?? "—"}</p>
                </div>
                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-semibold text-sm">
                    {course.isPublished ? "Published" : "Draft"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Media links */}
              {(course.photo || course.videoUrl) && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Media</h3>
                  <div className="flex flex-wrap gap-3">
                    {course.photo && (
                      <a
                        href={course.photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        Cover Image
                      </a>
                    )}
                    {course.videoUrl && (
                      <a
                        href={course.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm border rounded-lg px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <Video className="h-4 w-4 text-muted-foreground" />
                        Course Video
                      </a>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ── Curriculum Tab ── */}
            <TabsContent value="curriculum" className="mt-4">
              <CurriculumSection course={course} />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </>
  );
}
