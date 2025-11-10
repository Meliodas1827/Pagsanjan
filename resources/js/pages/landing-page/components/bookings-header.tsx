import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { JSX, useState } from "react";
import CancelBookingBtn from "@/pages/customer/components/cancel-booking";
import RefundBookingBtn from "@/pages/customer/components/refund-bookings";
import { SuccessDialog } from "@/components/toast/success-card-dialog";

export interface CancelationOption {
  can_cancel: boolean;
  can_refund: boolean;
  refund_deadline: string; // ISO date
}

interface BookingHeaderProps {
  id: number;
  bookingReference: string;
  bookingStatus: string;
  paymentStatus: string;
  title?: string;
  cancellationOptions: CancelationOption;
  payment_type: string;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "declined":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getStatusIcon = (status: string): JSX.Element => {
  switch (status) {
    case "accepted":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case "declined":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-gray-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

const canShowCancelBtn = (
  bookingStatus: string,
  paymentStatus?: string | null,
  paymentType?: string,
  options?: CancelationOption
): boolean => {
  if (!options?.can_cancel) return false;
  if (bookingStatus !== "pending" && bookingStatus !== "accepted") return false;
  if (paymentStatus === "refunded") return false;
  return true;
};

const canShowRefundBtn = (
  bookingStatus: string,
  paymentStatus?: string | null,
  options?: CancelationOption
): boolean => {
  if (!options?.can_refund) return false;
  if (bookingStatus === "accepted" && paymentStatus === "completed") {
    if (options.refund_deadline) {
      const now = new Date();
      const deadline = new Date(options.refund_deadline);
      return now <= deadline;
    }
    return true;
  }
  return false;
};

const BookingHeader: React.FC<BookingHeaderProps> = ({
  bookingReference,
  bookingStatus,
  cancellationOptions,
  paymentStatus,
  payment_type,
  id,
  title = "Booking Details",
}) => {
  const [successOpen, setSuccessOpen] = useState(false);
  const [successData, setSuccessData] = useState<{
    title: string;
    description: string;
    isRefund?: boolean;
  }>({
    title: "",
    description: "",
    isRefund: false
  });

  const handleBackToBookings = (): void => {
    window.history.back();
  };

  // Called when cancel succeeds
  const handleCancellationSuccess = (wasRefunded: boolean = false) => {
    console.log("handleCancellationSuccess called");
    setSuccessData({
      title: wasRefunded 
        ? "Booking Cancelled & Refund Requested!" 
        : "Booking Cancelled Successfully!",
      description: wasRefunded 
        ? "Your booking has been cancelled and a refund request has been submitted. You’ll receive your money within 3–5 business days." 
        : "Your booking has been cancelled successfully!",
      isRefund: wasRefunded
    });
    setSuccessOpen(true);
  };

  // Called when refund request succeeds
  const handleRefundSuccess = () => {
    // console.log("handleRefundSuccess called");
    setSuccessData({
      title: "Refund Request Submitted!",
      description: "Your refund request is being processed. You’ll receive your money within 1–2 business days.",
      isRefund: true
    });
    setSuccessOpen(true);
  };

  const showRefund = canShowRefundBtn(bookingStatus, paymentStatus, cancellationOptions);
  const showCancel = canShowCancelBtn(bookingStatus, paymentStatus, payment_type, cancellationOptions);

  return (
    <>
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="cursor-pointer"
                onClick={handleBackToBookings}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
              <div>
                <div className="flex gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(bookingStatus)}
                    <Badge className={getStatusColor(bookingStatus)}>
                      {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 font-mono text-sm">
                  {bookingReference}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {showRefund ? (
                <RefundBookingBtn
                  id={id}   
                  cancelationOptions={cancellationOptions}
                  paymentStatus={paymentStatus as "pending" | "completed" | "refunded"}
                  onSuccess={handleRefundSuccess}
                />
              ) : showCancel ? (
                <CancelBookingBtn 
                  id={bookingReference}   
                  onSuccess={handleCancellationSuccess}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog 
        open={successOpen} 
        onOpenChange={setSuccessOpen} 
        title={successData.title}
        description={successData.description}
        buttonTitle="Done"
      />
    </>
  );
};

export default BookingHeader;
