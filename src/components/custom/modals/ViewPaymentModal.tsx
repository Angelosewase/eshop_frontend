import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Payment } from "../../../features/payments/paymentsSlice";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { useProcessRefundMutation, useUpdatePaymentStatusMutation } from "../../../features/payments/paymentsSlice";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ViewPaymentModalProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewPaymentModal({ payment, open, onOpenChange }: ViewPaymentModalProps) {
  const [updatePaymentStatus, { isLoading: isUpdating }] = useUpdatePaymentStatusMutation();
  const [processRefund, { isLoading: isRefunding }] = useProcessRefundMutation();
  const [isConfirmingRefund, setIsConfirmingRefund] = useState(false);

  if (!payment) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updatePaymentStatus({
        id: payment.id,
        status: newStatus
      }).unwrap();
      toast.success(`Payment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const handleRefund = async () => {
    if (!isConfirmingRefund) {
      setIsConfirmingRefund(true);
      return;
    }

    try {
      await processRefund({
        id: payment.id
      }).unwrap();
      toast.success('Payment refunded successfully');
      setIsConfirmingRefund(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to process refund:', error);
      toast.error('Failed to process refund');
      setIsConfirmingRefund(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Payment Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Transaction ID</h3>
              <p className="mt-1 text-lg font-semibold">{payment.transactionId}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Amount</h3>
              <p className="mt-1 text-lg font-semibold">{formatCurrency(payment.amount)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <Badge className={`mt-1 ${getStatusColor(payment.status)}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
              <p className="mt-1 text-lg font-semibold capitalize">{payment.method.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
              <p className="mt-1 text-lg font-semibold">#{payment.orderId}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Customer</h3>
              <p className="mt-1 text-lg font-semibold">{payment.customerName}</p>
              <p className="text-sm text-gray-500">{payment.customerEmail}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="mt-1 text-sm">{formatDate(payment.createdAt)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-sm">{formatDate(payment.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Actions</h3>
          <div className="flex flex-wrap gap-3">
            {payment.status !== 'completed' && (
              <Button
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100"
                onClick={() => handleStatusChange('completed')}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Mark as Completed
              </Button>
            )}

            {payment.status === 'pending' && (
              <Button
                variant="outline"
                className="bg-red-50 text-red-700 hover:bg-red-100"
                onClick={() => handleStatusChange('failed')}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Mark as Failed
              </Button>
            )}

            {payment.status === 'completed' && payment.status !== 'refunded' && (
              <Button
                variant="outline"
                className={`${isConfirmingRefund ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                onClick={handleRefund}
                disabled={isRefunding}
              >
                {isRefunding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isConfirmingRefund ? 'Confirm Refund' : 'Process Refund'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 