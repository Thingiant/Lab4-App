import { THEME_KEY } from '@/constants/atom-keys';
import { atomWithMMKV } from '@/services/storage';

export const themeAtom = atomWithMMKV<'light' | 'dark' | 'system'>(THEME_KEY, 'system');
