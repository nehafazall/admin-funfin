export interface ISyllabusTopicRef {
    _id: string;
    topicId: string;
    progress: number;
}

export interface ISyllabus {
    _id: string;
    courseId: string;
    title: string;
    moduleLabel: string;
    coverImage?: string | null;
    topics: ISyllabusTopicRef[];
    createdAt: Date;
    updatedAt: Date;
}
