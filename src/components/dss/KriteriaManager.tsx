'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useDSSData, nextId } from '@/lib/dss-store';
import type { Criteria } from '@/lib/dss-data';
import { Card, CardHeader, Btn, IconBtn, Modal, Field, DataTable, Td, Badge, Loading } from '@/components/ui/Parts';

const empty = { nama: '', jenis: 'BENEFIT' as 'BENEFIT' | 'COST', bobot: '' };

export default function KriteriaManager({ readOnly = false }: { readOnly?: boolean }) {
  const { criteria, ready, update } = useDSSData();
  const [editing, setEditing] = useState<Criteria | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  if (!ready) return <Loading />;

  const total = criteria.reduce((s, c) => s + c.bobot, 0);
  const valid = Math.abs(total - 100) < 0.001;

  const openAdd = () => { setEditing(null); setForm(empty); setError(''); setOpen(true); };
  const openEdit = (c: Criteria) => { setEditing(c); setForm({ nama: c.nama, jenis: c.jenis, bobot: String(c.bobot) }); setError(''); setOpen(true); };

  const save = () => {
    const bobot = Number(form.bobot);
    if (!form.nama.trim()) return setError('Nama kriteria wajib diisi.');
    if (!Number.isFinite(bobot) || bobot <= 0 || bobot > 100) return setError('Bobot harus antara 1 – 100 (%).');
    update((s) => {
      if (editing) {
        return { ...s, criteria: s.criteria.map((c) => (c.id === editing.id ? { ...c, nama: form.nama.trim(), jenis: form.jenis, bobot } : c)) };
      }
      const nums = s.criteria.map((c) => Number(c.kode.replace(/\D/g, '')) || 0);
      return { ...s, criteria: [...s.criteria, { id: nextId('crit'), kode: `C${Math.max(0, ...nums) + 1}`, nama: form.nama.trim(), jenis: form.jenis, bobot }] };
    }, editing ? `Mengubah kriteria ${form.nama.trim()}` : `Menambah kriteria ${form.nama.trim()}`);
    setOpen(false);
  };

  const remove = (c: Criteria) => {
    if (!window.confirm(`Hapus kriteria "${c.nama}"? Sub kriteria dan penilaiannya ikut terhapus.`)) return;
    update((s) => ({
      ...s,
      criteria: s.criteria.filter((x) => x.id !== c.id),
      subCriteria: s.subCriteria.filter((x) => x.criteriaId !== c.id),
      assessments: s.assessments.filter((x) => x.criteriaId !== c.id),
    }), `Menghapus kriteria ${c.nama}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div
        className="flex items-center gap-3 p-4 rounded-xl"
        style={{ backgroundColor: valid ? 'var(--success-bg)' : 'var(--warning-bg)', color: valid ? 'var(--success)' : 'var(--warning)' }}
      >
        {valid ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
        <p className="text-sm font-medium">
          Total bobot saat ini <strong>{total}%</strong>. {valid ? 'Sudah valid (100%).' : 'Total bobot harus tepat 100% agar hasil perhitungan akurat.'}
        </p>
      </div>

      <Card>
        <CardHeader
          title="Data Kriteria & Bobot"
          desc="Benefit: semakin besar semakin baik · Cost: semakin kecil semakin baik"
          action={!readOnly && <Btn onClick={openAdd}><Plus size={16} /> Tambah Kriteria</Btn>}
        />
        <DataTable head={readOnly ? ['Kode', 'Kriteria', 'Jenis', 'Bobot'] : ['Kode', 'Kriteria', 'Jenis', 'Bobot', 'Aksi']}>
          {criteria.map((c) => (
            <tr key={c.id} className="table-row-hover">
              <Td className="font-semibold" style={{ color: 'var(--primary)' }}>{c.kode}</Td>
              <Td className="font-medium">{c.nama}</Td>
              <Td><Badge tone={c.jenis === 'BENEFIT' ? 'success' : 'warning'}>{c.jenis === 'BENEFIT' ? 'Benefit' : 'Cost'}</Badge></Td>
              <Td>
                <div className="flex items-center gap-2 min-w-[140px]">
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-2 rounded-full" style={{ width: `${Math.min(c.bobot, 100)}%`, backgroundColor: 'var(--primary)' }} />
                  </div>
                  <span className="text-xs font-semibold w-10 text-right">{c.bobot}%</span>
                </div>
              </Td>
              {!readOnly && (
                <Td>
                  <div className="flex gap-1.5">
                    <IconBtn title="Ubah" onClick={() => openEdit(c)}><Pencil size={14} /></IconBtn>
                    <IconBtn title="Hapus" danger onClick={() => remove(c)}><Trash2 size={14} /></IconBtn>
                  </div>
                </Td>
              )}
            </tr>
          ))}
        </DataTable>
      </Card>

      <Modal open={open} title={editing ? 'Ubah Kriteria' : 'Tambah Kriteria'} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Nama kriteria"><input className="input-warm w-full px-3 py-2 rounded-lg" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></Field>
          <Field label="Jenis">
            <select className="input-warm w-full px-3 py-2 rounded-lg" value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value as 'BENEFIT' | 'COST' })}>
              <option value="BENEFIT">Benefit</option>
              <option value="COST">Cost</option>
            </select>
          </Field>
          <Field label="Bobot (%)" hint="Total semua kriteria harus 100%."><input type="number" className="input-warm w-full px-3 py-2 rounded-lg" value={form.bobot} onChange={(e) => setForm({ ...form, bobot: e.target.value })} /></Field>
          {error && <p className="text-sm" style={{ color: 'var(--error)' }}>{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Btn variant="secondary" onClick={() => setOpen(false)}>Batal</Btn>
            <Btn onClick={save}>Simpan</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
