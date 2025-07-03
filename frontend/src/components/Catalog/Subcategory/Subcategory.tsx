import { CatalogItemSmall } from '../CatalogItemSmall/CatalogItemSmall';
// import styles from './Subcategory.module.scss';
import { useNavigate, useParams } from 'react-router';
import { joke } from '#pages/TeaPal.js';

export function SubCategory({ category }: { category: joke | undefined }) {
    const { order, categoryId } = useParams();
    const navigate = useNavigate();
    return (
        <>
            {category?.mySubcat.map((val, ind) => (
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
                    {val.myProducts.map((product) => (
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
                                rank={product.rank}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}
