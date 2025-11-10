import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

export default function SuccessPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
        <p className="text-gray-600">
          Thank you for your payment. Your reservation has been confirmed.
        </p>

        <div className="space-y-4">
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.visit(route('/'))}
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.visit(route("/summary-page"))}
          >
            View Reservation
          </Button>
        </div>
      </div>
    </div>
  );
}
