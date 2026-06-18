export function normalizeSearchValue(value: unknown): string {
    return String(value ?? '').toLowerCase().trim()
}

export function matchesSearch(query: string, values: unknown[]): boolean {
    const normalizedQuery = normalizeSearchValue(query)

    if (!normalizedQuery)
        return true

    return values.some(value => normalizeSearchValue(value).includes(normalizedQuery))
}

export function filterRowsBySearch<Row>(
    rows: Row[],
    query: string,
    getValues: (row: Row) => unknown[],
): Row[] {
    if (!normalizeSearchValue(query))
        return rows

    return rows.filter(row => matchesSearch(query, getValues(row)))
}

export function filterTreeRowsBySearch<Row extends { children?: Row[] }>(
    rows: Row[],
    query: string,
    getValues: (row: Row) => unknown[],
): Row[] {
    if (!normalizeSearchValue(query))
        return rows

    return rows.flatMap((row) => {
        const filteredChildren = row.children
            ? filterTreeRowsBySearch(row.children, query, getValues)
            : []

        if (matchesSearch(query, getValues(row)) || filteredChildren.length > 0) {
            return [{
                ...row,
                children: filteredChildren,
            }]
        }

        return []
    })
}
