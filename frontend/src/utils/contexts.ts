import { createContext } from 'react';

export type CatalogType = 'Доставка' | 'В чайной';
export const CatalogTypeContext = createContext<CatalogType>('Доставка');
