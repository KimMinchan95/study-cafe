interface CafeImage {
    imageId: string;
    imgSrc: string;
    originName: string;
    identifiedName: string;
    extensions: string;
}

export interface CafeBadge {
    badgeId: string;
    title: string;
    bgColor: string;
    txtColor: string;
}

export interface Cafe {
    address1: string;
    address2: string;
    businessName: string;
    cafeId: string;
    images: CafeImage[];
    badges?: CafeBadge[];
    createdAt: Date;
    updatedAt: Date | null;
}
