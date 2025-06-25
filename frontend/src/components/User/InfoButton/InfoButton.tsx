import { useState } from 'react';
import styles from './InfoButton.module.scss';

export function InfoButton({ m1, m2 }: { m1: string; m2: string }) {
    const [showMessage, setShowMessage] = useState(false);

    return (
        <>
            <div
                className={styles.infoButton}
                onClick={() => setShowMessage(!showMessage)}
            />
            {showMessage && (
                <div className={styles.infoModal}>
                    <span>{m1}</span>
                    <span>{m2}</span>
                    <span onClick={() => setShowMessage(false)}>
                        {'Хорошо'}
                    </span>
                </div>
            )}
        </>
    );
}
