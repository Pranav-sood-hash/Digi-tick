import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraCapture } from '../components/scanner/CameraCapture';
import { OCRReviewTable } from '../components/scanner/OCRReviewTable';
import { Button } from '../components/common/Button';
import { ocrApi, listsApi } from '../services/api';
import { ExtractedItem, OCRScanResult, ShoppingList } from '../types';
import { useToast } from '../context/ToastContext';
import {
  UploadCloud,
  Camera,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';

export const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<OCRScanResult | null>(null);
  const [activeLists, setActiveLists] = useState<ShoppingList[]>([]);

  useEffect(() => {
    listsApi.getLists('active').then(setActiveLists).catch(console.error);
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      error('Please select an image file (PNG, JPG, WEBP)');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setScanResult(null);
  };

  const handleCameraCapture = (blob: Blob) => {
    setSelectedFile(blob);
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setMode('upload');
    setScanResult(null);
  };

  const handleProcessScan = async () => {
    if (!selectedFile) return;

    setScanning(true);
    try {
      const result = await ocrApi.scanImage(selectedFile);
      setScanResult(result);
      success('Image scanned successfully! Review extracted items below.');
    } catch (err: any) {
      error(err.message || 'Failed to scan handwritten document');
    } finally {
      setScanning(false);
    }
  };

  const handleConfirmItems = async (
    items: ExtractedItem[],
    options: { listId?: string; newListTitle?: string }
  ) => {
    try {
      const savedList = await ocrApi.confirmToNewOrExistingList(items, options);
      success(`Saved ${items.length} items to "${savedList.title}"!`);
      navigate(`/lists/${savedList.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to save confirmed items');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto animate-fadeIn pb-10">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-1.5 text-nature-forest dark:text-darknature-highlight text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-nature-primary dark:text-darknature-primary" />
          <span>Digitick AI Assistant</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-nature-forest dark:text-darknature-text tracking-tight">
          AI-Powered Paper List Scanner
        </h2>
        <p className="text-xs text-nature-muted dark:text-darknature-muted mt-0.5">
          Convert traditional handwritten notes and paper checklists into structured digital shopping lists.
        </p>
      </div>

      {/* Mode Switcher (Upload vs Camera) */}
      {!scanResult && (
        <div className="flex rounded-xl bg-nature-offwhite dark:bg-darknature-sidebar border border-nature-border dark:border-darknature-border p-1 max-w-xs mx-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'upload'
                ? 'bg-nature-white dark:bg-darknature-card text-nature-forest dark:text-darknature-text border border-nature-border dark:border-darknature-border'
                : 'text-nature-muted hover:text-nature-text dark:hover:text-darknature-text'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('camera')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'camera'
                ? 'bg-nature-white dark:bg-darknature-card text-nature-forest dark:text-darknature-text border border-nature-border dark:border-darknature-border'
                : 'text-nature-muted hover:text-nature-text dark:hover:text-darknature-text'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Capture</span>
          </button>
        </div>
      )}

      {/* View: Camera Live Stream */}
      {mode === 'camera' && !scanResult && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={() => setMode('upload')}
        />
      )}

      {/* View: File Upload & Drag-and-Drop Area */}
      {mode === 'upload' && !previewUrl && !scanResult && (
        <label className="flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed border-nature-border dark:border-darknature-border hover:border-nature-primary dark:hover:border-darknature-primary rounded-2xl bg-nature-white dark:bg-darknature-card cursor-pointer transition-colors group">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
            }}
          />
          <div className="w-12 h-12 rounded-xl bg-nature-mint dark:bg-darknature-mint text-nature-forest dark:text-darknature-highlight flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-nature-text dark:text-darknature-text mb-1">
            Click to upload or drag & drop photo
          </span>
          <span className="text-xs text-nature-muted max-w-xs text-center mb-3">
            Supports PNG, JPG, or WEBP photos of handwritten shopping notes up to 10MB
          </span>
          <Button variant="secondary" size="sm" type="button" className="pointer-events-none">
            Browse Image
          </Button>
        </label>
      )}

      {/* View: Image Preview Before Processing */}
      {previewUrl && !scanResult && (
        <div className="bg-nature-white dark:bg-darknature-card rounded-2xl p-5 border border-nature-border dark:border-darknature-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-nature-forest dark:text-darknature-text">
              Note Preview Ready for OCR
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-nature-muted hover:text-nature-text dark:hover:text-darknature-text flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Image</span>
            </button>
          </div>

          <div className="w-full max-h-72 rounded-xl overflow-hidden bg-nature-offwhite dark:bg-darknature-sidebar mb-4 flex items-center justify-center border border-nature-border dark:border-darknature-border">
            <img
              src={previewUrl}
              alt="Handwritten note preview"
              className="max-h-72 w-auto object-contain rounded-xl"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-nature-border dark:border-darknature-border">
            <Button variant="outline" onClick={handleReset}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={scanning}
              onClick={handleProcessScan}
              icon={<Sparkles className="w-4 h-4" />}
            >
              {scanning ? 'Extracting with AI...' : 'Scan & Extract Items'}
            </Button>
          </div>
        </div>
      )}

      {/* View: Review and Confirmation Table */}
      {scanResult && (
        <OCRReviewTable
          items={scanResult.items}
          rawText={scanResult.raw_text}
          isSimulated={scanResult.is_simulated}
          activeLists={activeLists}
          onConfirm={handleConfirmItems}
          onReset={handleReset}
        />
      )}

      {/* Explanatory tips card */}
      <div className="p-3.5 rounded-xl bg-nature-mint dark:bg-darknature-mint border border-nature-border dark:border-darknature-border text-xs text-nature-forest dark:text-darknature-highlight space-y-1">
        <span className="font-bold flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" /> Tips for best OCR handwriting recognition:
        </span>
        <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] opacity-90">
          <li>Ensure good lighting and avoid heavy shadows on the paper note.</li>
          <li>Write one product per line (e.g. "2 kg Apple", "1 loaf Bread").</li>
          <li>Review and confirm every extracted product before saving to your list.</li>
        </ul>
      </div>
    </div>
  );
};
