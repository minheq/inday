type GroupedByID<T extends { id: string }> = { [id: string]: T };

export function groupByID<T extends { id: string }>(
  items: T[],
): GroupedByID<T> {
  const grouped: GroupedByID<T> = {};

  for (const item of items) {
    grouped[item.id] = item;
  }

  return grouped;
}
