export const deliveryToHours = (delivery) => {
    let deliveryDates = delivery;
    let startDate;
    let endDate;
    if (deliveryDates.length !== 0) {
        deliveryDates = deliveryDates.replace('Entrega ', '');
        startDate = new Date(deliveryDates.split(' - ')[0].split('/').reverse().join('-'));
        endDate = new Date(deliveryDates.split(' - ')[1].split('/').reverse().join('-'));
    }
    return (endDate - startDate) / (60 * 60 * 1000);
};

export const disponibleToInStock = (availability) => {
    let newAvailabilty = availability;
    if (availability && availability.toLowerCase() === 'Disponible online'.toLocaleLowerCase()) {
        newAvailabilty = 'In Stock';
    } else {
        newAvailabilty = 'Out of Stock';
    }
    return newAvailabilty;
};
