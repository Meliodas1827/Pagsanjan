import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { router, usePage, Head } from "@inertiajs/react"
import { SharedData } from "@/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react"
import AuthGlassLayout from "@/layouts/auth/auth-glass-layout"
import InputError from "@/components/input-error"

// Define the type for form data
interface ProfileFormData extends Record<string, any> {
    fullName?: string
    country?: string
    province?: string
    street?: string
    city?: string
    zip?: string
    phone?: string
    terms?: boolean
}

const ProfilePage = () => {
    const { props } = usePage<SharedData>();
    const fullName = props?.auth?.user.name || '';

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get errors from Inertia page props
    const errors = props.errors || {};

    // Debug: Log errors to see what's available
    console.log('Current errors from props:', errors);
    console.log('Flash messages:', props.flash);

    const [data, setDataState] = useState<ProfileFormData>({
        fullName: fullName,
        country: '',
        province: '',
        street: '',
        city: '',
        zip: '',
        phone: '',
        terms: false,
    })

    const handleChange = (field: keyof ProfileFormData, value: string | boolean) => {
        setDataState(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Client-side validation
        if (!data.terms) {
            alert('Please accept the Terms and Conditions to continue.');
            return;
        }

        // Validate address fields
        const addressParts = [data.street, data.city, data.province, data.zip, data.country].filter(Boolean);
        if (addressParts.length === 0) {
            alert('Please fill in at least one address field (Street, City, Province, Postal Code, or Country).');
            return;
        }

        // Split full name into first and last name
        const nameParts = (data.fullName || '').trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0] || '';

        const formatted = {
            first_name: firstName,
            last_name: lastName,
            address: addressParts.join(', '),
            phone: data.phone
        };

        // Debug: Log the data being sent
        console.log('Form data being submitted:', formatted);
        console.log('Original data:', data);

        setIsSubmitting(true);

        // Use router.post to send the formatted data
        router.post(route('profile.post'), formatted, {
            preserveState: true,
            preserveScroll: false, // Allow scroll to top on error
            onSuccess: (page) => {
                setIsSubmitting(false);
                console.log('Profile saved successfully!');
                // Success is handled by the backend redirect
            },
            onError: (errors) => {
                setIsSubmitting(false);
                console.error('Validation errors:', errors);
                // Scroll to top to show error message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    }

    return (
        <AuthGlassLayout
            title="Complete Your Profile"
            description="Please provide your information to continue"
        >
            <Head title="Complete Profile" />
            <div className="space-y-4">

                {/* Success/Error Messages */}
                {props.flash?.success && (
                    <Alert className="border-green-400/50 bg-green-500/20 backdrop-blur-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-300" />
                        <AlertDescription className="text-green-100">
                            {props.flash.success}
                        </AlertDescription>
                    </Alert>
                )}

                {props.flash?.warning && (
                    <Alert className="border-yellow-400/50 bg-yellow-500/20 backdrop-blur-sm">
                        <AlertCircle className="h-4 w-4 text-yellow-300" />
                        <AlertDescription className="text-yellow-100">
                            {props.flash.warning}
                        </AlertDescription>
                    </Alert>
                )}

                {props.flash?.info && (
                    <Alert className="border-blue-400/50 bg-blue-500/20 backdrop-blur-sm">
                        <AlertCircle className="h-4 w-4 text-blue-300" />
                        <AlertDescription className="text-blue-100">
                            {props.flash.info}
                        </AlertDescription>
                    </Alert>
                )}

                {Object.keys(errors).length > 0 && (
                    <Alert className="border-red-400/50 bg-red-500/20 backdrop-blur-sm">
                        <AlertCircle className="h-4 w-4 text-red-300" />
                        <AlertDescription className="text-red-100">
                            <strong>Please fix the following errors:</strong>
                            <ul className="list-disc list-inside mt-2">
                                {Object.entries(errors).map(([field, message]) => (
                                    <li key={field}>{message}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-white">
                            Full Name <span className="text-red-300">*</span>
                        </Label>
                        <Input
                            id="fullName"
                            value={data.fullName || ""}
                            onChange={e => handleChange("fullName", e.target.value)}
                            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                            placeholder="Enter your full name"
                            required
                            disabled={isSubmitting}
                        />
                        {(errors.first_name || errors.last_name) && (
                            <InputError message={errors.first_name || errors.last_name} className="text-red-300" />
                        )}
                    </div>

                    {/* Address Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Street */}
                        <div className="space-y-2">
                            <Label htmlFor="street" className="text-white">Street</Label>
                            <Input
                                id="street"
                                value={data.street || ""}
                                onChange={e => handleChange("street", e.target.value)}
                                className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                                placeholder="Street address"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-white">City</Label>
                            <Input
                                id="city"
                                value={data.city || ""}
                                onChange={e => handleChange("city", e.target.value)}
                                className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                                placeholder="City"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Province */}
                        <div className="space-y-2">
                            <Label htmlFor="province" className="text-white">Province</Label>
                            <Input
                                id="province"
                                value={data.province || ""}
                                onChange={e => handleChange("province", e.target.value)}
                                className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                                placeholder="Province"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Postal Code */}
                        <div className="space-y-2">
                            <Label htmlFor="zip" className="text-white">Postal Code</Label>
                            <Input
                                id="zip"
                                value={data.zip || ""}
                                onChange={e => handleChange("zip", e.target.value)}
                                className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                                placeholder="e.g., 4515"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Country */}
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="country" className="text-white">Country</Label>
                            <Input
                                id="country"
                                value={data.country || ""}
                                onChange={e => handleChange("country", e.target.value)}
                                className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                                placeholder="Country"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">
                            Phone <span className="text-red-300">*</span>
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={data.phone || ""}
                            onChange={e => handleChange("phone", e.target.value)}
                            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/30"
                            placeholder="Phone number"
                            required
                            disabled={isSubmitting}
                        />
                        {errors.phone && (
                            <InputError message={errors.phone} className="text-red-300" />
                        )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                            id="terms"
                            checked={data.terms || false}
                            onCheckedChange={(checked: boolean) => handleChange("terms", checked)}
                            className="border-white/30 data-[state=checked]:bg-white/20 data-[state=checked]:text-white"
                            disabled={isSubmitting}
                        />
                        <Label htmlFor="terms" className="cursor-pointer text-white text-sm">
                            I agree to the Terms and Conditions <span className="text-red-300">*</span>
                        </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full mt-4 border border-white/30 bg-[#203620]/50 font-medium text-white backdrop-blur-sm hover:bg-[#162516]/50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Profile'
                        )}
                    </Button>
                </form>
            </div>
        </AuthGlassLayout>
    )
}

export default ProfilePage
