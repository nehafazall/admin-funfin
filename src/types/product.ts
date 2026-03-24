
interface IReview {
    _id: string;
    user: string;
    name: string;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IFeature {
    _id: string;
    key: string;
    value: string;
}

interface IImage {
    _id: string;
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
}

interface IIsDeleted {
    _id: string;
    status: boolean;
    deletedBy?: string;
    deletedTime?: Date;
}

export interface IProduct {
    _id: string;
    productName: string;
    productDescription: string;
    reviews: IReview[];
    rating: number;
    numReviews: number;
    brand: string;
    slug: string;
    modelNumber?: string;
    serialNumber: string;
    barcode?: string;
    price: number;
    finalPrice: number;
    discountInPercentage?: number;
    returnPeriod: number;
    deliveryPeriod: number;
    inStock: number;
    isActive: boolean;
    category: string;
    subcategories: { subcategory: string }[];
    images: IImage;
    features: IFeature[];
    isDeleted: IIsDeleted;
    createdAt?: Date;
    updatedAt?: Date;
}
