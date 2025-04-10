import { useEffect } from 'react';
import styles from './ToggleButton.module.scss';

export function ToggleButton({
    onToggle1,
    onToggle2,
    textLeft,
    textRight,
}: {
    onToggle1: () => any;
    onToggle2: () => any;
    textLeft: string;
    textRight: string;
}) {
    useEffect(() => {
        const toggleButton = document.getElementById('toggleButton');
        toggleButton?.addEventListener('click', function () {
            toggleButton.classList.toggle(styles.active);

            if (toggleButton.classList.contains(styles.active)) {
                onToggle1();
            } else {
                onToggle2();
            }
        });
    }, []);

    return (
        <div className={styles.toggleButton} id="toggleButton">
            <div className={styles.slider}></div>
            <div className={styles.text}>{textLeft}</div>
            <div className={styles.text}>{textRight}</div>
        </div>
    );
}
