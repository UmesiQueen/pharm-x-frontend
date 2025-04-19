import type { EntityDetailsResults } from '@/app/dashboard/stakeholders/types';

export const EntityDetailsFactory = (data: EntityDetailsResults) => {
    return data ?? [
        "",
        "",
        "",
        "",
        0,
        false,
        0n,
    ]
}
