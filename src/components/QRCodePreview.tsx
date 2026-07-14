import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QRCodeConfig } from '../types';
import { PRESET_LOGOS } from '../utils/logos';
import { Download, Copy, Check, FileDown, RefreshCw } from 'lucide-react';

interface QRCodePreviewProps {
  config: QRCodeConfig;
}

export default function QRCodePreview({ config }: QRCodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [rendering, setRendering] = useState(false);

  const {
    url,
    fgColor,
    bgColor,
    errorCorrectionLevel,
    margin,
    logoPresetId,
    logoCustomDataUrl,
    logoSize,
    logoMargin,
    frameType,
  } = config;

  useEffect(() => {
    if (!canvasRef.current || !url) return;

    setRendering(true);
    const canvas = canvasRef.current;

    // Use high resolution for clear prints
    const qrOptions = {
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: errorCorrectionLevel,
      margin: margin,
      width: 1024, // High-res canvas for crystal clear print & download
    };

    // Create a virtual offscreen canvas to generate the raw QR code first
    const virtualCanvas = document.createElement('canvas');
    virtualCanvas.width = 1024;
    virtualCanvas.height = 1024;

    QRCode.toCanvas(virtualCanvas, url, qrOptions)
      .then(() => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setRendering(false);
          return;
        }

        // Lock visible canvas attributes to perfect square
        canvas.width = 1024;
        canvas.height = 1024;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        // Fill with background color
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 1024, 1024);

        // Calculate scaling and offsets for frames
        let qrSize = 1024;
        let qrOffset_X = 0;
        let qrOffset_Y = 0;

        if (frameType !== 'none') {
          // Scale down the QR code slightly to make space for the frame
          const scale = 0.82;
          qrSize = 1024 * scale;
          qrOffset_X = (1024 - qrSize) / 2;
          qrOffset_Y = (1024 - qrSize) / 2;

          if (frameType === 'label') {
            // Shift QR upward to make extra room for the bottom text label
            qrOffset_Y = qrOffset_Y - 45;
          }
        }

        // Draw the raw QR code from virtual canvas onto our high-res main canvas
        ctx.drawImage(virtualCanvas, qrOffset_X, qrOffset_Y, qrSize, qrSize);

        // Draw the custom artistic frame
        if (frameType !== 'none') {
          ctx.strokeStyle = fgColor;
          ctx.fillStyle = fgColor;

          if (frameType === 'border') {
            const frameOffset = qrOffset_X - 18;
            const frameSize = qrSize + 36;
            ctx.lineWidth = 10;
            ctx.strokeRect(frameOffset, frameOffset, frameSize, frameSize);
            
            // Elegance double-border effect
            ctx.lineWidth = 3;
            ctx.strokeRect(frameOffset - 14, frameOffset - 14, frameSize + 28, frameSize + 28);
          } else if (frameType === 'corners') {
            const cornerMargin = 18;
            const lineLength = 55;
            const thickness = 10;
            
            const left = qrOffset_X - cornerMargin;
            const right = qrOffset_X + qrSize + cornerMargin;
            const top = qrOffset_Y - cornerMargin;
            const bottom = qrOffset_Y + qrSize + cornerMargin;

            // Top-left corner
            ctx.fillRect(left, top, lineLength, thickness);
            ctx.fillRect(left, top, thickness, lineLength);
            
            // Top-right corner
            ctx.fillRect(right - lineLength, top, lineLength, thickness);
            ctx.fillRect(right - thickness, top, thickness, lineLength);
            
            // Bottom-left corner
            ctx.fillRect(left, bottom - thickness, lineLength, thickness);
            ctx.fillRect(left, bottom - lineLength, thickness, lineLength);
            
            // Bottom-right corner
            ctx.fillRect(right - lineLength, bottom - thickness, lineLength, thickness);
            ctx.fillRect(right - thickness, bottom - lineLength, thickness, lineLength);
          } else if (frameType === 'label') {
            const cardX = qrOffset_X - 25;
            const cardY = qrOffset_Y - 25;
            const cardW = qrSize + 50;
            const cardH = qrSize + 125;
            
            ctx.lineWidth = 10;
            // Draw a high-contrast rounded card border
            ctx.beginPath();
            if (typeof (ctx as any).roundRect === 'function') {
              (ctx as any).roundRect(cardX, cardY, cardW, cardH, 24);
            } else {
              ctx.rect(cardX, cardY, cardW, cardH);
            }
            ctx.stroke();

            // Draw the text badge at the bottom of the card
            const badgeW = 320;
            const badgeH = 65;
            const badgeX = cardX + (cardW - badgeW) / 2;
            const badgeY = cardY + cardH - 32;
            
            ctx.beginPath();
            if (typeof (ctx as any).roundRect === 'function') {
              (ctx as any).roundRect(badgeX, badgeY, badgeW, badgeH, 16);
            } else {
              ctx.rect(badgeX, badgeY, badgeW, badgeH);
            }
            ctx.fill();

            // Draw text label on the badge with clear color contrast
            ctx.fillStyle = bgColor;
            ctx.font = 'bold 28px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('SCAN ME', badgeX + badgeW / 2, badgeY + badgeH / 2);
          }
        }

        // Drawing logo on top (if selected)
        const drawLogoOnCanvas = (imgSrc: string) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = imgSrc;
          img.onload = () => {
            const canvasSize = 1024;
            const logoWidth = canvasSize * (logoSize / 100);
            const logoHeight = logoWidth;
            const x = (canvasSize - logoWidth) / 2;
            
            let y = (canvasSize - logoHeight) / 2;
            if (frameType === 'label') {
              // Shift logo upward to align with the shifted QR code
              y = qrOffset_Y + (qrSize - logoHeight) / 2;
            }

            const padding = logoMargin * 4; // Scale padding proportionally with the high-res canvas
            const rectX = x - padding;
            const rectY = y - padding;
            const rectW = logoWidth + padding * 2;
            const rectH = logoHeight + padding * 2;

            // Draw a rounded high-contrast container for the logo
            ctx.fillStyle = bgColor;
            const radius = Math.min(rectW, rectH) * 0.25;
            ctx.beginPath();
            if (typeof (ctx as any).roundRect === 'function') {
              (ctx as any).roundRect(rectX, rectY, rectW, rectH, radius);
            } else {
              ctx.rect(rectX, rectY, rectW, rectH);
            }
            ctx.closePath();
            ctx.fill();

            // Draw the logo image
            ctx.drawImage(img, x, y, logoWidth, logoHeight);
            setRendering(false);
          };
          img.onerror = () => {
            console.error('Could not load logo image');
            setRendering(false);
          };
        };

        if (logoCustomDataUrl) {
          drawLogoOnCanvas(logoCustomDataUrl);
        } else if (logoPresetId) {
          const preset = PRESET_LOGOS.find((l) => l.id === logoPresetId);
          if (preset) {
            const svgDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(preset.svg);
            drawLogoOnCanvas(svgDataUrl);
          } else {
            setRendering(false);
          }
        } else {
          setRendering(false);
        }
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
        setRendering(false);
      });
  }, [
    url,
    fgColor,
    bgColor,
    errorCorrectionLevel,
    margin,
    logoPresetId,
    logoCustomDataUrl,
    logoSize,
    logoMargin,
    frameType,
  ]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      
      // Clean filename based on URL host or a default
      let name = 'ma-qr';
      try {
        const host = new URL(url).hostname;
        name = `ma-qr-${host.replace(/\./g, '-')}`;
      } catch {
        name = `ma-qr-${Date.now().toString().slice(-6)}`;
      }

      link.download = `${name}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (err) {
      console.error('Lỗi khi tải xuống mã QR:', err);
    }
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Clipboard item API error, falling back to dataUrl copy', err);
          // Fallback to copying URL instead, or show toast
        }
      }, 'image/png');
    } catch (err) {
      console.error('Lỗi khi sao chép mã QR:', err);
    }
  };

  return (
    <div id="qr-preview-container" className="flex flex-col items-center justify-center p-6 bg-[#161129] rounded-2xl border border-[#2d224e] relative overflow-hidden transition-all duration-300">
      {/* Background visual detail */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#e2b97c]/10 to-transparent rounded-bl-full pointer-events-none" />

      {/* QR Code Container with elegant gold corner accents */}
      <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square flex items-center justify-center bg-[#0c081a] rounded-xl border border-[#2d224e] p-5 group transition-all duration-300">
        
        {/* Soft Champagne Gold Corner Ornaments */}
        <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-[#e2b97c]"></div>
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-2 border-r-2 border-[#e2b97c]"></div>
        <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-2 border-l-2 border-[#e2b97c]"></div>
        <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-[#e2b97c]"></div>

        {!url && (
          <div className="text-center p-6 text-[#9d93b8] font-sans">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 border border-white/5">
              <RefreshCw className="w-5 h-5 text-[#e2b97c]/80 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <p className="text-sm font-serif italic tracking-wide text-[#e2b97c] font-medium">Bản Vẽ Sẵn Sàng</p>
            <p className="text-[13px] text-[#9d93b8] mt-1.5 font-sans">Mã QR của bạn sẽ hiển thị tự động</p>
          </div>
        )}

        {url && (
          <div className="relative w-full h-full flex items-center justify-center">
            {rendering && (
              <div className="absolute inset-0 bg-[#0c081a]/95 backdrop-blur-xs flex items-center justify-center rounded-lg z-10">
                <div className="flex flex-col items-center">
                  <RefreshCw className="w-8 h-8 text-[#e2b97c] animate-spin" />
                  <p className="text-sm text-[#e2b97c] font-serif italic tracking-wide mt-3">Đang vẽ mã QR...</p>
                </div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain rounded-lg"
              id="qr-canvas"
            />
          </div>
        )}
      </div>

      {/* Actions in elegant luxurious aesthetic */}
      <div className="w-full mt-8 space-y-3">
        <button
          id="btn-download-qr"
          disabled={!url || rendering}
          onClick={handleDownload}
          className={`w-full py-3.5 px-4 rounded-xl font-sans font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            url && !rendering
              ? 'bg-[#e2b97c] text-[#0d0a1b] hover:bg-[#ecd0ab] hover:text-[#0d0a1b] active:scale-[0.98]'
              : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
          }`}
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-[#0d0a1b] animate-bounce" />
              ĐÃ TẢI XUỐNG THÀNH CÔNG
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              TẢI MÃ QR (PNG)
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn-copy-qr"
            disabled={!url || rendering}
            onClick={handleCopy}
            className={`py-3 px-3 rounded-xl font-sans font-medium text-[13px] flex items-center justify-center gap-1.5 border transition-all duration-200 cursor-pointer ${
              url && !rendering
                ? 'bg-transparent border-[#2d224e] hover:border-[#e2b97c] text-[#f5f2fc] hover:bg-white/5'
                : 'bg-transparent border-white/5 text-white/10 cursor-not-allowed'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#e2b97c]" />
                ĐÃ SAO CHÉP!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                SAO CHÉP ẢNH
              </>
            )}
          </button>

          <button
            id="btn-print-qr"
            disabled={!url || rendering}
            onClick={() => window.print()}
            className={`py-3 px-3 rounded-xl font-sans font-medium text-[13px] flex items-center justify-center gap-1.5 border transition-all duration-200 cursor-pointer ${
              url && !rendering
                ? 'bg-transparent border-[#2d224e] hover:border-[#e2b97c] text-[#f5f2fc] hover:bg-white/5'
                : 'bg-transparent border-white/5 text-white/10 cursor-not-allowed'
            }`}
          >
            <FileDown className="w-3.5 h-3.5" />
            IN MÃ QR
          </button>
        </div>
      </div>

      {url && (
        <div className="w-full mt-5 p-4 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3">
          <div className="p-1.5 bg-[#e2b97c]/10 text-[#e2b97c] rounded shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left font-sans">
            <h4 className="text-sm font-bold text-[#e2b97c]">Mẹo quét cực nhạy:</h4>
            <p className="text-[13px] text-[#9d93b8] leading-normal mt-1">
              Nên chọn độ tương phản cao (Màu tối trên nền sáng) và tỉ lệ logo nhỏ hơn 20% để máy ảnh dễ quét hơn.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
