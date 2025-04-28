import { combineStyles } from '#utils/styles.js';
import { useNavigate } from 'react-router';
import styles from './BackButton.module.scss';

export function BackButton({ name = 'Назад' }: { name?: string }) {
    const navigate = useNavigate();
    return (
        <div
            className={combineStyles(styles.button, styles.outShadow)}
            onClick={() => {
                navigate(-1);
            }}
        >
            <img src="/backIcon.svg" />
            {name}
        </div>
    );
}
