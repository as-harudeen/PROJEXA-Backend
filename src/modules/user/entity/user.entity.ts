export class UserEntity {
    user_id: string;
    user_name: string;
    user_email: string;
    password: string;
    user_profile: string;
    bio: string;
    is_blocked: boolean;
    two_factor_enabled: boolean;
    createdAt: Date
}