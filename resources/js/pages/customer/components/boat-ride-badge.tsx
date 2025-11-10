import { Badge } from "@/components/ui/badge";

export const getStatusColor = (status: string): string => {
    switch (status) {
        case "boat assigned":
            return "bg-blue-100 text-blue-800 hover:bg-blue-200";
        case "pending":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
        case "completed":
            return "bg-green-100 text-green-800 hover:bg-green-200";
        case "cancelled":
            return "bg-gray-100 text-gray-800 hover:bg-gray-200";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
};

interface BoatRideBadgeProps {
    status: string;
}

const BoatRideBadge = ({ status }: BoatRideBadgeProps) => {
    return (
        <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

export default BoatRideBadge;
