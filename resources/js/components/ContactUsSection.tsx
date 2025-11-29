import { Phone } from 'lucide-react';

interface ContactInfo {
    name: string;
    numbers: string[];
}

const contactData: ContactInfo[] = [
    {
        name: 'OFFICE OF THE MAYOR',
        numbers: ['0961.476.4335', '0926.167.2920'],
    },
    {
        name: 'PAGSANJAN TOURISM, CULTURE AND ARTS OFFICE',
        numbers: ['(049) 501.5880'],
    },
    {
        name: 'PAGSANJAN POLICE STATION',
        numbers: ['(049) 501.7356'],
    },
    {
        name: 'PAGSANJAN FIRE STATION',
        numbers: ['(049) 557.7144'],
    },
    {
        name: 'PAGSANJAN HEALTH CENTER',
        numbers: ['(049) 539.3110'],
    },
    {
        name: 'PAGSANJAN MEDICAL CLINIC',
        numbers: ['(049) 501.4228'],
    },
    {
        name: 'CHRISTIAN GENERAL HOSPITAL',
        numbers: ['(049) 808.4051'],
    },
    {
        name: 'LAGUNA AAAWATER CORP.',
        numbers: ['0998.559.2306', '0917.868.4367'],
    },
    {
        name: 'FIRST LAGUNA ELECTRIC COOP. INC',
        numbers: ['0963.489.1333'],
    },
    {
        name: 'GSIS-PAGSANJAN',
        numbers: ['(049) 808.1239'],
    },
    {
        name: 'DIOCESAN SHRINE OF OUR LADY OF GUADALUPE',
        numbers: ['(049) 501.4121'],
    },
    {
        name: 'PAGSANJAN RESCUE TEAM',
        numbers: ['(049) 539.4005'],
    },
];

const ContactUsSection = () => {
    // Format phone number for tel: link (remove spaces, dots, parentheses)
    const formatPhoneForTel = (phone: string): string => {
        return phone.replace(/[\s().]/g, '');
    };

    return (
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                {/* Main Heading */}
                <h1 className="mb-8 text-center text-4xl font-bold uppercase text-teal-800 md:text-5xl">
                    Contact Us
                </h1>

                {/* Subheading */}
                <h2 className="mb-12 text-center text-xl font-bold uppercase text-teal-700 md:text-2xl">
                    Hotline Numbers
                </h2>

                {/* Contact Information List */}
                <div className="space-y-6">
                    {contactData.map((contact, index) => (
                        <div
                            key={index}
                            className="text-center leading-relaxed transition-transform duration-200 hover:scale-105"
                        >
                            {/* Contact Name */}
                            <p className="mb-2 text-base font-semibold text-teal-900 md:text-lg">
                                {contact.name}
                            </p>

                            {/* Contact Numbers */}
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {contact.numbers.map((number, numIndex) => (
                                    <span key={numIndex} className="flex items-center">
                                        <a
                                            href={`tel:${formatPhoneForTel(number)}`}
                                            className="text-sm text-teal-700 transition-colors duration-200 hover:text-teal-900 hover:underline md:text-base"
                                        >
                                            {number}
                                        </a>
                                        {numIndex < contact.numbers.length - 1 && (
                                            <span className="mx-2 text-teal-600">|</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Optional Contact Icon */}
                <div className="mt-12 flex justify-center">
                    <div className="rounded-full bg-teal-700 p-4">
                        <Phone className="h-8 w-8 text-white" />
                    </div>
                </div>

                {/* Additional Info */}
                <p className="mt-8 text-center text-sm text-gray-600 leading-relaxed">
                    For emergencies or inquiries, please don't hesitate to call any of the numbers above.
                    <br />
                    Our team is here to assist you.
                </p>
            </div>
        </div>
    );
};

export default ContactUsSection;
