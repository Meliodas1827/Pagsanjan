import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { router, useForm, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"

// Define the type for form data
interface ProfileFormData extends Record<string, any> {
    firstName?: string
    lastName?: string
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
    const name = props?.auth?.user.name;
    const parts = name.trim().split(" ");
    const first_name = parts[0] ?? "";
    const last_name = parts.length > 1 ? parts[parts.length - 1] : "";


    const { data, setData, post, errors, processing } = useForm<ProfileFormData>({
        firstName: first_name || '',
        lastName: last_name || '',
        country: '',
        province: '',
        street: '',
        city: '',
        zip: '',
        phone: '',
        terms: false,
    })

    const handleChange = (field: keyof ProfileFormData, value: string | boolean) => {
        setData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Submitted Data:", data);

        const formatted = {
            first_name: data.firstName,
            last_name: data.lastName,
            address: [data.street, data.city, data.province, data.country].filter(Boolean).join(', '),
            phone: data.phone
        };
        router.post(route('profile.post'), formatted, {
            replace: true,
            onSuccess: () => {
                router.visit(route('welcome'), { replace: true });
            },
            onError: () => console.log('errors'),
        })


    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-md rounded-2xl mt-6">
            <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-6">Customer Profile</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={data.firstName || ""}
                            onChange={e => handleChange("firstName", e.target.value)}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={data.lastName || ""}
                            onChange={e => handleChange("lastName", e.target.value)}
                        />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            value={data.country || ""}
                            onChange={e => handleChange("country", e.target.value)}
                        />
                    </div>

                    {/* Province */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="province">Province</Label>
                        <Input
                            id="province"
                            value={data.province || ""}
                            onChange={e => handleChange("province", e.target.value)}
                        />
                    </div>

                    {/* Street */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="street">Street</Label>
                        <Input
                            id="street"
                            value={data.street || ""}
                            onChange={e => handleChange("street", e.target.value)}
                        />
                    </div>

                    {/* City */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            value={data.city || ""}
                            onChange={e => handleChange("city", e.target.value)}
                        />
                    </div>

                    {/* Zip */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="zip">ZIP</Label>
                        <Input
                            id="zip"
                            value={data.zip || ""}
                            onChange={e => handleChange("zip", e.target.value)}
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={data.phone || ""}
                            onChange={e => handleChange("phone", e.target.value)}
                        />
                    </div>

                    {/* Terms and Conditions */}
                    <div className="col-span-2 flex items-center space-x-2 mt-4">
                        <Checkbox
                            id="terms"
                            checked={data.terms || false}
                            onCheckedChange={(checked: boolean) => handleChange("terms", checked)}
                        />
                        <Label htmlFor="terms">I agree to the Terms and Conditions</Label>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-2 flex justify-end mt-6">
                        <Button type="submit" className="w-full sm:w-auto">
                            Save Profile
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default ProfilePage
