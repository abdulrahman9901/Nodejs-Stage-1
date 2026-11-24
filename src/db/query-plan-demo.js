/**
 * Educational simulator comparing MongoDB COLLSCAN vs IXSCAN (left-prefix B-tree index).
 */
export function simulateQueryPlan(docs, equalityFilter, indexFields = []) {
  const filterKeys = Object.keys(equalityFilter);
  const usesIndex =
    filterKeys.length > 0 &&
    indexFields.length >= filterKeys.length &&
    filterKeys.every((key) => indexFields.slice(0, filterKeys.length).includes(key));

  const matched = docs.filter((doc) =>
    filterKeys.every((key) => doc[key] === equalityFilter[key])
  );

  return {
    stage: usesIndex ? "IXSCAN" : "COLLSCAN",
    totalDocsExamined: usesIndex ? matched.length : docs.length,
    matchedCount: matched.length,
    matched,
  };
}

const isDirectRun =
  process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));
if (isDirectRun) {
  const statuses = ["TODO", "IN_PROGRESS", "DONE"];
  const docs = Array.from({ length: 10_000 }, (_, i) => ({
    _id: `task_${i + 1}`,
    workspaceId: `ws_${(i % 50) + 1}`,
    status: statuses[i % statuses.length],
    priority: (i % 5) + 1,
  }));

  const filter = { workspaceId: "ws_7", status: "TODO" };
  const noIndex = simulateQueryPlan(docs, filter, []);
  const badIndex = simulateQueryPlan(docs, filter, ["priority", "workspaceId", "status"]);
  const esrIndex = simulateQueryPlan(docs, filter, ["workspaceId", "status", "createdAt", "priority"]);

  console.log("[S07] Query:", filter, "over 10,000 tasks");
  console.log(`  No index   -> ${noIndex.stage}, examined=${noIndex.totalDocsExamined}, matched=${noIndex.matchedCount}`);
  console.log(`  Wrong order-> ${badIndex.stage}, examined=${badIndex.totalDocsExamined}, matched=${badIndex.matchedCount}`);
  console.log(`  ESR index  -> ${esrIndex.stage}, examined=${esrIndex.totalDocsExamined}, matched=${esrIndex.matchedCount}`);
}
