export type ExperienceRecordStatus = 'collecting' | 'finalized'
export type ExperienceIntegrityStatus = 'valid' | 'under_review' | 'invalidated'
export type ExperienceVisibility = 'private' | 'public'
export type ExperienceSourceType = 'task' | 'deliverable'
export interface ExperienceMetric { assigned_tasks:number; completed_tasks:number; discussions:number; activity_events:number; deliverables:number; team_size:number }
export interface ExperienceHighlight { id:string; source_type:ExperienceSourceType; source_id?:string; title:string; description?:string|null; display_order:number; available:boolean; unavailable_reason?:string|null }
export interface ExperienceReflection { body:string; updated_at:string }
export interface ExperienceCard { id:string; slug:string; project_id:string; project_title:string; project_slug:string; project_summary:string; contribution_role:string; membership_role:string; joined_at?:string|null; left_at?:string|null; project_started_at?:string|null; project_ended_at?:string|null; outcome?:string|null; record_status:ExperienceRecordStatus; record_status_label:string; integrity_status:ExperienceIntegrityStatus; visibility:ExperienceVisibility; visibility_label:string; snapshot_version:number; generated_at?:string|null; metrics:ExperienceMetric; highlight_count:number; username?:string; full_name?:string }
export interface ExperienceDetail extends ExperienceCard { highlights:ExperienceHighlight[]; reflection?:ExperienceReflection|null; can_edit:boolean; trust_explanation:string[] }
