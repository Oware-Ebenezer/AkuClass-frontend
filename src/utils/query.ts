export const toQuery = (params: object) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && q.set(k, String(v)));
  return `?${q.toString()}`;
};
