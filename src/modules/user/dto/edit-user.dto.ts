import { UserGender } from "@prisma/client";

export class EdituserDto {
    user_name?: string;
    user_profile?: string;
    summary?: string;
    birthday?: string;
    gender?: UserGender;
}