class SearchService {
  buildSearchUrl(
    filters: Record<string, string | number | string[]>,
    locale: string,
  ): string {
    const qs = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        if (value.length) qs.set(key, value.join(','));
      } else {
        qs.set(key, String(value));
      }
    });

    const queryString = qs.toString();
    return queryString
      ? `/${locale}/explore/listing?${queryString}`
      : `/${locale}/explore/listing`;
  }
}

export const searchService = new SearchService();
