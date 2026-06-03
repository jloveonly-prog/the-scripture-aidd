let html5QrCode;

function startScanner() {
  if (html5QrCode) {
    // Already running or initializing
    return;
  }
  
  html5QrCode = new Html5Qrcode("qr-reader");
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };
  
  // Try to use back camera by default
  html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
    .catch(err => {
      console.error("Failed to start scanner:", err);
      alert("Failed to start camera. Please ensure camera permissions are granted.");
      // reset state
      document.querySelector('[x-data]').__x.$data.scanning = false;
      html5QrCode = null;
    });
}

function stopScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
      html5QrCode = null;
    }).catch(err => {
      console.error("Failed to stop scanner:", err);
    });
  }
}

function onScanSuccess(decodedText, decodedResult) {
  // Pass result to Alpine component
  const el = document.querySelector('[x-data]');
  if (el && el.__x) {
    el.__x.$data.result = decodedText;
    
    // Stop scanning after a successful scan
    el.__x.$data.scanning = false;
    stopScanner();
  }
}

function onScanFailure(error) {
  // handle scan failure, usually better to ignore and keep scanning
}
