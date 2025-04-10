import { ToggleButton } from '#components/Common/ToggleButton/ToggleButton.js';
import { CatalogType, CatalogTypeContext } from '#utils/contexts.js';
import { GetProductsRequest } from '#utils/requests.js';
import { CategoryEntity } from '@tea-house/types';
import { useState, useEffect, useMemo } from 'react';
import { Category } from '../Category';
import styles from './CatalogMain.module.scss';

export function CatalogMain() {
    const [categories, setCategories] = useState<CategoryEntity[] | null>(null);
    const [catalogType, setCatalogType] = useState<CatalogType>('В чайной');
    useEffect(() => {
        GetProductsRequest().then(setCategories);
    }, []);

    const [teaCat, allCat] = useMemo((): [
        CategoryEntity[],
        CategoryEntity[],
    ] => {
        const newCategories: CategoryEntity[] = [];
        const teaCat: CategoryEntity[] = [];
        const allCat: CategoryEntity[] = [];
        for (const category of categories ?? []) {
            if (!category.parentCategory) {
                newCategories.push(category);
                if (category.name == 'Чай') {
                    teaCat.push(category);
                } else {
                    allCat.push(category);
                }
            }
        }
        for (const category of newCategories) {
            const subcategories: CategoryEntity[] = [];
            for (const sub of category.subcategories) {
                const subcat = categories?.find((c) => c.id == sub.id);
                if (subcat) {
                    subcategories.push(subcat);
                }
            }
            category.subcategories = subcategories;
        }
        return [teaCat, allCat];
    }, [categories]);

    return (
        <>
            <div className={styles.toggleButtonWrapper}>
                <ToggleButton
                    onToggle1={() => {
                        setCatalogType('Доставка');
                    }}
                    onToggle2={() => {
                        setCatalogType('В чайной');
                    }}
                    textLeft="В чайной"
                    textRight="Доставка"
                />
            </div>
            <CatalogTypeContext.Provider value={catalogType}>
                {(catalogType == 'В чайной' ? teaCat : allCat).map(
                    (category, ind) => {
                        return <Category key={ind} category={category} />;
                    },
                )}
            </CatalogTypeContext.Provider>
        </>
    );
}
