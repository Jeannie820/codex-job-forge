import { request } from './http';

export type InterviewStatus = 'notStarted' | 'done' | 'cancelled';
export type InterviewType = 'phone' | 'technical' | 'video' | 'onsite' | 'hr';
export type AssetCascaderPath = Array<string | number>;

export interface Interview {
  id: number;
  jobId?: number | null;
  interviewAt: string;
  type: InterviewType;
  status: InterviewStatus;
  round: number;
  title: string;
  company: string;
  location: string;
  score?: number;
  companyResearch?: string;
  roleMatch?: string;
  questions?: string;
  projectStories?: string;
  preparedQuestions?: string[];
  preparedProjectStories?: string[];
  usedAssetIds?: number[];
  strengths?: string;
  improvements?: string;
  followUp?: string;
}

export interface InterviewPayload {
  jobId?: number | null;
  round: number;
  type: InterviewType;
  status: InterviewStatus;
  interviewAt: string;
  companyResearch: string;
  roleMatch: string;
  questions: string;
  projectStories: string;
  preparedQuestions?: string[];
  preparedProjectStories?: string[];
  reviewScore?: number;
  usedAssetIds: number[];
  strengths: string;
  improvements: string;
  followUp: string;
}

export const fetchInterviews = () => request<Interview[]>('/interviews');

export const createInterview = (payload: InterviewPayload) =>
  request<Interview>('/interviews', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const updateInterview = (id: number, payload: InterviewPayload) =>
  request<Interview>(`/interviews/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });

export const updateInterviewStatus = (id: number, status: InterviewStatus) =>
  request<Interview>(`/interviews/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });

export const toggleInterviewPreparation = (id: number, kind: 'questions' | 'projectStories', item: string) =>
  request<Interview>(`/interviews/${id}/preparation`, {
    method: 'PATCH',
    body: JSON.stringify({ kind, item })
  });
