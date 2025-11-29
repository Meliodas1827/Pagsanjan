import { Plus } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: 'Do you allow walk-in guests?',
        answer: 'Yes, we welcome walk-in guests! However, we highly recommend booking in advance to ensure availability, especially during peak seasons and holidays. Booking ahead guarantees your preferred accommodation and helps us provide you with the best possible service.',
    },
    {
        question: 'Are there checkpoints along the way?',
        answer: 'Yes, there are several checkpoints along the route to Pagsanjan Falls. These checkpoints are for safety and security purposes. Our experienced boatmen are familiar with all the checkpoints and will guide you through a safe and enjoyable journey.',
    },
    {
        question: 'Can we bring drinks inside?',
        answer: 'Yes, you are allowed to bring your own drinks. However, we encourage guests to help us maintain the cleanliness and beauty of the area by properly disposing of any waste. Please note that glass containers may be restricted in certain areas for safety reasons.',
    },
    {
        question: 'How do I confirm and pay for my booking?',
        answer: 'After submitting your booking request through our website, you will receive a confirmation email with payment instructions. You can pay through bank transfer, GCash, or PayMaya. Once payment is received and verified, you will receive a booking confirmation with all the details of your reservation.',
    },
    {
        question: 'Can we do early check-in or late check-out?',
        answer: 'Early check-in and late check-out are subject to availability. We recommend contacting us in advance to make arrangements. Additional charges may apply depending on the duration and availability. Our team will do their best to accommodate your schedule and ensure a comfortable stay.',
    },
];

interface FAQSectionProps {
    adminEmail?: string;
}

const FAQSection = ({ adminEmail = 'dasmelio564@gmail.com' }: FAQSectionProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Heading */}
                <h2 className="mb-12 text-center text-4xl font-bold text-gray-800 md:text-5xl">Frequently Asked Questions</h2>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-200 hover:shadow-md"
                        >
                            {/* Question Button */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-gray-50"
                                aria-expanded={openIndex === index}
                            >
                                <span className="pr-8 text-lg font-medium text-teal-800">{faq.question}</span>
                                <Plus
                                    className={`h-6 w-6 flex-shrink-0 text-teal-700 transition-transform duration-300 ${
                                        openIndex === index ? 'rotate-45' : ''
                                    }`}
                                />
                            </button>

                            {/* Answer */}
                            <div
                                className={`transition-all duration-300 ease-in-out ${
                                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="border-t border-gray-100 px-6 py-5 text-gray-700">{faq.answer}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-12 rounded-lg bg-white p-8 text-center shadow-md">
                    <h3 className="mb-2 text-2xl font-semibold text-gray-800">Still have a question?</h3>
                    <p className="mb-6 text-gray-600">Can't find the answer you're looking for? Please reach out to our friendly team.</p>
                    <a
                        href={`mailto:${adminEmail}`}
                        className="inline-block rounded-md bg-teal-700 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-teal-800"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
