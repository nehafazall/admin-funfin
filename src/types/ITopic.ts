export interface ITopic {
    id: string;
    _id: string; // alias kept for compatibility
    syllabusId: string;
    courseId: string;
    title: string;
    videoUrl: string;
    overview: string;
    order?: number;
    createdAt: Date;
    updatedAt: Date;
}
