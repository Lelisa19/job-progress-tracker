// C:\Users\laloo\job-progress-tracker\components\QRScanner.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { X, QrCode, Download, RefreshCw, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import QRCode from 'react-qr-code';

interface QRScannerProps {
    isOpen: boolean;
    onClose: () => void;
    projectId?: string;
    projectName?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({
    isOpen,
    onClose,
    projectId = "PROJECT-ALPHA-001",
    projectName = "PROJECT ALPHA"
}) => {
    const [qrValue, setQrValue] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [expiresIn, setExpiresIn] = useState<number>(300);

    useEffect(() => {
        if (isOpen) {
            generateQRCode();
            const timer = setInterval(() => {
                setExpiresIn(prev => prev > 0 ? prev - 1 : 0);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOpen]);

    const generateQRCode = () => {
        const checkInData = {
            projectId: projectId,
            projectName: projectName,
            timestamp: new Date().toISOString(),
            checkInUrl: `${window.location.origin}/api/attendance/checkin`,
        };
        setQrValue(JSON.stringify(checkInData));
    };

    const handleDownload = () => {
        const svg = document.querySelector('#qr-code-svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = `qr-code-${projectId}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            };

            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
        }
    };

    const handleCopyLink = async () => {
        const checkInLink = `${window.location.origin}/checkin?project=${projectId}`;
        await navigator.clipboard.writeText(checkInLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <QrCode className="h-6 w-6" />
                            <h3 className="text-xl font-semibold">Worker Check-in QR Code</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="text-blue-100 text-sm mt-2">
                        Workers can scan this QR code with their mobile device to check in
                    </p>
                </div>

                <div className="p-6">
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                            <div id="qr-code-svg">
                                <QRCode
                                    value={qrValue}
                                    size={220}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox="0 0 256 256"
                                />
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Project:</span> {projectName}
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <RefreshCw className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-500">
                                    QR Code expires in: <span className="font-mono font-semibold text-blue-600">{formatTime(expiresIn)}</span>
                                </span>
                            </div>
                            {expiresIn === 0 && (
                                <div className="bg-yellow-50 text-yellow-700 p-2 rounded-lg text-sm">
                                    QR Code expired. Click refresh to generate new code.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="w-full"
                                disabled={expiresIn === 0}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download QR
                            </Button>
                            <Button
                                onClick={generateQRCode}
                                variant="outline"
                                className="w-full"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh QR
                            </Button>
                        </div>

                        <Button
                            onClick={handleCopyLink}
                            variant="ghost"
                            className="w-full"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                    Link Copied!
                                </>
                            ) : (
                                <>
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Copy Check-in Link
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Workers: Open camera app, scan QR code to check in instantly</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;