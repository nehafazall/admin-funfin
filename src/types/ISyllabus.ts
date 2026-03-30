export interface ISyllabusTopicRef {
    topicId: string;
    progress: number;
}

export interface ISyllabus {
    id: string;
    _id: string; // alias kept for compatibility
    courseId: string;
    title: string;
    moduleLabel: string;
    coverImage?: string | null;
    topics: ISyllabusTopicRef[];
    createdAt: Date;
    updatedAt: Date;
}
