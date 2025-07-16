import React, { useState } from 'react';
import { Upload, QrCode, Check, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { PaymentService } from '../../services/paymentService';
import type { Payment } from '../../lib/supabase';

interface QRPaymentUploadProps {
  payment: Payment;
  onUpdate: (payment: Payment) => void;
  userRole: 'client' | 'freelancer';
}

export const QRPaymentUpload: React.FC<QRPaymentUploadProps> = ({ 
  payment, 
  onUpdate, 
  userRole 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      let updatedPayment;
      if (userRole === 'freelancer' && !payment.qr_code_url) {
        // Freelancer uploading QR code
        updatedPayment = await PaymentService.uploadQRCode(file, payment.id);
      } else if (userRole === 'client' && payment.qr_code_url) {
        // Client uploading payment proof
        updatedPayment = await PaymentService.uploadPaymentProof(file, payment.id);
      }
      
      if (updatedPayment) {
        onUpdate(updatedPayment);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'uploaded': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'verified': return 'text-green-600 bg-green-50 border-green-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-4 h-4" />;
      case 'verified': return <Check className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Payment</h3>
        <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
          {getStatusIcon(payment.status)}
          <span className="ml-1 capitalize">{payment.status}</span>
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Amount</p>
        <p className="text-lg font-bold text-green-600">
          ${payment.amount.toLocaleString()} {payment.currency}
        </p>
      </div>

      {/* QR Code Upload (Freelancer) */}
      {userRole === 'freelancer' && !payment.qr_code_url && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Upload Payment QR Code</p>
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            <QrCode className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag & drop your QR code image here
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="qr-upload"
            />
            <label htmlFor="qr-upload">
              <Button as="span" size="sm" disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </label>
          </div>
        </div>
      )}

      {/* Display QR Code */}
      {payment.qr_code_url && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Payment QR Code</p>
          <img
            src={payment.qr_code_url}
            alt="Payment QR Code"
            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* Payment Proof Upload (Client) */}
      {userRole === 'client' && payment.qr_code_url && !payment.payment_proof_url && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Upload Payment Proof</p>
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Upload screenshot of payment confirmation
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="proof-upload"
            />
            <label htmlFor="proof-upload">
              <Button as="span" size="sm" disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Proof'}
              </Button>
            </label>
          </div>
        </div>
      )}

      {/* Display Payment Proof */}
      {payment.payment_proof_url && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Payment Proof</p>
          <img
            src={payment.payment_proof_url}
            alt="Payment Proof"
            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}

      {payment.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{payment.notes}</p>
        </div>
      )}
    </div>
  );
};