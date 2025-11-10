// resources/js/components/TermsAndConditions.jsx

const TermsAndConditions = () => {
    const terms = [
        {
            title: 'BOOKING.',
            content:
                'Guests are required to make an advanced booking, walk-in guests are not allowed for the time being. The guests are also obliged to pay the full amount (accommodations and meals included) to confirm their reservation.',
        },
        {
            title: 'REBOOKING.',
            content:
                "Rebooking is allowed for reasons due to fortuitous events such as health issues, flight schedule changes, and emergencies, in which case, proof of circumstance is required for Management to validate the claim. Rescheduling must be done 5 working days prior to the date of arrival, otherwise rebooking may not be permitted. The Resort shall not be liable for the cancellation of bookings whether partial or in full due to force majeure, acts of God, or conditions beyond the Resort's control. Furthermore, the Resort will not be held liable for failure to carry out arrangements and other obligations due to the same circumstances. In such cases, the Resort must be granted a reasonable extension to perform arrangements or obligations. Rebooking is under the sole discretion of the Resort and will be considered without rebooking fee, but subject to availability, within six (6) months from the time of booking. The rate at the time of booking shall prevail. If a schedule shall be changed from a san period to a peak period, the price difference will be collected.",
        },
        {
            title: 'REGISTRATION.',
            content:
                'The Resort is only authorized to accommodate registered guests. For this purpose, guests are required to present their valid ID or any other valid proof of identity at the Front Desk.',
        },
        {
            title: 'MINORS.',
            content:
                'Guests aged under 18 years old and below are not allowed to stay at the Resort without their parent/s or guardian/s. Children aged 6 years old and below are free of charge but included in the room headcount.',
        },
        {
            title: 'SCHEDULED ARRIVAL.',
            content:
                'Room reservations will be held until 6:00PM on the day of arrival. If the guest is unable to use the room before the aforementioned time without prior notice, the rooms will be released and the payments will be forfeited.',
        },
        {
            title: 'EARLY CHECK-IN.',
            content:
                "This privilege is subject to availability. It is the responsibility of guests to inform the Resort of any changes in the details of their reservation as soon as possible. Failure to do so may result in the cancellation of the reservation without refund. The Resort will not be held liable for delays or other inconveniences that arise from the guest's failure to inform, in which case, the Resort must be granted an extension or arrangement.",
        },
        {
            title: 'STAY.',
            content:
                "Guests are to use their rooms for the agreed period only. The Resort gates are closed for all guests' visitors, any checked-in guest who would want to stay out of the Resort at the aforementioned period must inform the Resort beforehand. If the guest breaks their stay, payment will not be refunded.",
        },
        {
            title: 'CHECK-OUT.',
            content:
                'Guests can stay in their rooms during the agreed period only. Check-out should be done by 12:00NN on the last day of their stay unless otherwise stipulated in advance. They are obliged to vacate the room on later than the aforementioned time. Should guests desire to extend their stay, they shall inform the Front Desk at least 4 hours before the implemented check-out time. Likewise, if guests desire to shorten their stay, they shall inform the Front Desk at least 4 hours before the intended time of departure from the Resort. Guests are not entitled to any refund should they choose to terminate their stay earlier. The Resort may offer guests who ask to extend their stay a different room from the one which they occupied.',
        },
        {
            title: 'ROOM KEYS.',
            content:
                'Guests must take good care of their room keys. These must be deposited at the Front Desk at check-out or whenever they leave the premises. Should guests lose their keys, a fee of PHP 500 shall be charged for the cost of replacement.',
        },
        {
            title: 'PERSONAL BELONGINGS.',
            content:
                "The Resort is not liable for any loss of personal belongings should there be negligence on the part of the guest, and if there is no evidence upon investigation to warrant any mischief on the part of the Resort's staff. Guests are responsible for their personal belongings. They may keep their valuables inside their rooms which a safe is also provided. Doors may also be locked when needed.",
        },
        {
            title: 'DAMAGE AND REPAIR.',
            content:
                'Guests are not allowed to move the furniture inside the rooms. Likewise, interfering with the electrical network or any other installations in the rooms or in the Resort without the consent of the Management is strictly prohibited. If guests discover any damage or malfunction during their stay, they may report this to the Front Desk who will arrange for its repair.',
        },
        {
            title: 'WATER AND ENERGY CONSERVATION.',
            content:
                'Guests are obliged to turn off the faucets, lights, and appliances in the room when not in use. Windows and doors should be closed when the air conditioning unit is working. Doors must also be locked whenever guests leave the room.',
        },
        {
            title: 'LAUNDRY.',
            content:
                'Washing of clothes is not allowed inside the room. This is available upon request. Guests may contact the Front Desk to make arrangements.',
        },
        {
            title: 'DISTURBANCES.',
            content:
                'Guests must maintain the peace and quiet of the Resort. They are not to disturb other guests, especially between 10:00PM to 8:00AM.',
        },
        {
            title: 'SMOKING.',
            content: 'Smoking is not allowed inside the room for safety reasons.',
        },
        {
            title: 'PETS.',
            content: 'Guests who bring their pets will not be accommodated inside the resort.',
        },
        {
            title: 'MEDICAL ASSISTANCE.',
            content:
                'If a guest becomes ill or injured, the Resort will provide medical assistance or arrangements for the guest to be taken to a hospital (at the expense of the guest).',
        },
        {
            title: 'WAIVER.',
            content:
                'The Resort shall not be responsible for any death, physical injury, illness or loss and damage to property suffered by the guests and their companions, unless these arise from the fault or negligence of the Resort and its staff. Guests are required to sign a waiver, releasing the Resort from such liability.',
        },
        {
            title: 'MANAGEMENT RIGHTS.',
            content:
                'The Management reserves the right to refuse the entry or accommodation of any guest or visitor to the Resort and to request any guest to vacate their room at any moment without prior notice or explanation and without refund. The guest must vacate when requested. The Management has the authority to remove the luggage and belongings of guests and take possession of the room. This is only applicable to guests who breach these terms and conditions or those who threaten the safety of other guests and Resort staff.',
        },
        {
            title: 'FEEDBACK.',
            content: 'Comments and/or suggestions from guests are welcomed by the Management.',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl rounded-lg bg-white p-8 shadow-sm md:p-12">
                <h1 className="mb-2 text-center text-3xl font-light tracking-wide text-teal-700 md:text-4xl">Terms and Condition</h1>
                <h2 className="mb-12 text-center text-xl font-light text-teal-600 md:text-2xl">Strictly Implemented for Check-in Guests</h2>

                <div className="space-y-6 text-sm leading-relaxed text-gray-700">
                    {terms.map((term, index) => (
                        <div key={index}>
                            <span className="font-bold text-gray-800">{term.title}</span> <span className="text-gray-600">{term.content}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
