import { ScrollWrapper } from '#components/Basket/ScrollWrapper/ScrollWrapper.js';
import { PageName } from '#components/Common/PageName/PageName.js';
import { FormInput } from '#components/Processing/FormInput/FormInput.js';
import { SaveAddressButton } from '#components/User/SaveAddressButton/SaveAddressButton.js';
import { OrderInfo } from '#utils/utils.js';
import { ChangeEvent, useReducer, useState } from 'react';

export function AddressPage() {
    const o = localStorage.getItem('orderInfoGlobal');
    if (!o) return;
    const order: OrderInfo = JSON.parse(o);
    const [firstName, setFirstName] = useState(order.firstname);
    const [lastName, setLastName] = useState(order.lastname);
    const [patronymic, setPatronymic] = useState(order.patronymic);
    const [phone, setPhone] = useState(order.phone);
    const [address, setAddress] = useState(order.address);
    const [comment, setComment] = useState(order.comment);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const haveChange =
        order.address != address ||
        order.comment != comment ||
        order.firstname != firstName ||
        order.lastname != lastName ||
        order.patronymic != patronymic ||
        order.phone != phone;

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

    const saveLocal = () => {
        const o = localStorage.getItem('orderInfoGlobal');
        if (!o) return;
        const order: OrderInfo = JSON.parse(o);
        order.address = address;
        order.comment = comment;
        order.firstname = firstName;
        order.lastname = lastName;
        order.patronymic = patronymic;
        order.phone = phone;
        localStorage.setItem('orderInfoGlobal', JSON.stringify(order));
        localStorage.setItem('orderInfo', JSON.stringify(order));
        forceUpdate();
    };

    return (
        <>
            <PageName name={'Адрес доставки'} />
            <ScrollWrapper aaah={true}>
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
                    onChange={(e) =>
                        setAddress(e.target.value.substring(0, 100))
                    }
                    value={address}
                />
                <FormInput
                    text="Комментарий к заказу. Здесь можете написать, если хотите доставку чая не в пункт выдачи, а напрямую курьером."
                    multirow={true}
                    onChange={(e) =>
                        setComment(e.target.value.substring(0, 200))
                    }
                    value={comment}
                />
                <SaveAddressButton inactive={!haveChange} onClick={saveLocal} />
            </ScrollWrapper>
        </>
    );
}
