import styles from './ToggleButton.module.scss';
import { useNavigate } from 'react-router';
import { combineStyles } from '#utils/styles.js';
import { memo } from 'react';

export const ToggleButton = memo(function ToggleButton({
    state,
}: {
    state: boolean;
}) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => {
                if (state) {
                    navigate('/main/o/all');
                } else {
                    navigate('/main/t/t');
                }
            }}
            className={combineStyles(
                styles.toggleButton,
                state ? styles.active : '',
            )}
            id="toggleButton"
        >
            <div className={styles.slider}></div>
            <div className={styles.text}>{'В чайной'}</div>
            <div className={styles.text}>{'Доставка'}</div>
        </div>
    );
});
