import { CategoryEntity } from '@tea-house/types';
import { useEffect, useMemo, useState } from 'react';
import { Category } from '../components/Catalog/Category';
import { CatalogType, CatalogTypeContext } from '../utils/contexts';
import { ToggleButton } from '../components/ToggleButton';

export function CatalogPage() {
    const [categories, setCategories] = useState<CategoryEntity[] | null>(null);
    const [catalogType, setCatalogType] = useState<CatalogType>('В чайной');
    useEffect(() => {
        fetch('http://localhost:1234/product/all')
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                setCategories(res);
            });
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
            <CatalogTypeContext.Provider value={catalogType}>
                <ToggleButton
                    onToggle1={() => {
                        setCatalogType('Доставка');
                    }}
                    onToggle2={() => {
                        setCatalogType('В чайной');
                    }}
                />
                {(catalogType == 'В чайной' ? teaCat : allCat).map(
                    (category, ind) => {
                        return <Category key={ind} category={category} />;
                    },
                )}
            </CatalogTypeContext.Provider>
        </>
    );
}
