
export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string | Date) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPrice = (price: string | number) => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericPrice);
};

// Helper function to clean up amenities string
export const formatAmenities = (amenities: string) => {
  // Remove extra quotes and clean up the string
  return amenities.replace(/^"|"$/g, '').replace(/\\"/g, '"');
};