"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, ChevronRight } from "lucide-react";
import { SheetReuse } from "@/components/global/sheet";
import SyllabusForm from "@/components/forms/syllabusForm";
import TopicList from "@/components/table/topic/topicList";
import TopicForm from "@/components/forms/topicForm";
import { useSyllabus } from "@/hooks/useSyllabus";
import { ICourse } from "@/types/ICourse";

interface Props {
  course: ICourse;
}

const CourseContent = ({ course }: Props) => {
  const [createSyllabus, setCreateSyllabus] = useState(false);
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string | null>(null);
  const [createTopic, setCreateTopic] = useState(false);

  const { syllabuses } = useSyllabus(course._id);
  const selectedSyllabus = syllabuses.find((s) => s._id === selectedSyllabusId);

  return (
    <div className="space-y-4 py-2">
      <div>
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-muted-foreground text-sm">{course.description}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline">{course.duration}</Badge>
          {course.isPublished ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant="secondary">Draft</Badge>
          )}
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="syllabuses">
        <TabsList>
          <TabsTrigger value="syllabuses">Syllabuses</TabsTrigger>
          {selectedSyllabus && (
            <TabsTrigger value="topics">
              Topics — {selectedSyllabus.moduleLabel || selectedSyllabus.title}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="syllabuses" className="space-y-3">
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-muted-foreground">
              Select a syllabus row to manage its topics.
            </p>
            <Button size="sm" onClick={() => setCreateSyllabus(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Syllabus
            </Button>
          </div>

          {syllabuses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No syllabuses yet. Add one to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {syllabuses.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => setSelectedSyllabusId(s._id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                    selectedSyllabusId === s._id
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
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        {selectedSyllabus && (
          <TabsContent value="topics" className="space-y-3">
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">
                Topics for: <strong>{selectedSyllabus.title}</strong>
              </p>
              <Button size="sm" onClick={() => setCreateTopic(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Topic
              </Button>
            </div>
            <TopicList syllabusId={selectedSyllabus._id} courseId={course._id} />
          </TabsContent>
        )}
      </Tabs>

      {/* Create Syllabus Sheet */}
      <SheetReuse
        title="Create Syllabus 📚"
        description="Add a new syllabus module to this course"
        open={createSyllabus}
        closeFn={() => setCreateSyllabus(false)}
      >
        <SyllabusForm courseId={course._id} />
      </SheetReuse>

      {/* Create Topic Sheet */}
      {selectedSyllabus && (
        <SheetReuse
          title="Create Topic 🎬"
          description={`Add a new topic to ${selectedSyllabus.title}`}
          open={createTopic}
          closeFn={() => setCreateTopic(false)}
        >
          <TopicForm syllabusId={selectedSyllabus._id} courseId={course._id} />
        </SheetReuse>
      )}
    </div>
  );
};

export default CourseContent;
