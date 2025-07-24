import { useNavigate } from 'react-router';
import styles from './UserCategories.module.scss';

export function UserCategories({
    categories,
}: {
    categories: { name: string; route: string; image: string }[];
}) {
    const navigate = useNavigate();
    return (
        <div className={styles.wrapper}>
            {categories.map((val, i) => (
                <div
                    style={{ backgroundImage: `url(/${val.image}.jpg)` }}
                    onClick={() => navigate(val.route)}
                    key={i}
                    className={styles.item}
                >
                    <span>{val.name}</span>
                </div>
            ))}
        </div>
    );
}
