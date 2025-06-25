import { openTelegramLink } from '@telegram-apps/sdk-react';
import styles from './SharePhone.module.scss';

export function SharePhonePage() {
    return (
        <>
            <div className={styles.backGroundImage} />
            <div className={styles.mainWrapper}>
                <div className={styles.mainBlock}>
                    <span>Поделитесь номером</span>
                    <span>________________________________________</span>
                    <span>
                        В чате с ботом нажмите на кнопку “Отправить номер”
                    </span>
                    <div
                        onClick={() => {
                            if (openTelegramLink.isAvailable()) {
                                openTelegramLink('https://t.me/oichai_bot');
                            }
                        }}
                    >
                        ПОДЕЛИТЬСЯ НОМЕРОМ
                    </div>
                    <span>
                        Мы используем ваш номер исключительно для идентификации
                        в боте - загружаем вашу информацию:
                        <li>Чайный дневник</li>
                        <li>Персональные скидки</li>
                        <li>Историю заказов</li>
                    </span>
                </div>
            </div>
        </>
    );
}
