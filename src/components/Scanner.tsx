import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Scan, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { productService } from '../lib/supabase';

interface ScannerProps {
  onClose: () => void;
  onScan: (code: string, product?: any) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [scanStatus, setScanStatus] = useState<'scanning' | 'success' | 'error' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const { setIsScanning, setScanResult } = useStore();

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setIsActive(true);
      setIsScanning(true);
      
      const codeReader = new BrowserMultiFormatReader();
      readerRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0]?.deviceId;

      if (selectedDeviceId && videoRef.current) {
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          async (result, error) => {
            if (result) {
              const code = result.getText();
              setScanResult(code);
              await handleScanResult(code);
            }
          }
        );
      }
    } catch (error) {
      console.error('Error starting scanner:', error);
      setScanStatus('error');
      setStatusMessage('Camera access denied or not available');
    }
  };

  const handleScanResult = async (code: string) => {
    setScanStatus('scanning');
    setStatusMessage('Looking up product...');
    
    try {
      // Try to find product by barcode first
      let product;
      try {
        product = await productService.getProductByBarcode(code);
      } catch {
        // If not found by barcode, try QR code
        try {
          product = await productService.getProductByQRCode(code);
        } catch {
          product = null;
        }
      }

      if (product) {
        setScanStatus('success');
        setStatusMessage(`Found: ${product.name}`);
        setTimeout(() => {
          onScan(code, product);
          onClose();
        }, 1500);
      } else {
        setScanStatus('error');
        setStatusMessage('Product not found');
        setTimeout(() => {
          setScanStatus(null);
          setStatusMessage('');
        }, 2000);
      }
    } catch (error) {
      setScanStatus('error');
      setStatusMessage('Error looking up product');
      setTimeout(() => {
        setScanStatus(null);
        setStatusMessage('');
      }, 2000);
    }
  };

  const stopScanner = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setIsActive(false);
    setIsScanning(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
    >
      <div className="relative w-full max-w-md mx-4">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Scan Product</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-80 object-cover"
            autoPlay
            muted
            playsInline
          />
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-48 h-48 border-2 border-white border-opacity-50 rounded-lg">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
              </div>
              
              {/* Scanning Line Animation */}
              <motion.div
                className="absolute inset-x-0 h-0.5 bg-blue-500"
                animate={{ y: [0, 192, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>

        {/* Status Display */}
        <AnimatePresence>
          {scanStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 flex items-center space-x-3"
            >
              {scanStatus === 'scanning' && (
                <>
                  <Scan className="text-blue-500 animate-pulse" size={24} />
                  <span className="text-gray-800">{statusMessage}</span>
                </>
              )}
              {scanStatus === 'success' && (
                <>
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="text-gray-800">{statusMessage}</span>
                </>
              )}
              {scanStatus === 'error' && (
                <>
                  <AlertCircle className="text-red-500" size={24} />
                  <span className="text-gray-800">{statusMessage}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!scanStatus && (
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-sm opacity-75">
              Position the barcode or QR code within the frame
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};