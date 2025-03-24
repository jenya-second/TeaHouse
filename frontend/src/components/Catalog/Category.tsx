import { CategoryEntity } from '@tea-house/types';
import { CatalogItemSmall } from './CatalogItemSmall';
import { SubCategory } from './Subcategory';

export function Category(props: { category: CategoryEntity }) {
    return (
        <>
            <h1 key={props.category?.id}>{props.category.name}</h1>
            {props.category.subcategories.map((subcategory, i) => (
                <SubCategory key={i} category={subcategory} />
            ))}
            {props.category.products.map((product, i) => (
                <CatalogItemSmall key={i} product={product} />
            ))}
        </>
    );
}
