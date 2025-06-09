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
        <div className={styles.toggleButtonWrapper}>
            <div
                onClick={() => {
                    if (state) {
                        navigate('/o/all');
                    } else {
                        navigate('/t/t');
                    }
                }}
                className={combineStyles(
                    styles.toggleButton,
                    state ? styles.active : '',
                )}
                id="toggleButton"
            >
                <div className={styles.slider}></div>
                <div
                    className={combineStyles(
                        styles.text,
                        !state ? styles.textActive : '',
                    )}
                >
                    {'В чайной'}
                </div>
                <div
                    className={combineStyles(
                        styles.text,
                        state ? styles.textActive : '',
                    )}
                >
                    {'Доставка'}
                </div>
            </div>
        </div>
    );
});
