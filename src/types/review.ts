import { StaticImageData } from "next/image"

export interface ReviewType{
    id: string
    userName: string
    vaccine: string
    status: string
    comment: string
    createdAt: string
    updatedAt: string
    link: string
};

export interface ReviewProp {
    data: ReviewType
    image: StaticImageData
    handleApprove: (data: string) => Promise<void>
    handleReject: (data: string) => Promise<void>
 };
