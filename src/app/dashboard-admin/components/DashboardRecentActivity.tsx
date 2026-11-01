import { Clock, TrendingUp, Edit3, Plus, RefreshCw } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const recentActivities = [
  {
    id: 'act-001',
    type: 'calculation',
    message: 'Perhitungan SAW & WASPAS berhasil dijalankan',
    time: '07/10/2026 15:30',
    icon: TrendingUp,
    color: 'var(--success)',
    bg: 'var(--success-bg)',
  },
  {
    id: 'act-002',
    type: 'edit',
    message: 'Bobot kriteria C1 (Harga) diperbarui menjadi 20%',
    time: '07/10/2026 14:15',
    icon: Edit3,
    color: 'var(--info)',
    bg: 'var(--info-bg)',
  },
  {
    id: 'act-003',
    type: 'add',
    message: 'Penilaian varian Cokelat Keju (A5) diperbarui',
    time: '07/10/2026 13:50',
    icon: Edit3,
    color: 'var(--warning)',
    bg: 'var(--warning-bg)',
  },
  {
    id: 'act-004',
    type: 'add',
    message: 'Varian Red Velvet (A6) ditambahkan ke sistem',
    time: '06/10/2026 11:20',
    icon: Plus,
    color: 'var(--primary)',
    bg: 'var(--muted)',
  },
  {
    id: 'act-005',
    type: 'recalc',
    message: 'Parameter λ WASPAS diubah menjadi 0.5',
    time: '06/10/2026 09:45',
    icon: RefreshCw,
    color: 'var(--accent)',
    bg: 'var(--peach-100)',
  },
];

export default function DashboardRecentActivity() {
  return (
    <div className="card-warm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
            Aktivitas Terbaru
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Riwayat perubahan data dan perhitungan
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <Clock size={12} />
          <span>5 aktivitas terakhir</span>
        </div>
      </div>

      <div className="space-y-3">
        {recentActivities?.map((act, idx) => {
          const Icon = act?.icon;
          return (
            <div
              key={act?.id}
              className="flex items-start gap-4 p-3 rounded-xl table-row-hover"
              style={{
                backgroundColor: idx % 2 === 0 ? 'var(--muted)' : 'transparent',
                border: '1px solid transparent',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: act?.bg }}
              >
                <Icon size={14} style={{ color: act?.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>
                  {act?.message}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  {act?.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}``