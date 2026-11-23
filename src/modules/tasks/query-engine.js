export function parsePaginationParams({ page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = {}) {
  // TODO(student): Cap limit at 100, compute skip = (page - 1) * limit, and whitelist sortBy!
  return { page: Number(page), limit: Number(limit), skip: 0, take: Number(limit), sortBy, order };
}

export async function runPaginatedQuery(findManyFn, countFn, params) {
  const p = parsePaginationParams(params);
  // TODO(student): Run findManyFn and countFn in parallel with Promise.all and calculate full meta!
  const items = await findManyFn(p);
  return { items, meta: { page: p.page, limit: p.limit, totalDocs: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false } };
}
