import type { AssetItem, NewAssetInput } from '../stores/assets';
import { request } from './http';

export const fetchAssets = () => request<AssetItem[]>('/assets');

export const createAsset = (payload: NewAssetInput) =>
  request<AssetItem>('/assets', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

export const updateAsset = (id: number, payload: Partial<NewAssetInput & { usage: number }>) =>
  request<AssetItem>(`/assets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
