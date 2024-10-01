import { create } from 'zustand';
import api from '../util/api';

interface TreeState {
  familyId: number | null;
  treeData: any | null;
  fetchTreeData: (familyId: number) => Promise<void>;
  updateTreeExp: (familyId: number, point: number) => Promise<void>;
  error: string | null;
  setFamilyId: (familyId: number) => void;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  familyId: parseInt(localStorage.getItem('selectedFamilyId') || '0', 10),
  treeData: null,
  error: null,
  fetchTreeData: async (familyId: number) => {
    if (familyId !== null) {
      try {
        const response = await api.get(`/tree/${familyId}`);
        set({ treeData: response.data });
      } catch (error: any) {
        set({ error: error.message });
      }
    }
  },
  updateTreeExp: async (familyId: number, point: number) => {
    // const { familyId } = get();
    if (familyId !== null) {
      try {
        await api.put(`/tree`, { familyId, point });
        const response = await api.get(`/tree/${familyId}`);
        set({ treeData: response.data });
      } catch (error: any) {
        set({ error: error.message });
      }
    }
  },
  setFamilyId: (familyId: number) => {
    localStorage.setItem('selectedFamilyId', familyId.toString());
    set({ familyId });
  },
}));
