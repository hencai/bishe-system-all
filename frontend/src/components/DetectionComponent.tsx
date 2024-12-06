import React, { useState, useCallback } from 'react';
import { DetectionResult, Detection } from '../types/detection';
import { saveDetectionRecord } from '../api/detectionApi';

interface DetectionComponentProps {
  onDetectionComplete?: (result: DetectionResult) => void;
}

export const DetectionComponent: React.FC<DetectionComponentProps> = ({ onDetectionComplete }) => {
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDetectionSuccess = useCallback(async (result: DetectionResult) => {
    try {
      setIsProcessing(true);
      
      const recordData = {
        taskId: result.taskId,
        originalImageUrl: originalImageUrl,
        resultImageUrl: result.result_image || result.resultImage || '',
      };

      await saveDetectionRecord(recordData);
      console.log('Detection record saved successfully');
      
      if (onDetectionComplete) {
        onDetectionComplete(result);
      }
    } catch (error) {
      console.error('Error saving detection record:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [originalImageUrl, onDetectionComplete]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setOriginalImageUrl(imageUrl);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload}
        disabled={isProcessing}
      />
      {originalImageUrl && (
        <img 
          src={originalImageUrl} 
          alt="Original" 
          style={{ maxWidth: '100%', marginTop: '10px' }}
        />
      )}
      {isProcessing && <div>Processing...</div>}
    </div>
  );
};

export default DetectionComponent;