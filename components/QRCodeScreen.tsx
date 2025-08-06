
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LearnerInfo } from '../types';
import { LogoIcon, PrinterIcon } from './icons';

const QRCodeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [learnerInfo, setLearnerInfo] = useState<LearnerInfo | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    const storedInfo = sessionStorage.getItem('learnerInfo');
    if (storedInfo) {
      setLearnerInfo(JSON.parse(storedInfo));
    } else {
      // If no info, redirect to the dashboard
      navigate('/');
    }
  }, [navigate]);

  if (!learnerInfo) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const encodedData = encodeURIComponent(btoa(JSON.stringify(learnerInfo)));
  const qrUrl = `${window.location.origin}${window.location.pathname}#/found/${encodedData}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrUrl)}`;

  const handlePrintClick = () => {
    setIsPrintModalOpen(true);
  };

  const proceedToPrint = () => {
    setIsPrintModalOpen(false);
    window.print();
  };


  return (
    <>
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Tag is Ready!</h2>
            <p className="text-gray-600 mt-2">Print this tag and attach it to your child's belongings.</p>
        </div>

        <div id="printable-area" className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <div className="flex items-center gap-2">
              <LogoIcon className="h-8 w-8" />
              <span className="font-bold text-lg text-gray-700">TagMyKid</span>
            </div>
            <span className="text-xs text-gray-500">Scan to return</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <img src={qrApiUrl} alt="QR Code" className="w-56 h-56 rounded-lg shadow-md"/>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-gray-600 text-sm">This item belongs to:</p>
              <p className="font-bold text-2xl text-gray-800">{learnerInfo.name}</p>
              <p className="text-gray-600 mt-1">{learnerInfo.school}</p>
              <p className="text-gray-600">Grade: {learnerInfo.grade} | Class: {learnerInfo.className}</p>
            </div>
          </div>
          <div className="mt-4 border-t pt-3 text-center">
            <p className="text-xs text-gray-500">Manual Entry ID:</p>
            <p className="text-xl font-bold tracking-widest text-gray-800">
              {learnerInfo.tagId}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 print:hidden">
          <button
            onClick={handlePrintClick}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <PrinterIcon className="w-5 h-5" />
            Print Tag
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-area, #printable-area * {
                visibility: visible;
              }
              #printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                border: 2px dashed #000 !important;
                box-shadow: none !important;
              }
            }
          `}
        </style>
      </div>
      
      {isPrintModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-sm w-full text-center">
                <PrinterIcon className="mx-auto h-12 w-12 text-blue-500" />
                <h3 className="text-2xl font-bold mt-4 text-gray-900">Ready to Print?</h3>
                <p className="mt-2 text-gray-600">
                    Please ensure your Bluetooth printer is turned on and connected to your device.
                </p>
                <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                    <button 
                        onClick={() => setIsPrintModalOpen(false)}
                        className="w-full justify-center flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={proceedToPrint}
                        className="w-full justify-center flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Continue to Print
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default QRCodeScreen;
