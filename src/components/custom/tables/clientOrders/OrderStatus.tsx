import { Badge } from "../../../ui/badge";

export const OrderStatus = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Badge color={getStatusColor(status)}>
      {status}
    </Badge>
  );
}; 