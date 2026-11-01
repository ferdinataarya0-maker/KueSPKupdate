'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  mockAlternatives,
  mockCriteria,
  mockSubCriteria,
  mockAssessments,
  type Alternative,
  type Criteria,
  type SubCriteria,
  type Assessment,
} from './dss-data';

export interface Activity {
  id: string;
  time: string; // ISO
  by: string;
  text: string;
}

export interface DSSState {
  alternatives: Alternative[];
  criteria: Criteria[];
  subCriteria: SubCriteria[];
  assessments: Assessment[];
  lambda: number;
  activities: Activity[];
}

// Backend integration point: ganti localStorage dengan query/mutation Supabase di hook ini saja.
const KEY = 'lineradss:data:v1';

function seed(): DSSState {
  const now = Date.now();
  return {
    alternatives: mockAlternatives.map((a) => ({ ...a })),
    criteria: mockCriteria.map((c) => ({ ...c })),
    subCriteria: mockSubCriteria.map((s) => ({ ...s })),
    assessments: mockAssessments.map((a) => ({ ...a })),
    lambda: 0.5,
    activities: [
      { id: 'act-3', time: new Date(now - 1000 * 60 * 60 * 26).toISOString(), by: 'Admin Linera', text: 'Menambahkan sub kriteria skala Rasa & Tekstur' },
      { id: 'act-2', time: new Date(now - 1000 * 60 * 60 * 50).toISOString(), by: 'Admin Linera', text: 'Memperbarui bobot kriteria Tingkat Penjualan' },
      { id: 'act-1', time: new Date(now - 1000 * 60 * 60 * 72).toISOString(), by: 'Admin Linera', text: 'Mengimpor data awal 6 varian kue balok' },
    ],
  };
}

export function useDSSData() {
  const [state, setState] = useState<DSSState>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...seed(), ...(JSON.parse(raw) as Partial<DSSState>) });
    } catch {}
    setReady(true);
  }, []);

  const update = useCallback((updater: (s: DSSState) => DSSState, log?: string) => {
    setState((prev) => {
      let next = updater(prev);
      if (log) {
        next = {
          ...next,
          activities: [
            { id: `act-${Date.now()}`, time: new Date().toISOString(), by: 'Admin Linera', text: log },
            ...next.activities,
          ].slice(0, 50),
        };
      }
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const fresh = seed();
    try {
      window.localStorage.setItem(KEY, JSON.stringify(fresh));
    } catch {}
    setState(fresh);
  }, []);

  return { ...state, ready, update, reset };
}

export function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}
