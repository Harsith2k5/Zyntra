import React, { useState } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import styles from './QrScannerComponent.module.css'; // We'll create this CSS module

interface QrScannerProps {
  onScanSuccess: (data: string) => void;
  onScanError?: (error: string | Error) => void;
  onCameraError?: (error: unknown) => void;
  showScanner: boolean; // Prop to control scanner visibility
}

const QrScannerComponent: React.FC<QrScannerProps> = ({
  onScanSuccess,
  onScanError,
  onCameraError,
  showScanner,
}) => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [cameraPermissionError, setCameraPermissionError] = useState<boolean>(false);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const latestCode = detectedCodes[0].rawValue;
      if (latestCode && latestCode !== scannedResult) { // Only update if new result
        setScannedResult(latestCode);
        onScanSuccess(latestCode);
        // Optionally, pause scanning after success
        // return true; // Returning true will pause the scanner (check library docs for exact behavior)
      }
    }
  };

  const handleError = (err: unknown) => {
    console.error('QR Scanner Error:', err);
    if (err instanceof DOMException && err.name === 'NotAllowedError') {
      setCameraPermissionError(true);
      alert('Camera access denied. Please allow camera access in your browser settings.');
    }
    if (onCameraError) {
      onCameraError(err);
    }
  };

  // Only render the scanner if showScanner is true
  if (!showScanner) {
    return null;
  }

  return (
    <div className={styles.qrScannerContainer}>
      {cameraPermissionError ? (
        <div className={styles.cameraError}>
          <p>Camera access is required to scan QR codes.</p>
          <p>Please enable camera permissions for this site in your browser settings.</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      ) : (
        <>
          <h3 className={styles.scannerTitle}>Scan QR Code</h3>
          <div className={styles.scannerWindow}>
            <Scanner
              onScan={handleScan}
              onError={handleError}
              formats={['qr_code']} // Specify to only detect QR codes
              constraints={{ facingMode: 'environment' }} // Use rear camera on mobile
              scanDelay={500} // Delay between scans in ms
              // paused={scannedResult !== null} // Pause after a successful scan (optional)
            />
          </div>
          {scannedResult && (
            <div className={styles.scanResult}>
              <p>Scanned Result:</p>
              <p className={styles.resultText}>{scannedResult}</p>
              <button onClick={() => setScannedResult(null)} className={styles.clearScanButton}>Scan Again</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QrScannerComponent;