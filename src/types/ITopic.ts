export interface ITopic {
    _id: string;
    syllabusId: string;
    courseId: string;
    title: string;
    videoUrl: string;
    overview: string;
    order?: number;
    createdAt: Date;
    updatedAt: Date;
}
