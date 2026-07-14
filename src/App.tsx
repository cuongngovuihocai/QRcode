import React, { useState, useRef } from 'react';
import { ErrorCorrectionLevel, QRCodeConfig, FrameType } from './types';
import { PRESET_LOGOS } from './utils/logos';
import QRCodePreview from './components/QRCodePreview';
import {
  Link,
  Palette,
  Settings,
  Image as ImageIcon,
  Upload,
  Globe,
  Sparkles,
  Trash2,
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Cơ bản (Đen)', fg: '#000000', bg: '#ffffff' },
  { name: 'Slate Tối', fg: '#1e293b', bg: '#f8fafc' },
  { name: 'Xanh Đại Dương', fg: '#1e40af', bg: '#eff6ff' },
  { name: 'Lục Bảo Sâu', fg: '#065f46', bg: '#ecfdf5' },
  { name: 'Tía Hoàng Gia', fg: '#5b21b6', bg: '#f5f3ff' },
  { name: 'Đỏ Ruby', fg: '#9f1239', bg: '#fff1f2' },
];

export default function App() {
  const [url, setUrl] = useState('https://google.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('H');
  const [margin, setMargin] = useState(4);
  const [logoPresetId, setLogoPresetId] = useState<string | null>(null);
  const [logoCustomDataUrl, setLogoCustomDataUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(18);
  const [logoMargin, setLogoMargin] = useState(2);
  const [frameType, setFrameType] = useState<FrameType>('none');
  
  // File Upload Drag State
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync config helper
  const getConfig = (): QRCodeConfig => {
    // Basic automatic URL correction
    let processedUrl = url.trim();
    if (processedUrl && !/^[a-zA-Z]+:\/\//.test(processedUrl)) {
      // If it looks like a domain, prepend https://
      if (processedUrl.includes('.') && !processedUrl.includes(' ')) {
        processedUrl = 'https://' + processedUrl;
      }
    }

    return {
      url: processedUrl,
      fgColor,
      bgColor,
      errorCorrectionLevel,
      margin,
      logoPresetId,
      logoCustomDataUrl,
      logoSize,
      logoMargin,
      frameType,
    };
  };

  // Preset Colors selection
  const handleSelectPresetColor = (fg: string, bg: string) => {
    setFgColor(fg);
    setBgColor(bg);
  };

  // Handle Logo File Upload
  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chỉ tải lên tệp hình ảnh (PNG, JPG, SVG, v.v.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setLogoCustomDataUrl(e.target.result);
        setLogoPresetId(null); // Deselect preset
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearCustomLogo = () => {
    setLogoCustomDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0a1b] text-[#f5f2fc] selection:bg-[#e2b97c] selection:text-[#0d0a1b] font-sans">
      {/* Header Banner - Premium Artistic Design */}
      <header id="app-header" className="bg-[#161129] border-b border-[#2d224e] py-4 sm:py-5 px-6 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 h-auto sm:h-[120px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 h-auto sm:h-[76px]">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#e2b97c] text-[#0d0a1b] flex items-center justify-center font-serif font-black text-xl sm:text-2xl italic border border-[#e2b97c] shrink-0 rounded-xl shadow-lg shadow-[#e2b97c]/15 transition-all duration-300">
              Qr
            </div>
            <div>
              <h1 className="text-xl sm:text-[26px] font-serif font-bold tracking-wide text-[#e2b97c] italic flex items-center gap-2 transition-all duration-300">
                Link to QR Code
              </h1>
              <p className="text-xs sm:text-sm text-[#9d93b8] font-sans mt-0.5 transition-all duration-300">
                Chuyển đổi liên kết thành mã QR
              </p>
            </div>
          </div>
          <div className="flex items-center justify-start sm:justify-end shrink-0">
            <img
              src="https://lh3.googleusercontent.com/d/1ah0RGe13kImy6WxdDFMYirAQupXX68Sl"
              alt="Logo"
              className="h-[60px] sm:h-[100px] w-auto object-contain rounded transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
         
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Creator and Style Configurations */}
          <section id="creator-panel" className="lg:col-span-7 space-y-6">
            
             {/* Module 1: URL input */}
            <div className="bg-[#161129] border border-[#2d224e] rounded-2xl p-6 space-y-5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d224e] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#e2b97c]/10 text-[#e2b97c] rounded-xl">
                    <Link className="w-4 h-4" />
                  </div>
                  <h2 className="text-[22px] font-serif italic tracking-wide text-[#e2b97c] font-semibold">1. Nhập liên kết nguồn</h2>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-sans font-bold uppercase tracking-wider animate-pulse self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Tự động tạo trực tiếp
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="url-input" className="block text-sm font-semibold text-[#9d93b8] mb-2 font-sans">
                    Địa chỉ URL hoặc nội dung liên kết quét
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                      <Globe className="w-4.5 h-4.5" />
                    </div>
                    <input
                      type="text"
                      id="url-input"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Nhập liên kết, ví dụ: facebook.com, youtube.com..."
                      className="block w-full pl-10 pr-10 py-3.5 text-sm bg-white/5 border border-[#2d224e] rounded-xl focus:bg-white/10 focus:ring-1 focus:ring-[#e2b97c] focus:border-[#e2b97c] transition font-sans placeholder-white/20 text-white font-medium"
                    />
                    {url && (
                      <button
                        onClick={() => setUrl('')}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white cursor-pointer"
                        title="Xóa trống"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[13px] text-[#9d93b8] mt-2 font-sans leading-normal">
                    * Định dạng URL sẽ tự động được chuẩn hóa khi vẽ (ví dụ: bổ sung <code>https://</code>). Bạn cũng có thể nhập email hoặc chuỗi văn bản tùy ý.
                  </p>
                </div>
              </div>
            </div>

            {/* Module 2: Design and Colors */}
            <div className="bg-[#161129] border border-[#2d224e] rounded-2xl p-6 space-y-5 relative">
              <div className="flex items-center gap-2.5 border-b border-[#2d224e] pb-3">
                <div className="p-1.5 bg-[#e2b97c]/10 text-[#e2b97c] rounded-xl">
                  <Palette className="w-4 h-4" />
                </div>
                <h2 className="text-[22px] font-serif italic tracking-wide text-[#e2b97c] font-semibold">2. Thiết lập màu sắc bản vẽ</h2>
              </div>

              {/* Color Presets */}
              <div className="space-y-3">
                <span className="block text-sm font-semibold text-[#9d93b8] font-sans">
                  Bảng màu phối sẵn độ tương phản cao:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COLOR_PRESETS.map((preset, index) => {
                    const isActive = fgColor === preset.fg && bgColor === preset.bg;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectPresetColor(preset.fg, preset.bg)}
                        className={`p-3 border rounded-xl flex items-center gap-2.5 text-left cursor-pointer transition-all duration-200 ${
                          isActive
                            ? 'border-[#e2b97c] bg-[#e2b97c]/10 font-bold text-white'
                            : 'border-[#2d224e] hover:border-[#2e234e] bg-white/5 text-[#9d93b8]'
                        }`}
                      >
                        <div className="flex -space-x-1 shrink-0">
                          <span
                            className="w-4.5 h-4.5 rounded-full border border-[#161129]"
                            style={{ backgroundColor: preset.fg }}
                          />
                          <span
                            className="w-4.5 h-4.5 rounded-full border border-[#161129]"
                            style={{ backgroundColor: preset.bg }}
                          />
                        </div>
                        <span className="text-[13px] font-sans truncate">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Color pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label htmlFor="fg-color" className="block text-[13px] font-black uppercase tracking-wider text-white/40 font-mono">
                    Màu khối mã QR (Foreground)
                  </label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5">
                    <input
                      type="color"
                      id="fg-color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 cursor-pointer p-0 border border-white/10 bg-transparent rounded"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="bg-transparent border-none text-[13px] font-sans font-bold text-white w-24 focus:ring-0 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="bg-color" className="block text-sm font-semibold text-[#9d93b8] font-sans">
                    Màu nền giấy (Background)
                  </label>
                  <div className="flex items-center gap-2 bg-white/5 border border-[#2d224e] rounded-xl p-2.5">
                    <input
                      type="color"
                      id="bg-color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 cursor-pointer p-0 border border-white/10 bg-transparent rounded"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="bg-transparent border-none text-[13px] font-sans font-bold text-white w-24 focus:ring-0 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Module 3: Central branding logos */}
            <div className="bg-[#161129] border border-[#2d224e] rounded-2xl p-6 space-y-5 relative">
              <div className="flex items-center justify-between border-b border-[#2d224e] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#e2b97c]/10 text-[#e2b97c] rounded-xl">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <h2 className="text-[22px] font-serif italic tracking-wide text-[#e2b97c] font-semibold">3. Biểu tượng trung tâm</h2>
                </div>
                { (logoPresetId || logoCustomDataUrl) && (
                  <button
                    onClick={() => {
                      setLogoPresetId(null);
                      handleClearCustomLogo();
                    }}
                    className="text-[13px] font-semibold uppercase tracking-wider text-red-400 hover:text-red-500 cursor-pointer font-sans"
                  >
                    Hủy dùng logo
                  </button>
                )}
              </div>

              {/* Grid of Preset Logos */}
              <div className="space-y-3">
                <span className="block text-sm font-semibold text-[#9d93b8] font-sans">
                  Chọn biểu tượng phổ biến:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                  <button
                    onClick={() => {
                      setLogoPresetId(null);
                      setLogoCustomDataUrl(null);
                    }}
                    className={`aspect-square p-2 border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 ${
                      !logoPresetId && !logoCustomDataUrl
                        ? 'border-[#e2b97c] bg-[#e2b97c]/15 text-[#e2b97c]'
                        : 'border-[#2d224e] hover:border-[#2e234e] bg-white/5'
                    }`}
                  >
                    <span className="text-sm font-bold font-sans">∅</span>
                    <span className="text-[13px] font-sans truncate w-full text-center">Trống</span>
                  </button>

                  {PRESET_LOGOS.map((preset) => {
                    const isSelected = logoPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setLogoPresetId(preset.id);
                          setLogoCustomDataUrl(null); // Clear custom
                        }}
                        className={`aspect-square p-1.5 border rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-[#e2b97c] bg-[#e2b97c]/15 text-[#e2b97c]'
                            : 'border-[#2d224e] hover:border-[#2e234e] bg-white/5'
                        }`}
                        title={preset.name}
                      >
                        {/* Display inline SVG miniature with color filter if dark */}
                        <div
                          className="w-5 h-5 flex items-center justify-center shrink-0 filter brightness-125"
                          dangerouslySetInnerHTML={{ __html: preset.svg }}
                        />
                        <span className="text-[13px] font-sans truncate w-full text-center text-[#9d93b8]">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Logo Upload with Drag & Drop */}
              <div className="space-y-3 pt-2">
                <span className="block text-sm font-semibold text-[#9d93b8] font-sans">
                  Tự tải lên biểu tượng tùy biến:
                </span>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                    isDragging
                      ? 'border-[#00FF41] bg-[#00FF41]/5'
                      : logoCustomDataUrl
                      ? 'border-[#00FF41]/50 bg-[#00FF41]/5'
                      : 'border-[#2d224e] hover:border-[#e2b97c]/50 bg-white/5'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleLogoFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  
                  {logoCustomDataUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-12 h-12 border border-[#2d224e] p-1 bg-white/5 shadow-xs rounded-xl">
                        <img
                          src={logoCustomDataUrl}
                          alt="Custom logo"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearCustomLogo();
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs"
                          title="Hủy biểu tượng"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-[13px] font-bold font-sans text-[#e2b97c] uppercase tracking-wider">LOGO ĐÃ TẢI LÊN THÀNH CÔNG</p>
                      <p className="text-[13px] text-[#9d93b8] font-sans">Nhấp để thay đổi biểu tượng khác</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-white/50">
                      <Upload className="w-6 h-6 text-[#e2b97c] mx-auto" />
                      <p className="text-sm font-bold uppercase tracking-wider text-white font-sans">Kéo thả tệp hoặc nhấp để tải lên</p>
                      <p className="text-[13px] font-sans text-[#9d93b8]">PNG, JPG, SVG hoặc WEBP (Dưới 2MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo custom scaling controls */}
              { (logoPresetId || logoCustomDataUrl) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 bg-white/5 p-4 border border-[#2d224e] rounded-xl">
                  <div className="space-y-1.5 font-sans">
                    <div className="flex justify-between items-center text-[13px] font-bold text-[#9d93b8]">
                      <span>Tỉ lệ Logo ({logoSize}%)</span>
                      <span className="text-[#e2b97c]">Khuyên dùng: 15-20%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="28"
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e2b97c]"
                    />
                  </div>

                  <div className="space-y-1.5 font-sans">
                    <div className="flex justify-between items-center text-[13px] font-bold text-[#9d93b8]">
                      <span>Khoảng viền Logo ({logoMargin}px)</span>
                      <span className="text-[#9d93b8]/60">Che bớt điểm</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      value={logoMargin}
                      onChange={(e) => setLogoMargin(Number(e.target.value))}
                      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e2b97c]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Module 4: Artistic Frames */}
            <div className="bg-[#161129] border border-[#2d224e] rounded-2xl p-6 space-y-5 relative">
              <div className="flex items-center gap-2.5 border-b border-[#2d224e] pb-3">
                <div className="p-1.5 bg-[#e2b97c]/10 text-[#e2b97c] rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-[22px] font-serif italic tracking-wide text-[#e2b97c] font-semibold">4. Khung viền nghệ thuật</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'none', name: 'Không khung', desc: 'Mã QR thô tối giản' },
                  { id: 'border', name: 'Viền kép', desc: 'Khung chỉ đôi thanh lịch' },
                  { id: 'corners', name: 'Góc cổ điển', desc: 'Khung định vị 4 góc' },
                  { id: 'label', name: 'Nhãn SCAN ME', desc: 'Thẻ in kèm chữ kêu gọi' },
                ].map((item) => {
                  const isActive = frameType === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setFrameType(item.id as any)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer group ${
                        isActive
                          ? 'bg-[#e2b97c]/10 border-[#e2b97c] text-white shadow-lg shadow-[#e2b97c]/5'
                          : 'bg-white/5 border-white/5 text-[#9d93b8] hover:border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className={`text-xs font-bold font-sans uppercase tracking-wider ${isActive ? 'text-[#e2b97c]' : 'text-white/60 group-hover:text-white'}`}>
                        {item.name}
                      </span>
                      <span className="text-xs text-[#9d93b8] mt-1 leading-snug">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Module 5: Fine settings */}
            <div className="bg-[#161129] border border-[#2d224e] rounded-2xl p-6 space-y-5 relative">
              <div className="flex items-center gap-2.5 border-b border-[#2d224e] pb-3">
                <div className="p-1.5 bg-[#e2b97c]/10 text-[#e2b97c] rounded-xl">
                  <Settings className="w-4 h-4" />
                </div>
                <h2 className="text-[22px] font-serif italic tracking-wide text-[#e2b97c] font-semibold">5. Độ sửa lỗi & Viền đệm</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Error correction level */}
                <div className="space-y-2">
                  <select
                    id="err-correction"
                    value={errorCorrectionLevel}
                    onChange={(e) => setErrorCorrectionLevel(e.target.value as ErrorCorrectionLevel)}
                    className="block w-full px-3.5 py-3 text-[13px] bg-white/5 border border-[#2d224e] text-white font-sans focus:bg-[#120e24] focus:ring-1 focus:ring-[#e2b97c] focus:border-[#e2b97c] transition rounded-xl"
                  >
                    <option value="L" className="bg-[#161129]">Mức L (Sửa lỗi 7%) - Thấp</option>
                    <option value="M" className="bg-[#161129]">Mức M (Sửa lỗi 15%) - Trung bình</option>
                    <option value="Q" className="bg-[#161129]">Mức Q (Sửa lỗi 25%) - Cao</option>
                    <option value="H" className="bg-[#161129]">Mức H (Sửa lỗi 30%) - Khuyên dùng khi có Logo</option>
                  </select>
                  <p className="text-[13px] text-[#9d93b8]/60 font-sans leading-normal">
                    * Sửa lỗi cao giúp máy ảnh điện thoại dễ quét mã ngay cả khi bị che mờ hoặc có chèn logo chính giữa.
                  </p>
                </div>

                {/* Quiet Zone Padding */}
                <div className="space-y-2 font-sans">
                  <div className="flex justify-between items-center text-sm font-semibold text-[#9d93b8]">
                    <span>Khoảng đệm rìa ({margin} ô)</span>
                    <span className="text-[#e2b97c]">VÙNG BẢO VỆ</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e2b97c] mt-3"
                  />
                  <p className="text-[13px] text-[#9d93b8]/60 font-sans leading-normal">
                    * Khoảng trắng đệm rìa giúp thiết bị quét phân biệt rõ khối dữ liệu mã QR với nội dung in ấn xung quanh.
                  </p>
                </div>
              </div>
            </div>

          </section>

          {/* Right Column: Dynamic Preview and Saved History */}
          <section id="preview-panel" className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 h-fit">
            
            {/* Live Preview Display Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#2d224e] pb-2 font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#e2b97c]">
                    Bản xem trước trực tiếp
                  </span>
                  <span className="hidden xs:inline-block text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    TỰ ĐỘNG CẬP NHẬT
                  </span>
                </div>
              </div>

              <div className="text-left font-sans text-xs text-[#9d93b8]/75 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 animate-pulse shrink-0" />
                <div className="space-y-1.5">
                  <p className="text-[15px] text-[#ada2c9] leading-relaxed">
                    Mã QR sẽ <strong>tự động tạo ngay lập tức</strong> mỗi khi bạn thay đổi bất kỳ liên kết hay tùy chọn thiết kế nào ở bên trái mà không cần bấm nút tạo.
                  </p>
                  <p className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="text-[15px]">⚠️ Luôn quét để kiểm tra QR thành phẩm trước khi xuất bản.</span>
                  </p>
                </div>
              </div>

              <QRCodePreview config={getConfig()} />
            </div>

          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#161129] border-t border-[#2d224e] py-8 text-center text-[13px] text-[#9d93b8]/60 font-sans mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="flex items-center gap-1.5 tracking-wide">
            THIẾT KẾ BỞI
            <Sparkles className="w-3.5 h-3.5 text-[#e2b97c] fill-[#e2b97c]/15 animate-pulse" />
            TRÍ TUỆ NHÂN TẠO
          </p>
        </div>
      </footer>
    </div>
  );
}
