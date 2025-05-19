import { CategoryEntity } from '@tea-house/types';
import { CatalogItemSmall } from '../CatalogItemSmall/CatalogItemSmall';
// import styles from './Subcategory.module.scss';
import { useNavigate, useParams } from 'react-router';

export function SubCategory({
    category,
}: {
    category: CategoryEntity | undefined;
}) {
    const { order, categoryId } = useParams();
    const navigate = useNavigate();
    return (
        <>
            {category?.subcategories.map((val, ind) => (
                <div id={ind.toString()} key={ind}>
                    <h2>{val.name}</h2>
                    {val.products.map((product, i) => (
                        <div
                            key={i}
                            onClick={() =>
                                navigate(
                                    `/main/${order}/${categoryId}/${product.id}`,
                                )
                            }
                        >
                            <CatalogItemSmall
                                product={product}
                                navigateTo={`/main/${order}/${categoryId}/${product.id}`}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}
