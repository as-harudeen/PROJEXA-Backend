export interface DemoteAdminToMemberParamDto {
    team_id: string;
    admin_id: string;
}

export interface DemoteAdminToMemberDto extends DemoteAdminToMemberParamDto {
    curr_admin_id: string;
}