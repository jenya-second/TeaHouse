import styles from './OrderToggle.module.scss';
import { combineStyles } from '#utils/styles.js';

export function OrderToggle({
    state,
    setState,
}: {
    state: 1 | 2 | 3;
    setState: (state: 1 | 2 | 3) => void;
}) {
    const names = ['В обработке', 'На оплату', 'Выполненные'];

    return (
        <div className={styles.toggleButton}>
            <div
                style={{ left: `${((state - 1) * 100) / 3}%` }}
                className={styles.slider}
            ></div>
            <div
                onClick={() => setState(1)}
                className={combineStyles(
                    styles.text,
                    state == 1 ? styles.textActive : '',
                )}
            >
                {names[0]}
            </div>
            <div
                onClick={() => setState(2)}
                className={combineStyles(
                    styles.text,
                    state == 2 ? styles.textActive : '',
                )}
            >
                {names[1]}
            </div>
            <div
                onClick={() => setState(3)}
                className={combineStyles(
                    styles.text,
                    state == 3 ? styles.textActive : '',
                )}
            >
                {names[2]}
            </div>
        </div>
    );
}
