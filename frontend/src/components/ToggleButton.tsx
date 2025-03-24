import { useEffect } from 'react';
import styles from './ToggleButton.module.scss';

export function ToggleButton(props: {
    onToggle1: () => any;
    onToggle2: () => any;
}) {
    useEffect(() => {
        const toggleButton = document.getElementById('toggleButton');
        toggleButton?.addEventListener('click', function () {
            toggleButton.classList.toggle(styles.active);

            if (toggleButton.classList.contains(styles.active)) {
                props.onToggle1();
            } else {
                props.onToggle2();
            }
        });
    }, []);

    return (
        <div className={styles.toggleButton} id="toggleButton">
            <div className={styles.slider}></div>
        </div>
    );
}
