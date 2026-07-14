export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type FrameType = 'none' | 'border' | 'corners' | 'label';

export interface QRCodeConfig {
  url: string;
  fgColor: string;
  bgColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  logoPresetId: string | null;
  logoCustomDataUrl: string | null; // For uploaded logos
  logoSize: number; // Percentage of QR code size, e.g. 15 to 25
  logoMargin: number; // Margin around the logo in pixels
  frameType: FrameType; // Artistic frame wrapper
}

export interface PresetLogo {
  id: string;
  name: string;
  svg: string; // SVG path or raw SVG code for canvas drawing
  color: string; // Associated color for preset background, e.g. blue for FB
}
