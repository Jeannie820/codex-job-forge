import type { Job, JobStatus, NewJobInput } from '../stores/jobs';
import { request } from './http';

export const fetchJobs = () => request<Job[]>('/jobs');

export const createJob = (payload: NewJobInput) =>
  request<Job>('/jobs', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const patchJobStatus = (id: number, status: JobStatus) =>
  request<Job>(`/jobs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
