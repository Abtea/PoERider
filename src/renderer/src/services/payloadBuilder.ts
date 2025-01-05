export function buildQueryPayload(
    statsFound: Record<string, { value: number | [number, number]; type: string }>,
): object {
    const filters = Object.entries(statsFound).map(([statId, stat]) => ({
        id: statId,
        disabled: false, // Include `disabled` only at the filter level
        value: { min: stat.type === 'single' ? stat.value : stat.value[0] },
    }))

    return {
        query: {
            status: { option: 'online' },
            stats: [
                {
                    type: 'and',
                    filters, // Filters with correct key ordering
                },
            ],
        },
        sort: { price: 'asc' },
    }
}
