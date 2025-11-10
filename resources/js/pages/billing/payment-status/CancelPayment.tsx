import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

export default function CancelPaymentPage() {
  const handleGoBack = () => {
    router.visit(route("billing.now")); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center space-y-6">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-800">Payment Cancelled</h1>
        <p className="text-gray-600">
          Your payment has been cancelled. You can return to the billing page to try again.
        </p>

        <Button
          className="w-full"
          size="lg"
          onClick={handleGoBack}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
