import { CategoryEntity } from '@tea-house/types';
import { CatalogItemSmall } from './CatalogItemSmall/CatalogItemSmall';

export function SubCategory(props: { category: CategoryEntity }) {
    return (
        <>
            <h2 key={props.category?.id}>{props.category.name}</h2>
            {props.category.products.map((product, i) => (
                <CatalogItemSmall key={i} product={product} />
            ))}
        </>
    );
}
