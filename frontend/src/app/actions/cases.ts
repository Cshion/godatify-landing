'use server';

import { api } from '@/lib/api';

export async function getMoreCases(offset: number, limit: number) {
    return await api.cases.getCases({ start: offset, limit });
}
