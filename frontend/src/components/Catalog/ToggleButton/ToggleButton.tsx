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
                className={combineStyles(
                    styles.toggleButton,
                    state ? styles.active : '',
                )}
                id="toggleButton"
            >
                <div className={styles.slider}></div>
                <div
                    onClick={() => navigate('/o/all', { replace: true })}
                    className={combineStyles(
                        styles.text,
                        !state ? styles.textActive : '',
                    )}
                >
                    {'В чайной'}
                </div>
                <div
                    onClick={() => navigate('/t/all', { replace: true })}
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
