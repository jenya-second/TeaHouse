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
                    <span
                        style={{
                            margin: '5vw',
                            fontFamily: 'Papyrus',
                            fontSize: 'large',
                        }}
                    >
                        {val.name}
                    </span>
                    {val.products.map((product) => (
                        <div
                            key={product.nomNumber}
                            onClick={() =>
                                navigate(
                                    `/${order}/${categoryId}/${product.id}`,
                                )
                            }
                        >
                            <CatalogItemSmall
                                product={product}
                                showCounter={order == 't'}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}
