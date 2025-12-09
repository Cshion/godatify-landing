'use server';

import { api } from '@/lib/api';
import { BlogPost } from '@/types';

export async function getMorePosts(offset: number, limit: number) {
    return await api.blog.getPosts({ start: offset, limit });
}
