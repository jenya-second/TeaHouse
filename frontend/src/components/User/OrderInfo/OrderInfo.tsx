import { Comment, OrderInProgressEntity } from '@tea-house/types';
import styles from './OrderInfo.module.scss';

export function OrderInfo({ order }: { order: OrderInProgressEntity }) {
    const firstName = order.client.name.split(' ')[1];
    const lastName = order.client.name.split(' ')[0];
    const patronymic = order.client.name.split(' ')[2];

    let comment: Comment;
    try {
        comment = JSON.parse(order.comment);
    } catch (_) {
        comment = {
            Фамилия: lastName,
            Имя: firstName,
            Отчество: patronymic,
            Коментарий: order.comment,
            Телефон: '',
        };
    }

    const ifDelivery = (
        <>
            <div>
                <span>Телефон:</span>
                <span>{comment.Телефон}</span>
            </div>
            <div>
                <span>Адрес доставки:</span>
                <span>{order.address}</span>
            </div>
            <div>
                <span>Комментарий:</span>
                <span>{comment.Коментарий}</span>
            </div>
        </>
    );
    const ifPickup = (
        <div className={styles.shedule}>
            <p>Дубна, ул. Молодёжная 10</p>
            <p>Понедельник 11:00 - 22:00</p>
            <p>
                Вторник <span>ВЫХОДНОЙ</span>
            </p>
            <p>Среда 11:00 - 22:00</p>
            <p>Четверг 11:00 - 22:00</p>
            <p>Пятница 11:00 - 22:00</p>
            <p>Суббота 11:00 - 22:00</p>
            <p>Воскресенье 11:00 - 22:00</p>
        </div>
    );

    return (
        <div className={styles.main}>
            <div>
                <span>Способ получения:</span>
                <span>{order.isPickup ? 'Самовывоз' : 'Доставка'}</span>
            </div>
            <div>
                <span>Фамилия:</span>
                <span>{comment.Фамилия}</span>
            </div>
            <div>
                <span>Имя:</span>
                <span>{comment.Имя}</span>
            </div>
            {comment.Отчество.length != 0 && (
                <div>
                    <span>Отчество:</span>
                    <span>{comment.Отчество}</span>
                </div>
            )}
            {order.isPickup ? ifPickup : ifDelivery}
        </div>
    );
}
