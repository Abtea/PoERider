export interface Stat {
    id: string
    name: string
    isRange?: boolean // Indicates if the stat allows a range (e.g., `109-191`)
}

const statArray: Stat[] = [
    // { id: 'explicit.stat_1509134228', name: '#% increased Physical Damage' },
    // { id: 'explicit.stat_3962278098', name: '#% increased Fire Damage' },
    // { id: 'explicit.stat_3291658075', name: '#% increased Cold Damage' },
    // { id: 'explicit.stat_2231156303', name: '#% increased Lightning Damage' },
    // { id: 'explicit.stat_736967255', name: '#% increased Chaos Damage' },
    // { id: 'explicit.stat_2974417149', name: '#% increased Spell Damage' },
    // { id: 'explicit.stat_4015621042', name: '#% increased Energy Shield' },
    // { id: 'explicit.stat_2891184298', name: '#% increased Cast Speed' },
    // { id: 'explicit.stat_124859000', name: '#% increased Evasion Rating' },
    // { id: 'explicit.stat_2250533757', name: '#% increased Movement Speed' },
    // { id: 'explicit.stat_3917489142', name: '#% increased Rarity of Items found' },
    { id: 'explicit.stat_1050105434', name: '# to maximum Mana' },
    { id: 'explicit.stat_3299347043', name: '# to maximum Life' },
    // { id: 'explicit.stat_2901986750', name: '#% to all Elemental Resistances' },
]

/**
 * Parses item stats from clipboard data.
 * @param itemData - The raw clipboard text
 * @returns An object with parsed stats
 */
export function parseItemStats(
    itemData: string,
): Record<string, { value: number | [number, number]; type: string }> {
    const statsFound: Record<string, { value: number | [number, number]; type: string }> = {}

    statArray.forEach((stat) => {
        const statRegex = new RegExp(
            stat.name.replace('#', stat.isRange ? '(\\d+-\\d+)' : '([-+]?\\d+(?:\\.\\d+)?)'),
        )

        const match = itemData.match(statRegex)

        if (match) {
            let value: number | [number, number]
            if (stat.isRange) {
                const [min, max] = match[1].split('-').map(Number)
                value = [min, max]
            } else {
                value = parseFloat(match[1])
            }

            statsFound[stat.id] = { value, type: stat.isRange ? 'range' : 'single' }
        }
    })

    return statsFound
}

/**
 * Builds the query payload from parsed stats.
 * @param statsFound - Parsed stats from `parseItemStats`
 * @returns A query payload object or null if invalid
 */
export function buildQueryPayload(
    statsFound: Record<string, { value: number | [number, number]; type: string }>,
): object | null {
    if (!statsFound || Object.keys(statsFound).length === 0) {
        return null // Invalid payload
    }

    const filters = Object.entries(statsFound).map(([statId, stat]) => ({
        id: statId,
        disabled: false,
        value: { min: stat.type === 'single' ? stat.value : stat.value[0] },
    }))

    return {
        query: {
            status: { option: 'online' },
            stats: [
                {
                    type: 'and',
                    filters,
                },
            ],
        },
        sort: { price: 'asc' },
    }
}

/**
 * Processes clipboard text to parse stats and generate payload.
 * @param clipboardText - The raw clipboard text
 * @returns An object with parsed stats and the generated payload, or an error message if invalid
 */
export function processClipboardText(clipboardText: string): {
    stats: Record<string, { value: number | [number, number]; type: string }>
    payload: object | null
    error: string | null
} {
    const stats = parseItemStats(clipboardText)

    if (!stats || Object.keys(stats).length === 0) {
        return { stats, payload: null, error: 'No valid stats found in the clipboard content.' }
    }

    const payload = buildQueryPayload(stats)
    if (!payload) {
        return { stats, payload: null, error: 'Failed to generate a valid payload from the stats.' }
    }

    return { stats, payload, error: null }
}
