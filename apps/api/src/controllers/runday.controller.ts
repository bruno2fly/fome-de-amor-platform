import { Request, Response } from 'express';
import { env } from '../config/env';

// RUN DAY registrations are written by the fomedeamor.com.br checkout into the
// site's Supabase project (table runday_registrations). This reads them with the
// service-role key, which never leaves the server. Admin-only (see admin.routes).

const COLUMNS = [
  'order_id', 'status', 'nome', 'nascimento', 'email', 'cpf', 'cidade', 'grupo',
  'percurso', 'plano', 'tamanho', 'amount', 'amount_paid', 'payment_id', 'paid_at', 'created_at'
].join(',');

type Registration = {
  order_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  nome: string;
  nascimento: string;
  email: string;
  cpf: string;
  cidade: string;
  grupo: string | null;
  percurso: string;
  plano: string;
  tamanho: string | null;
  amount: string;
  amount_paid: string | null;
  payment_id: string | null;
  paid_at: string | null;
  created_at: string;
};

function countBy<T>(items: T[], key: (item: T) => string | null, order: string[]) {
  const counts: Record<string, number> = Object.fromEntries(order.map((k) => [k, 0]));
  for (const item of items) {
    const k = key(item);
    if (k) counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

export async function listRundayRegistrations(_req: Request, res: Response) {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return res.status(503).json({ message: 'Inscrições do RUN DAY não configuradas no servidor.' });
  }

  const url = `${env.supabaseUrl.replace(/\/$/, '')}/rest/v1/runday_registrations?select=${COLUMNS}&order=created_at.desc`;
  const response = await fetch(url, {
    headers: {
      apikey: env.supabaseServiceRoleKey,
      Authorization: `Bearer ${env.supabaseServiceRoleKey}`
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    console.error('runday: Supabase read failed with HTTP', response.status);
    return res.status(502).json({ message: 'Não foi possível carregar as inscrições.' });
  }

  const registrations = (await response.json()) as Registration[];
  const paid = registrations.filter((r) => r.status === 'approved');
  const totalCollected = paid.reduce((sum, r) => sum + Number(r.amount_paid ?? r.amount ?? 0), 0);

  const summary = {
    paidCount: paid.length,
    pendingCount: registrations.filter((r) => r.status === 'pending').length,
    totalCollected: Math.round(totalCollected * 100) / 100,
    byPercurso: countBy(paid, (r) => r.percurso, ['4K', '8K', 'KIDS']),
    byPlano: countBy(paid, (r) => r.plano, ['sem-camiseta', 'com-camiseta']),
    byTamanho: countBy(
      paid.filter((r) => r.plano === 'com-camiseta'),
      (r) => r.tamanho,
      ['P', 'M', 'G', 'GG', 'XG']
    )
  };

  // Personal data (CPF, birth date): never cache.
  res.setHeader('Cache-Control', 'no-store');
  return res.json({ summary, registrations });
}
