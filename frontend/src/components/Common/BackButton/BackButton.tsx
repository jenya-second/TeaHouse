import { combineStyles } from '#utils/styles.js';
import styles from './BackButton.module.scss';

export function BackButton({ name = 'Назад' }: { name?: string }) {
    return (
        <div
            className={combineStyles(
                styles.button,
                styles.outShadow,
                styles.robotoFont,
            )}
        >
            <img src="/backIcon.svg" />
            {name}
        </div>
    );
}
