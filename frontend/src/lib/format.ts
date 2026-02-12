export function formatCfa(value?: number | string | null) {
  const num = Number(value ?? 0);
  if (!isFinite(num)) return '-';
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(num)} F CFA`;
}
