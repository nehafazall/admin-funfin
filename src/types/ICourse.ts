export interface ICourse {
    id: string;
    title: string;
    description: string;
    photo: string;
    videoUrl?: string;
    duration: string;
    rating?: number;
    totalModules?: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
