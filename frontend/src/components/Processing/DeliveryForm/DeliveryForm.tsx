import { useAppDispatch, useAppSelector } from '#redux/index.js';
import { PostNewOrder } from '#utils/requests.js';
import { Delivery } from '@tea-house/types';
import { ChangeEvent, useEffect, useState } from 'react';
import { CostBar } from '../CostBar/CostBar';
import { ConfirmButton } from '../ConfirmButton/ConfirmButton';
import { FormInput } from '../FormInput/FormInput';
import { usePopUp } from '#components/Common/PopUp/PopUp.js';
import { useNavigate } from 'react-router';
import { deleteAll } from '#redux/basket.js';
import { GrammCount, OrderInfo } from '#utils/utils.js';

export function DeliveryForm() {
    const products = useAppSelector((state) => state.basket.value);
    const o = localStorage.getItem('orderInfo');
    if (!o) return;
    const order: OrderInfo = JSON.parse(o);
    const [firstName, setFirstName] = useState(order.firstname);
    const [lastName, setLastName] = useState(order.lastname);
    const [patronymic, setPatronymic] = useState(order.patronymic);
    const [phone, setPhone] = useState(order.phone);
    const [address, setAddress] = useState(order.address);
    const [comment, setComment] = useState(order.comment);
    const [PopUp, showPopUp] = usePopUp();
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    let cost = 0;
    products.forEach((val) => {
        cost += val.product.press
            ? (val.count * val.product.cost * val.product.pressAmount) /
              (val.product.pressAmount >= 200 ? 2 : 1)
            : val.count * val.product.cost * 25;
    });

    const validateForm = () => {
        return (
            firstName.length > 1 &&
            lastName.length > 1 &&
            phone.length == 12 &&
            address.length > 1
        );
    };

    const saveLocal = () => {
        const o = localStorage.getItem('orderInfo');
        if (!o) return;
        const order: OrderInfo = JSON.parse(o);
        order.address = address;
        order.comment = comment;
        order.firstname = firstName;
        order.lastname = lastName;
        order.patronymic = patronymic;
        order.phone = phone;
        localStorage.setItem('orderInfo', JSON.stringify(order));
    };

    const handlePhoneInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const validChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        const val = e.target.value;
        let p = '+7';
        if (!val.startsWith('+7')) setPhone('+7');
        for (let i = 2; i < val.length; i++) {
            if (val[i] in validChars) p += val[i];
        }
        if (p.length > 12) p = p.substring(0, 12);
        setPhone(p);
    };

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
                phone: phone,
            },
            delivery: {
                address: address,
                comment: comment,
            },
            isPickup: false,
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
        localStorage.setItem(
            'orderInfo',
            localStorage.getItem('orderInfo') ?? '{}',
        );
        navigate('/user/history');
    };

    useEffect(() => saveLocal());

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
            <div
                onFocus={() => {
                    if (phone.length < 1) setPhone('+7');
                }}
            >
                <FormInput
                    text="Телефон*"
                    multirow={false}
                    onChange={handlePhoneInput}
                    value={phone}
                />
            </div>
            <FormInput
                text="Введите адрес доставки...*"
                multirow={true}
                onChange={(e) => setAddress(e.target.value.substring(0, 100))}
                value={address}
            />
            <FormInput
                text="Комментарий к заказу. Здесь можете написать, если хотите доставку чая не в пункт выдачи, а напрямую курьером."
                multirow={true}
                onChange={(e) => setComment(e.target.value.substring(0, 200))}
                value={comment}
            />
            <CostBar cost={cost} />
            <ConfirmButton sending={sending} onClick={sendOrder} />
        </>
    );
}
