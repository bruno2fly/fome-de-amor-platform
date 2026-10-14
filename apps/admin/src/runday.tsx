import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api } from './api';
import { RundayRegistration, RundaySummary } from './types';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const STATUS_LABEL: Record<RundayRegistration['status'], string> = {
  approved: 'Pago',
  pending: 'Aguardando pagamento',
  rejected: 'Recusado',
  refunded: 'Reembolsado'
};

const PLANO_LABEL: Record<string, string> = {
  'sem-camiseta': 'Sem camiseta',
  'com-camiseta': 'Com camiseta'
};

function formatCpf(cpf: string) {
  const d = cpf.replace(/\D/g, '');
  return d.length === 11 ? `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}` : cpf;
}

// Birth dates are plain dates (YYYY-MM-DD); format without timezone shifts.
function formatBirth(iso: string) {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

function ageOn(iso: string, on: Date) {
  const [y, m, d] = iso.split('-').map(Number);
  let age = on.getFullYear() - y;
  if (on.getMonth() + 1 < m || (on.getMonth() + 1 === m && on.getDate() < d)) age -= 1;
  return age;
}

const RACE_DAY = new Date(2027, 1, 28); // 28/02/2027 — age as of race day

function formatDateTime(iso: string | null) {
  return iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
}

function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

function Breakdown({ title, counts, labels }: { title: string; counts: Record<string, number>; labels?: Record<string, string> }) {
  return (
    <div className="stat-card breakdown">
      <span>{title}</span>
      <ul>
        {Object.entries(counts).map(([key, n]) => (
          <li key={key}>
            <em>{labels?.[key] ?? key}</em>
            <b>{n}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RundayDashboard() {
  const [data, setData] = useState<{ summary: RundaySummary; registrations: RundayRegistration[] } | null>(null);
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      setData(await api.get('/admin/runday/registrations'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar inscrições.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (loading && !data) return <div className="empty">Carregando inscrições...</div>;
  if (error && !data) return <div className="error">{error}</div>;
  if (!data) return null;

  const { summary } = data;
  const rows = showUnpaid ? data.registrations : data.registrations.filter((r) => r.status === 'approved');
  const unpaidCount = data.registrations.length - summary.paidCount;

  return (
    <div className="runday">
      {error ? <div className="error">{error}</div> : null}

      <section className="stat-grid">
        <Stat label="Inscrições pagas" value={String(summary.paidCount)} detail={`${summary.pendingCount} aguardando pagamento`} />
        <Stat label="Total arrecadado" value={brl.format(summary.totalCollected)} />
        <Breakdown title="Por percurso" counts={summary.byPercurso} />
        <Breakdown title="Por kit" counts={summary.byPlano} labels={PLANO_LABEL} />
        <Breakdown title="Camisetas por tamanho" counts={summary.byTamanho} />
      </section>

      <div className="table-toolbar">
        <h2>Inscritos ({rows.length})</h2>
        <div className="table-actions">
          {unpaidCount > 0 ? (
            <label className="checkbox">
              <input type="checkbox" checked={showUnpaid} onChange={(e) => setShowUnpaid(e.target.checked)} />
              Mostrar não pagas ({unpaidCount})
            </label>
          ) : null}
          <button className="secondary-button" onClick={() => void load()} disabled={loading}>
            <RefreshCw size={16} /> {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="empty">Nenhuma inscrição paga ainda.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Nascimento</th>
                <th>E-mail</th>
                <th>Cidade</th>
                <th>Grupo</th>
                <th>Percurso</th>
                <th>Kit</th>
                <th>Tam.</th>
                <th>Status</th>
                <th>Valor</th>
                <th>Pago em</th>
                <th>Código</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.order_id}>
                  <td className="strong">{r.nome}</td>
                  <td className="mono">{formatCpf(r.cpf)}</td>
                  <td>{formatBirth(r.nascimento)} <small>({ageOn(r.nascimento, RACE_DAY)} anos)</small></td>
                  <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
                  <td>{r.cidade}</td>
                  <td>{r.grupo || '—'}</td>
                  <td>{r.percurso}</td>
                  <td>{PLANO_LABEL[r.plano] ?? r.plano}</td>
                  <td>{r.tamanho ?? '—'}</td>
                  <td><span className={`status-badge status-${r.status}`}>{STATUS_LABEL[r.status] ?? r.status}</span></td>
                  <td>{brl.format(Number(r.amount_paid ?? r.amount))}</td>
                  <td>{formatDateTime(r.paid_at)}</td>
                  <td className="mono">{r.order_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
