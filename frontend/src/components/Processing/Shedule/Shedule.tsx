import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { PostNewOrder } from '#utils/requests.js';
import { Delivery } from '@tea-house/types';
import { ChangeEvent, useState } from 'react';
import styles from './Shedule.module.scss';
import { CostBar } from '../CostBar/CostBar';
import { ConfirmButton } from '../ConfirmButton/ConfirmButton';
import { FormInput } from '../FormInput/FormInput';
import { usePopUp } from '#components/Common/PopUp/PopUp.js';
import { GrammCount, ProductCost } from '#utils/utils.js';
import { deleteAll } from '#redux/basket.js';
import { useNavigate } from 'react-router';

export function Shedule() {
    const products = useAppSelector((state) => state.basket.value);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [PopUp, showPopUp] = usePopUp();
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSetValue = (
        e: ChangeEvent<HTMLTextAreaElement>,
        fun: (value: string) => void,
    ) => {
        if ((e.nativeEvent as InputEvent)?.inputType == 'insertLineBreak') {
            e.target.blur();
            return;
        }
        fun(e.target.value.replace(' ', '').substring(0, 20));
    };

    let cost = 0;
    products.forEach((val) => {
        cost += ProductCost(val);
    });

    const validateForm = () => {
        return firstName.length > 1 && lastName.length > 1;
    };

    const sendOrder = async () => {
        if (sending) return;
        if (!validateForm()) {
            showPopUp('Пожалуйста, заполните все поля в форме');
            return;
        }
        setSending(true);
        const delivery: Delivery = {
            client: {
                name: firstName,
                lastname: lastName,
                surname: patronymic,
                phone: '',
            },
            delivery: {
                address: '',
                comment: '',
            },
            isPickup: true,
            nomenclatures: products.map((val) => {
                return {
                    count: GrammCount(val),
                    nomNumber: val.product.nomNumber,
                };
            }),
        };
        const req = await PostNewOrder(delivery);
        if (!req || !req.ok) {
            showPopUp('Произошла ошибка, повторите попытку позже');
            setSending(false);
            return;
        }
        dispatch(deleteAll());
        navigate('/user/history');
    };

    return (
        <>
            {PopUp}
            <FormInput
                text="Фамилия*"
                multirow={false}
                onChange={(e) => handleSetValue(e, setLastName)}
                value={lastName}
            />
            <FormInput
                text="Имя*"
                multirow={false}
                onChange={(e) => handleSetValue(e, setFirstName)}
                value={firstName}
            />
            <FormInput
                text="Отчество"
                multirow={false}
                onChange={(e) => handleSetValue(e, setPatronymic)}
                value={patronymic}
            />
            <div className={styles.textWrap}>
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
            <CostBar cost={cost} delivery={0} />
            <ConfirmButton sending={sending} onClick={sendOrder} />
        </>
    );
}
