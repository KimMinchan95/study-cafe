interface CafeImage {
    imageId: string;
    imgSrc: string;
    originName: string;
    identifiedName: string;
    extensions: string;
}

export interface Cafe {
    address1: string;
    address2: string;
    businessName: string;
    cafeId: string;
    images: CafeImage[];
    createdAt: Date;
    updatedAt: Date | null;
}
