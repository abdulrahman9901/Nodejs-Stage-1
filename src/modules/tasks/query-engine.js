const ALLOWED_SORT_FIELDS = new Set(["createdAt", "title", "priority", "status"]);

export function parsePaginationParams({ page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;
  const safeSortBy = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "createdAt";
  const safeOrder = order === "asc" ? "asc" : "desc";
  return { page: safePage, limit: safeLimit, skip, take: safeLimit, sortBy: safeSortBy, order: safeOrder };
}

export async function runPaginatedQuery(findManyFn, countFn, params) {
  const p = parsePaginationParams(params);
  const [items, totalDocs] = await Promise.all([findManyFn(p), countFn(p)]);
  const totalPages = Math.ceil(totalDocs / p.limit) || 1;
  return {
    items,
    meta: {
      page: p.page,
      limit: p.limit,
      totalDocs,
      totalPages,
      hasNextPage: p.page < totalPages,
      hasPrevPage: p.page > 1,
    },
  };
}
