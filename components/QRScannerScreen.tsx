
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScannerScreen: React.FC = () => {
    const navigate = useNavigate();
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [scanError, setScanError] = useState<string>('');
    const isProcessingScan = useRef(false);

    useEffect(() => {
        // This check prevents re-initialization on hot reloads.
        if (scannerRef.current) {
            return;
        }

        const scanner = new Html5QrcodeScanner(
            'reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                supportedScanTypes: [0] // SCAN_TYPE_CAMERA
            },
            /* verbose= */ false
        );
        scannerRef.current = scanner;

        const onScanSuccess = async (decodedText: string) => {
            if (isProcessingScan.current) return;
            isProcessingScan.current = true;
            
            setScanError('');

            try {
                // Stop the scanner first and await its cleanup to prevent race conditions.
                if(scannerRef.current && scannerRef.current.getState() === 2 /* SCANNING */) {
                   await scannerRef.current.clear();
                }

                const url = new URL(decodedText);
                const hash = url.hash;

                if (hash && hash.startsWith('#/found/')) {
                    const data = hash.substring('#/found/'.length);
                    if (data) {
                        navigate(`/found/${data}`);
                        return; // Success, we are navigating away.
                    }
                }
                
                // If we get here, the QR code was not valid for this app.
                setScanError('This is not a valid TagMyKid QR code. Please try a different code.');
                // The scanner is now stopped. The user can navigate back.

            } catch (e) {
                console.error("Error parsing QR code URL:", e);
                setScanError("The scanned QR code is not a valid URL. The scanner has been stopped.");
            }
        };

        const onScanFailure = (error: string) => {
            // This is called frequently, so it's ignored to avoid UI flicker.
        };

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            // Cleanup on unmount, if scanner wasn't already cleared.
            if (scannerRef.current && scannerRef.current.getState() === 2) {
                 scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner.", error);
                });
            }
            scannerRef.current = null;
        };
    }, [navigate]);

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg animate-fade-in text-center">
            <h2 className="text-3xl font-bold text-gray-900">Scan Tag</h2>
            <p className="text-gray-600 mt-2 mb-6">Point your camera at the QR code to identify the item.</p>
            <div id="reader" className="w-full rounded-lg overflow-hidden border-2 border-gray-200"></div>
            {scanError && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{scanError}</p>}
            <button
                onClick={() => navigate(-1)}
                className="mt-6 w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                {scanError ? 'Go Back' : 'Cancel'}
            </button>
        </div>
    );
};

export default QRScannerScreen;
