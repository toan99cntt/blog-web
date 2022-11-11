import { Notify } from 'quasar'

export const pushNotify = (type: string, message: string) => {
    let color;
    switch (type) {
        case 'success':
            color = 'positive';
            break;
        case 'warning':
            color = 'warning';
            break;
        case 'danger':
            color = 'negative';
            break;
        default:
            color = 'info';
            break;
    }
    Notify.create({
        message: message,
        color
    });
};
