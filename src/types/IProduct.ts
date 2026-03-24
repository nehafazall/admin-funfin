

export interface IProduct {
    _id: string;
    productName: string;
    image?: string;
    brand: {
        _id: string;
        brandName: string;
    };
    branchId?: {
        _id: string;
        branchName: string;
    };
    category: {
        _id: string;
        categoryName: string;
    };
    subCategory: {
        _id: string;
        subCategoryName: string;
    };
    serialNumber: string;
    barcodeNumber: string;
    isDeleted: {
        status: boolean;
        deletedBy?: string;
        deletedByType?: "User" | "Admin";
        deletedTime?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}
