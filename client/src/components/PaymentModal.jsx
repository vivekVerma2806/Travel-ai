import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Loader2, X } from 'lucide-react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

const PaymentModal = ({ isOpen, onClose, onSuccess, amount, itemName }) => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('payment'); // payment, processing, success

    const handlePayment = async () => {
        setLoading(true);
        setStep('processing');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setLoading(false);
        setStep('success');

        // Wait a moment before closing/callback
        setTimeout(() => {
            onSuccess();
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            {step === 'success' ? 'Payment Successful!' : 'Complete Booking'}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="p-4">
                    {step === 'payment' && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Booking for:</span>
                                    <span className="font-bold text-[#0A1628] truncate max-w-[200px]">{itemName}</span>
                                </div>
                                <div className="flex justify-between text-base font-extrabold text-[#0A1628] pt-2 border-t border-slate-200">
                                    <span>Total Amount:</span>
                                    <span className="text-[#00B4D8]">${amount}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Method (Simulated)</p>
                                <div className="border border-slate-200 hover:border-[#00B4D8] rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all bg-slate-50 hover:bg-white shadow-xs">
                                    <div className="w-10 h-6 bg-[#0A1628] rounded flex items-center justify-center text-[8px] text-white font-bold tracking-wider">VISA</div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-[#0A1628]">•••• •••• •••• 4242</p>
                                        <p className="text-[10px] text-slate-400">Expires 12/28</p>
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-[#00B4D8]" />
                                </div>
                            </div>

                            <Button
                                onClick={handlePayment}
                                className="w-full h-11 text-sm font-bold bg-[#00B4D8] hover:bg-[#0096B4] text-white rounded-xl shadow-md shadow-[#00B4D8]/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Confirm Simulated Payment (${amount})
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                Secured Sandbox Checkout • No Live Charges
                            </div>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="py-10 text-center space-y-4">
                            <Loader2 className="w-12 h-12 animate-spin text-[#00B4D8] mx-auto" />
                            <h3 className="text-base font-bold text-[#0A1628]">Confirming Reservation...</h3>
                            <p className="text-slate-500 text-xs">Connecting with Pathora journey services.</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-10 text-center space-y-4">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Booking Confirmed!</h3>
                            <p className="text-gray-500 text-sm">Redirecting to your request status...</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
