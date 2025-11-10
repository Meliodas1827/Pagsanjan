import React from "react"

interface CustomerInfoProps {
  formData: {
    firstName?: string
    lastName?: string
    country?: string
    state?: string
    street?: string
    city?: string
    zip?: string
    phone?: string
  }
}

const CustomerInfoDisplay: React.FC<CustomerInfoProps> = ({ formData }) => {
  const fields = [
    { label: "First Name", value: formData.firstName },
    { label: "Last Name", value: formData.lastName },
    { label: "Country", value: formData.country },
    { label: "State", value: formData.state },
    { label: "Street", value: formData.street },
    { label: "City", value: formData.city },
    { label: "ZIP", value: formData.zip },
    { label: "Phone", value: formData.phone },
  ]

  return (
      <div className="p-6 grid grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">{field.label}</span>
            <h1 className="text-lg font-semibold text-gray-900">{field.value || "—"}</h1>
          </div>
        ))}
      </div>
  )
}

export default CustomerInfoDisplay
