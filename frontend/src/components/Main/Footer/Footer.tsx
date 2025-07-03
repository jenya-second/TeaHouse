import { EndPhrases } from '#constants/mainPagePahrases.js';
import styles from './Footer.module.scss';

export function Footer() {
    return (
        <>
            <div className={styles.phrase1}>{EndPhrases.end1}</div>
            <div className={styles.phrase2}>{EndPhrases.end2}</div>
            <div className={styles.phrase2}>ТГ: @zaraza_mo</div>
            <div className={styles.footerWrap}>
                <div>
                    <img src="/dragon.svg" />
                </div>
                <div
                    onClick={() => {
                        window.scroll({ left: 0, top: 0, behavior: 'smooth' });
                    }}
                >
                    <img src="/arrowUp.svg" />
                </div>
                <div className={styles.dragon2}>
                    <img src="/dragon.svg" />
                </div>
            </div>
        </>
    );
}
