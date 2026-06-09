import { request } from './http';

export type DeliveryStatus = 'submitted' | 'viewed' | 'contacted' | 'interviewing' | 'offer' | 'rejected';

export interface DeliveryRecord {
  id: number;
  jobId?: number | null;
  company: string;
  title: string;
  channel: string;
  resume: string;
  date: string;
  response: string;
  status: DeliveryStatus;
  description: string;
  alert?: string | null;
}

export interface DeliveryPayload {
  jobId?: number | null;
  resume: string;
  channel: string;
  status: DeliveryStatus;
  date: string;
  response?: string | number;
  note: string;
}

export const fetchApplications = () => request<DeliveryRecord[]>('/applications');

export const createApplication = (payload: DeliveryPayload) =>
  request<DeliveryRecord>('/applications', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
