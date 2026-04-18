export interface ICourse {
    id: string;
    _id?: string;
    title: string;
    name?: string;
    description: string;
    photo: string;
    image?: string;
    videoUrl?: string;
    duration: string;
    rating?: number;
    totalModules?: number;
    isPublished: boolean;
    mainCourseId?: {
        _id?: string;
        name?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
