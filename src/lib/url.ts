type SearchParams = Record<string, string | string[] | undefined>;

export function buildQueryString(
  searchParams: SearchParams,
  updates: Record<string, string | undefined | null>
): string {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry !== undefined) params.append(key, entry);
      });
    } else if (value !== undefined) {
      params.set(key, value);
    }
  });
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}
