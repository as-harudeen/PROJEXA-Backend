export interface PromoteToAdminParamDto {
  team_id: string;
  member_id: string;
}

export interface PromoteToAdminDto extends PromoteToAdminParamDto {
  admin_id: string;
}
