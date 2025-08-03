import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const MediaUpload = ({ onMediaAdd, onMediaRemove, mediaList = [] }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraType, setCameraType] = useState('photo'); // 'photo' or 'video'
  const [isRecording, setIsRecording] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const supportedTypes = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/quicktime', 'video/webm', 'video/avi'],
    file: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/zip']
  };

  const uploadFiles = async (files) => {
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post('http://localhost:3001/api/upload/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      const uploadedFiles = response.data.files;
      console.log('📁 Upload response:', response.data);
      console.log('📎 Uploaded files:', uploadedFiles);
      uploadedFiles.forEach(file => onMediaAdd(file));
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Login to Upload. Upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isValid = Object.values(supportedTypes).flat().includes(file.mimetype || file.type);
      if (!isValid) {
        alert(`File type ${file.type} is not supported`);
      }
      return isValid;
    });

    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const startCamera = async (type = 'photo') => {
    console.log('📷 Starting camera for:', type);
    setCameraType(type);
    setCameraError('');
    setShowCamera(true);

    try {
      const constraints = {
        video: true,
        audio: type === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('📷 Camera started successfully');
      } else {
        console.error('❌ Video ref not available');
      }
    } catch (error) {
      console.error('❌ Camera start error:', error);
      setCameraError('Failed to access camera: ' + error.message);
    }
  };

  const capturePhoto = () => {
    console.log('📸 Capturing photo...');
    if (!videoRef.current) {
      console.error('❌ Video ref not available');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob(blob => {
        const file = new File([blob], `photo_${Date.now()}.png`, { type: 'image/png' });
        console.log('📸 Photo captured, uploading...');
        uploadFiles([file]);
        closeCamera();
      }, 'image/png');
    } catch (error) {
      console.error('❌ Photo capture error:', error);
      alert('Failed to capture photo: ' + error.message);
    }
  };

  const startVideoRecording = () => {
    console.log('🎥 Starting video recording...');
    if (!mediaStreamRef.current) {
      console.error('❌ Media stream not available');
      return;
    }

    try {
      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('🎥 Recording stopped, processing...');
        try {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
          console.log('🎥 Video processed, uploading...');
          uploadFiles([file]);
          closeCamera();
        } catch (error) {
          console.error('❌ Video processing error:', error);
          alert('Failed to process video: ' + error.message);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log('🎥 Recording started');
    } catch (error) {
      console.error('❌ Video recording start error:', error);
      alert('Failed to start recording: ' + error.message);
    }
  };

  const stopVideoRecording = () => {
    console.log('⏹️ Stopping video recording...');
    try {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        console.log('⏹️ Recording stopped');
      } else {
        console.log('⚠️ No recording to stop');
      }
    } catch (error) {
      console.error('❌ Stop recording error:', error);
      alert('Failed to stop recording: ' + error.message);
      setIsRecording(false);
    }
  };

  const closeCamera = () => {
    setShowCamera(false);
    setIsRecording(false);
    setCameraError('');
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <MediaUploadContainer>
      {/* Media Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <MediaButton onClick={() => fileInputRef.current?.click()}>
          <span style={{ fontSize: '18px' }}>📤</span>
          Upload Files
        </MediaButton>
        
        <MediaButton onClick={() => startCamera('photo')}>
          <span style={{ fontSize: '18px' }}>🎞️</span>
          Camera
        </MediaButton>
        
        <MediaButton onClick={() => startCamera('video')}>
          <span style={{ fontSize: '18px' }}>🎥</span>
          Record Video
        </MediaButton>
      </div>

      {/* Hidden File Input */}
      <HiddenInput
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Drop Zone */}
      <DropZone
        isDragOver={isDragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <span style={{ fontSize: '24px', marginBottom: '8px', color: '#666' }}>📤</span>
        <div>Drag & drop files here or click to select</div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
          Images, Videos, PDFs, Documents (Max 100MB per file)
        </div>
      </DropZone>

      {/* Media Previews */}
      {mediaList.length > 0 && (
        <MediaPreviewContainer>
          {mediaList.map((media, index) => (
            <MediaPreviewItem key={index} style={{ width: media.type === 'file' ? '200px' : '120px' }}>
              {uploading && (
                <LoadingOverlay>
                  Uploading...
                </LoadingOverlay>
              )}
              
              <RemoveButton onClick={() => onMediaRemove(index)}>
                ×
              </RemoveButton>

              {media.type === 'image' && (
                <img 
                  src={media.url} 
                  alt={media.originalName}
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
              )}

              {media.type === 'video' && (
                <div style={{ position: 'relative' }}>
                  <video 
                    src={media.url} 
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    muted
                  />
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.7)',
                    borderRadius: '50%',
                    padding: '8px'
                  }}>
                    <span style={{ fontSize: '16px', color: 'white' }}>▶</span>
                  </div>
                </div>
              )}

              {media.type === 'file' && (
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px', color: '#666' }}>📄</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '500',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {media.originalName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999' }}>
                      {formatFileSize(media.size)}
                    </div>
                  </div>
                </div>
              )}
            </MediaPreviewItem>
          ))}
        </MediaPreviewContainer>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <CameraModal>
          <CameraContainer>
            <VideoElement ref={videoRef} autoPlay muted />
            
            {cameraError && (
              <div style={{ color: 'red', fontSize: '14px' }}>{cameraError}</div>
            )}

            <ButtonGroup>
              {cameraType === 'photo' ? (
                <ActionButton primary onClick={capturePhoto}>
                  <span style={{ marginRight: '4px' }}>📷</span>
                  Capture Photo
                </ActionButton>
              ) : (
                <>
                  {!isRecording ? (
                    <ActionButton primary onClick={startVideoRecording}>
                      <span style={{ marginRight: '4px' }}>🎥</span>
                      Start Recording
                    </ActionButton>
                  ) : (
                    <ActionButton onClick={stopVideoRecording} style={{ background: '#e53935' }}>
                      <span style={{ marginRight: '4px' }}>⏹</span>
                      Stop Recording
                    </ActionButton>
                  )}
                </>
              )}
              
              <ActionButton onClick={closeCamera}>
                Cancel
              </ActionButton>
            </ButtonGroup>
          </CameraContainer>
        </CameraModal>
      )}

      {uploading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '10px', 
          background: '#f0f8ff', 
          borderRadius: '6px',
          marginTop: '10px'
        }}>
          <div>Uploading files to cloud...</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Please wait while your files are being processed
          </div>
        </div>
      )}
    </MediaUploadContainer>
  );
};

export default MediaUpload;


const MediaUploadContainer = styled.div`
  width: 100%;
`;

const MediaButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  font-size: 14px;
  color: #666;

  &:hover {
    background: #f5f5f5;
  }
`;

const DropZone = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin: 10px 0;
  background: ${props => props.isDragOver ? '#f0f8ff' : '#fafafa'};
  border-color: ${props => props.isDragOver ? '#0a66c2' : '#ddd'};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #0a66c2;
    background: #f0f8ff;
  }
`;

const MediaPreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
`;

const MediaPreviewItem = styled.div`
  position: relative;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  background: #f9f9f9;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 2;

  &:hover {
    background: rgba(231, 76, 60, 1);
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
`;

const CameraModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CameraContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const VideoElement = styled.video`
  width: 320px;
  height: 240px;
  background: #222;
  border-radius: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  
  ${props => props.primary ? `
    background: #0a66c2;
    color: white;
    &:hover { background: #084a94; }
  ` : `
    background: #e53935;
    color: white;
    &:hover { background: #c62828; }
  `}
`;

const HiddenInput = styled.input`
  display: none;
`;
