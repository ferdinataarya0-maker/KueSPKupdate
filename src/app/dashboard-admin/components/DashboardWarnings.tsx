'use client';

import { useDSSData } from '@/lib/dss-store';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function DashboardWarnings() {
  const { alternatives: mockAlternatives, criteria: mockCriteria, assessments: mockAssessments } = useDSSData();
  const totalBobot = mockCriteria?.reduce((s, c) => s + c?.bobot, 0);
  const bobotValid = totalBobot === 100;

  const totalExpected = mockAlternatives?.length * mockCriteria?.length;
  const totalAssessments = mockAssessments?.length;
  const penilaianLengkap = totalAssessments >= totalExpected;

  if (bobotValid && penilaianLengkap) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
        style={{
          backgroundColor: 'var(--success-bg)',
          border: '1px solid rgba(45,106,79,0.25)',
          color: 'var(--success)',
        }}
      >
        <CheckCircle size={16} className="flex-shrink-0" />
        <span className="font-medium">
          Semua data siap — bobot valid (100%) dan semua penilaian telah diisi. Perhitungan dapat dilakukan.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {!bobotValid && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            backgroundColor: 'var(--error-bg)',
            border: '1px solid rgba(197,48,48,0.25)',
            color: 'var(--error)',
          }}
        >
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span className="font-medium">
            Total bobot kriteria saat ini {totalBobot}% — harus berjumlah tepat 100% sebelum perhitungan dilakukan.
          </span>
        </div>
      )}
      {!penilaianLengkap && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            backgroundColor: 'var(--warning-bg)',
            border: '1px solid rgba(183,121,31,0.25)',
            color: 'var(--warning)',
          }}
        >
          <Info size={16} className="flex-shrink-0" />
          <span className="font-medium">
            Penilaian belum lengkap — {totalAssessments}/{totalExpected} nilai telah diisi. Lengkapi penilaian untuk semua varian dan kriteria.
          </span>
        </div>
      )}
    </div>
  );
}