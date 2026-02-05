// import React, { useState, useEffect, useRef } from 'react';
// import { Upload, FileText, CheckCircle, XCircle, Download, RefreshCw, AlertCircle, Brain, Type, Sparkles, Volume2, VolumeX, Loader, Languages } from 'lucide-react';
// import jsPDF from 'jspdf';

// const API_URL = 'http://localhost:8000';

// export default function HandwritingProcessor() {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [apiHealth, setApiHealth] = useState(false);
//   const [activeTab, setActiveTab] = useState('extracted');
//   const [processingMode, setProcessingMode] = useState('enhanced');
  
//   // TTS States
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [ttsLoading, setTtsLoading] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState('auto');
//   const [availableVoices, setAvailableVoices] = useState(null);
//   const [showTtsPanel, setShowTtsPanel] = useState(false);
//   const audioRef = useRef(null);

//   // Check API health on mount
//   useEffect(() => {
//     checkApiHealth();
//     fetchAvailableVoices();
//     const interval = setInterval(checkApiHealth, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const checkApiHealth = async () => {
//     try {
//       const response = await fetch(`${API_URL}/health`);
//       setApiHealth(response.ok);
//     } catch (err) {
//       setApiHealth(false);
//     }
//   };

//   // Fetch available TTS voices
//   const fetchAvailableVoices = async () => {
//     try {
//       const response = await fetch(`${API_URL}/tts/voices`);
//       if (response.ok) {
//         const data = await response.json();
//         setAvailableVoices(data.data);
//       }
//     } catch (err) {
//       console.error('Failed to fetch voices:', err);
//     }
//   };

//   // Text-to-Speech function
//   const speakText = async (text, language = 'auto') => {
//     if (!text) {
//       alert('No text available to speak');
//       return;
//     }

//     setTtsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${API_URL}/tts/generate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           text: text,
//           language: language
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to generate speech');
//       }

//       const audioBlob = await response.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);

//       // Stop any currently playing audio
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current = null;
//       }

//       // Create and play new audio
//       const audio = new Audio(audioUrl);
//       audioRef.current = audio;
      
//       audio.onplay = () => setIsSpeaking(true);
//       audio.onended = () => {
//         setIsSpeaking(false);
//         URL.revokeObjectURL(audioUrl);
//       };
//       audio.onerror = () => {
//         setIsSpeaking(false);
//         setError('Audio playback failed');
//       };

//       await audio.play();
//     } catch (err) {
//       setError(`TTS Error: ${err.message}`);
//       setIsSpeaking(false);
//     } finally {
//       setTtsLoading(false);
//     }
//   };

//   // Stop speaking
//   const stopSpeaking = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//       audioRef.current = null;
//     }
//     setIsSpeaking(false);
//   };

//   // Get text based on active tab
//   const getCurrentTabText = () => {
//     if (!result) return '';
    
//     switch (activeTab) {
//       case 'extracted':
//         return result.extracted_text || '';
//       case 'reconstruction':
//         return result.context_reconstruction?.reconstructed_text || '';
//       case 'corrected':
//         return result.corrected_text || '';
//       case 'translated':
//         return result.fully_translated_text || '';
//       case 'summary':
//         return result.summary_and_keywords || '';
//       default:
//         return result.fully_translated_text || '';
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setError(null);
//       setResult(null);
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile && droppedFile.type.startsWith('image/')) {
//       setFile(droppedFile);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(droppedFile);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const processImage = async () => {
//     if (!file) {
//       setError('Please select an image first');
//       return;
//     }

//     if (!apiHealth) {
//       setError('Backend API is not available. Please start the server.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const endpoint = processingMode === 'enhanced' ? '/process-enhanced' : '/process';
//       const response = await fetch(`${API_URL}${endpoint}`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       if (data.status === 'success') {
//         setResult(data.data);
//         setActiveTab('extracted');
//       } else {
//         throw new Error(data.message || 'Processing failed');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     setFile(null);
//     setPreview(null);
//     setResult(null);
//     setError(null);
//     setActiveTab('extracted');
//     stopSpeaking();
//     setShowTtsPanel(false);
//   };

//   const downloadReport = () => {
//     if (!result) return;

//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 20;
//     const maxWidth = pageWidth - 2 * margin;
//     let yPosition = 20;

//     const addText = (text, fontSize = 12, isBold = false) => {
//       doc.setFontSize(fontSize);
//       if (isBold) {
//         doc.setFont(undefined, 'bold');
//       } else {
//         doc.setFont(undefined, 'normal');
//       }
      
//       const lines = doc.splitTextToSize(text, maxWidth);
//       lines.forEach(line => {
//         if (yPosition > 270) {
//           doc.addPage();
//           yPosition = 20;
//         }
//         doc.text(line, margin, yPosition);
//         yPosition += fontSize * 0.5;
//       });
//       yPosition += 5;
//     };

//     addText('HANDWRITTEN DOCUMENT ANALYSIS REPORT', 16, true);
//     yPosition += 5;

//     if (result.text_type) {
//       addText('DOCUMENT TYPE:', 14, true);
//       addText(result.text_type);
//       yPosition += 5;
//     }

//     addText('EXTRACTED TEXT:', 14, true);
//     addText(result.extracted_text || 'N/A');
//     yPosition += 5;

//     if (result.context_reconstruction) {
//       addText('CONTEXT RECONSTRUCTION:', 14, true);
//       addText(result.context_reconstruction.reconstructed_text || 'N/A');
//       addText(`Note: ${result.context_reconstruction.comment || 'N/A'}`, 10);
//       yPosition += 5;
//     }

//     addText('CORRECTED TEXT:', 14, true);
//     addText(result.corrected_text || 'N/A');
//     yPosition += 5;

//     addText('TRANSLATED TEXT:', 14, true);
//     addText(result.fully_translated_text || 'N/A');
//     yPosition += 5;

//     if (result.mood_analysis) {
//       addText('MOOD ANALYSIS:', 14, true);
//       addText(`Mood: ${result.mood_analysis.mood || 'N/A'}`);
//       addText(`Emotional Tone: ${result.mood_analysis.emotional_tone || 'N/A'}`);
//       addText(`Energy Level: ${result.mood_analysis.energy_level || 'N/A'}`);
//       addText(`Overall Impression: ${result.mood_analysis.overall_impression || 'N/A'}`);
//       yPosition += 5;
//     }

//     addText('AI-GENERATED ANALYSIS:', 14, true);
//     addText(result.summary_and_keywords || 'N/A');
//     yPosition += 5;

//     doc.save('handwriting_analysis_report.pdf');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//                 <FileText className="w-8 h-8 text-blue-600" />
//                 Handwriting Document Processor
//               </h1>
//               <p className="text-gray-600 mt-1">Upload handwritten documents for OCR, translation, and intelligent analysis</p>
//             </div>
//             <div className="flex items-center gap-2">
//               {apiHealth ? (
//                 <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
//                   <CheckCircle className="w-5 h-5" />
//                   <span className="font-medium">Connected</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
//                   <XCircle className="w-5 h-5" />
//                   <span className="font-medium">API Offline</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Upload Section */}
//         {!result && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {/* File Upload */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Image</h2>
              
//               <div
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
//               >
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                   id="file-upload"
//                 />
//                 <label htmlFor="file-upload" className="cursor-pointer">
//                   <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
//                   <p className="text-gray-600 mb-2">
//                     Drag and drop your image here, or click to browse
//                   </p>
//                   <p className="text-sm text-gray-400">
//                     Supports PNG, JPG, JPEG
//                   </p>
//                 </label>
//               </div>

//               {preview && (
//                 <div className="mt-6">
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className="w-full h-64 object-contain rounded-lg border border-gray-200"
//                   />
//                   <div className="mt-3 text-sm text-gray-600">
//                     <p><strong>File:</strong> {file.name}</p>
//                     <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Info & Actions */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-semibold mb-4 text-gray-800">Processing Mode</h2>
              
//               {/* Mode Selection */}
//               <div className="mb-6 space-y-3">
//                 <button
//                   onClick={() => setProcessingMode('basic')}
//                   className={`w-full p-4 rounded-lg border-2 transition-all ${
//                     processingMode === 'basic'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <div className="flex items-start gap-3">
//                     <FileText className={`w-6 h-6 ${processingMode === 'basic' ? 'text-blue-600' : 'text-violet-400'}`} />
//                     <div className="text-left">
//                       <h3 className="font-semibold text-gray-800">Basic Processing</h3>
//                       <p className="text-sm text-gray-600">OCR, translation, correction & summary</p>
//                     </div>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => setProcessingMode('enhanced')}
//                   className={`w-full p-4 rounded-lg border-2 transition-all ${
//                     processingMode === 'enhanced'
//                       ? 'border-purple-500 bg-purple-50'
//                       : 'border-violet-200 hover:border-black-300'
//                   }`}
//                 >
//                   <div className="flex items-start gap-3">
//                     <Sparkles className={`w-6 h-6 ${processingMode === 'enhanced' ? 'text-purple-600' : 'text-gray-400'}`} />
//                     <div className="text-left">
//                       <h3 className="font-semibold text-gray-800">Enhanced Processing</h3>
//                       <p className="text-sm text-gray-600">All features + text type, mood analysis & context reconstruction</p>
//                     </div>
//                   </div>
//                 </button>
//               </div>

//               <h3 className="text-lg font-semibold mb-3 text-gray-800">Features</h3>
//               <div className="space-y-3 mb-6">
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <FileText className="w-4 h-4 text-blue-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-800">OCR Extraction</h4>
//                     <p className="text-sm text-gray-600">Extract text from handwritten documents</p>
//                   </div>
//                 </div>

//                 {processingMode === 'enhanced' && (
//                   <>
//                     <div className="flex items-start gap-3">
//                       <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Type className="w-4 h-4 text-indigo-600" />
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-gray-800">Text Type Detection</h4>
//                         <p className="text-sm text-gray-600">Identify handwritten vs typed text</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Sparkles className="w-4 h-4 text-pink-600" />
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-gray-800">Context Reconstruction</h4>
//                         <p className="text-sm text-gray-600">Reconstruct incomplete text fragments</p>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <span className="text-purple-600 font-bold text-xs">TR</span>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-800">Translation</h4>
//                     <p className="text-sm text-gray-600">Automatic language detection and translation</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <CheckCircle className="w-4 h-4 text-green-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-800">Text Enhancement</h4>
//                     <p className="text-sm text-gray-600">AI-powered correction and enrichment</p>
//                   </div>
//                 </div>

//                 {processingMode === 'enhanced' && (
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                       <Brain className="w-4 h-4 text-rose-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-800">Mood Analysis</h4>
//                       <p className="text-sm text-gray-600">Analyze emotional state from handwriting</p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <span className="text-orange-600 font-bold text-xs">AI</span>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-800">Summary & Keywords</h4>
//                     <p className="text-sm text-gray-600">Generate intelligent summaries and extract keywords</p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={processImage}
//                 disabled={!file || loading || !apiHealth}
//                 className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
//                   processingMode === 'enhanced'
//                     ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-300'
//                     : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300'
//                 } disabled:cursor-not-allowed text-white`}
//               >
//                 {loading ? (
//                   <>
//                     <RefreshCw className="w-5 h-5 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     {processingMode === 'enhanced' ? (
//                       <Sparkles className="w-5 h-5" />
//                     ) : (
//                       <FileText className="w-5 h-5" />
//                     )}
//                     {processingMode === 'enhanced' ? 'Process with AI Enhancements' : 'Process Document'}
//                   </>
//                 )}
//               </button>

//               {error && (
//                 <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
//                   <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//                   <p className="text-red-700 text-sm">{error}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Results Section */}
//         {result && (
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">Processing Results</h2>
//               <div className="flex gap-3">
//                 {/* TTS Toggle Button - NEW */}
//                 <button
//                   onClick={() => setShowTtsPanel(!showTtsPanel)}
//                   className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
//                 >
//                   <Volume2 className="w-5 h-5" />
//                   {showTtsPanel ? 'Hide' : 'Show'} Text-to-Speech
//                 </button>
                
//                 <button
//                   onClick={downloadReport}
//                   className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download Report
//                 </button>
//                 <button
//                   onClick={reset}
//                   className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
//                 >
//                   <RefreshCw className="w-5 h-5" />
//                   Process Another
//                 </button>
//               </div>
//             </div>

//             {/* TTS Control Panel - NEW */}
//             {showTtsPanel && (
//               <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
//                       <Volume2 className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-gray-800">Text-to-Speech Controls</h3>
//                       <p className="text-sm text-gray-600">Listen to the processed text in multiple languages</p>
//                     </div>
//                   </div>
                  
//                   {isSpeaking && (
//                     <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
//                       <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
//                       <span className="text-sm font-medium">Playing</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   {/* Language Selection */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       <Languages className="w-4 h-4 inline mr-1" />
//                       Select Voice Language
//                     </label>
//                     <select
//                       value={selectedLanguage}
//                       onChange={(e) => setSelectedLanguage(e.target.value)}
//                       className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white"
//                       disabled={isSpeaking || ttsLoading}
//                     >
//                       <option value="auto">Auto-Detect Language</option>
//                       <option value="english">English</option>
//                       <option value="hindi">Hindi (हिंदी)</option>
//                       <option value="marathi">Marathi (मराठी)</option>
//                       <option value="german">German (Deutsch)</option>
//                       <option value="french">French (Français)</option>
//                       <option value="spanish">Spanish (Español)</option>
//                     </select>
//                   </div>

//                   {/* Current Tab Info */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Current Text Section
//                     </label>
//                     <div className="px-4 py-2 bg-white border-2 border-indigo-200 rounded-lg">
//                       <span className="capitalize font-medium text-gray-800">
//                         {activeTab === 'reconstruction' ? 'Reconstructed Text' : `${activeTab} Text`}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3">
//                   {!isSpeaking ? (
//                     <button
//                       onClick={() => speakText(getCurrentTabText(), selectedLanguage)}
//                       disabled={ttsLoading || !getCurrentTabText()}
//                       className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
//                     >
//                       {ttsLoading ? (
//                         <>
//                           <Loader className="w-5 h-5 animate-spin" />
//                           Generating Audio...
//                         </>
//                       ) : (
//                         <>
//                           <Volume2 className="w-5 h-5" />
//                           Speak Current Tab
//                         </>
//                       )}
//                     </button>
//                   ) : (
//                     <button
//                       onClick={stopSpeaking}
//                       className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
//                     >
//                       <VolumeX className="w-5 h-5" />
//                       Stop Speaking
//                     </button>
//                   )}

//                   {/* Quick Speak Buttons */}
//                   <button
//                     onClick={() => speakText(result.fully_translated_text, selectedLanguage)}
//                     disabled={ttsLoading || isSpeaking || !result.fully_translated_text}
//                     className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
//                   >
//                     <Volume2 className="w-5 h-5" />
//                     Speak Translated
//                   </button>
//                 </div>

//                 {availableVoices && (
//                   <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
//                     <CheckCircle className="w-4 h-4 text-green-600" />
//                     {availableVoices.supported_languages.length} languages available
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Enhanced Info Cards */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div className="bg-blue-50 rounded-lg p-4 text-center">
//                 <p className="text-3xl font-bold text-blue-600">{result.statistics?.word_count || 0}</p>
//                 <p className="text-gray-600 mt-1">Words</p>
//               </div>
//               <div className="bg-purple-50 rounded-lg p-4 text-center">
//                 <p className="text-3xl font-bold text-purple-600">{result.statistics?.character_count || 0}</p>
//                 <p className="text-gray-600 mt-1">Characters</p>
//               </div>
//               {result.text_type && (
//                 <div className="bg-indigo-50 rounded-lg p-4 text-center">
//                   <p className="text-lg font-bold text-indigo-600">{result.text_type}</p>
//                   <p className="text-gray-600 mt-1">Text Type</p>
//                 </div>
//               )}
//               {result.mood_analysis && (
//                 <div className="bg-rose-50 rounded-lg p-4 text-center">
//                   <p className="text-lg font-bold text-rose-600 capitalize">{result.mood_analysis.energy_level}</p>
//                   <p className="text-gray-600 mt-1">Energy</p>
//                 </div>
//               )}
//             </div>

//             {/* Tabs */}
//             <div className="border-b border-gray-200 mb-6">
//               <div className="flex gap-2 flex-wrap">
//                 <button
//                   onClick={() => setActiveTab('extracted')}
//                   className={`px-4 py-2 font-medium transition-colors border-b-2 ${
//                     activeTab === 'extracted'
//                       ? 'border-blue-600 text-blue-600'
//                       : 'border-transparent text-gray-600 hover:text-gray-800'
//                   }`}
//                 >
//                   Extracted Text
//                 </button>
//                 {result.context_reconstruction && (
//                   <button
//                     onClick={() => setActiveTab('reconstruction')}
//                     className={`px-4 py-2 font-medium transition-colors border-b-2 ${
//                       activeTab === 'reconstruction'
//                         ? 'border-pink-600 text-pink-600'
//                         : 'border-transparent text-gray-600 hover:text-gray-800'
//                     }`}
//                   >
//                     Reconstructed
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setActiveTab('corrected')}
//                   className={`px-4 py-2 font-medium transition-colors border-b-2 ${
//                     activeTab === 'corrected'
//                       ? 'border-green-600 text-green-600'
//                       : 'border-transparent text-gray-600 hover:text-gray-800'
//                   }`}
//                 >
//                   Corrected
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('translated')}
//                   className={`px-4 py-2 font-medium transition-colors border-b-2 ${
//                     activeTab === 'translated'
//                       ? 'border-purple-600 text-purple-600'
//                       : 'border-transparent text-gray-600 hover:text-gray-800'
//                   }`}
//                 >
//                   Translated
//                 </button>
//                 {result.mood_analysis && (
//                   <button
//                     onClick={() => setActiveTab('mood')}
//                     className={`px-4 py-2 font-medium transition-colors border-b-2 ${
//                       activeTab === 'mood'
//                         ? 'border-rose-600 text-rose-600'
//                         : 'border-transparent text-gray-600 hover:text-gray-800'
//                     }`}
//                   >
//                     Mood Analysis
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setActiveTab('summary')}
//                   className={`px-4 py-2 font-medium transition-colors border-b-2 ${
//                     activeTab === 'summary'
//                       ? 'border-orange-600 text-orange-600'
//                       : 'border-transparent text-gray-600 hover:text-gray-800'
//                   }`}
//                 >
//                   Summary
//                 </button>
//               </div>
//             </div>

//             {/* Tab Content */}
//             <div className="bg-gray-50 rounded-lg p-6 min-h-64">
//               {/* Inline TTS Button for Each Tab - NEW */}
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {activeTab === 'extracted' && 'Extracted Text (Raw OCR)'}
//                   {activeTab === 'reconstruction' && 'Context Reconstruction'}
//                   {activeTab === 'corrected' && 'Corrected & Enriched Text'}
//                   {activeTab === 'translated' && 'Fully Translated Text (English)'}
//                   {activeTab === 'mood' && 'Handwriting Mood Analysis'}
//                   {activeTab === 'summary' && 'AI-Generated Analysis'}
//                 </h3>
                
//                 {activeTab !== 'mood' && (
//                   <button
//                     onClick={() => speakText(getCurrentTabText(), selectedLanguage)}
//                     disabled={ttsLoading || isSpeaking || !getCurrentTabText()}
//                     className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
//                   >
//                     {ttsLoading ? (
//                       <Loader className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Volume2 className="w-4 h-4" />
//                     )}
//                     Listen
//                   </button>
//                 )}
//               </div>

//               {activeTab === 'extracted' && (
//                 <div>
//                   <p className="text-gray-700 whitespace-pre-wrap">{result.extracted_text || 'No text extracted'}</p>
//                 </div>
//               )}

//               {activeTab === 'reconstruction' && result.context_reconstruction && (
//                 <div>
//                   <div className="mb-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
//                     <p className="text-sm text-pink-800">
//                       <strong>Analysis:</strong> {result.context_reconstruction.comment}
//                     </p>
//                     {result.context_reconstruction.reconstruction_performed && (
//                       <p className="text-xs text-pink-600 mt-2">✓ Text was reconstructed for better context</p>
//                     )}
//                   </div>
//                   <p className="text-gray-700 whitespace-pre-wrap">{result.context_reconstruction.reconstructed_text}</p>
//                 </div>
//               )}

//               {activeTab === 'corrected' && (
//                 <div>
//                   <p className="text-gray-700 whitespace-pre-wrap">{result.corrected_text || 'No correction available'}</p>
//                 </div>
//               )}

//               {activeTab === 'translated' && (
//                 <div>
//                   <p className="text-gray-700 whitespace-pre-wrap">{result.fully_translated_text || 'No translation available'}</p>
//                 </div>
//               )}

//               {activeTab === 'mood' && result.mood_analysis && (
//                 <div>
//                   <div className="space-y-4">
//                     <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
//                       <h4 className="font-semibold text-rose-900 mb-2">Mood</h4>
//                       <p className="text-gray-700">{result.mood_analysis.mood}</p>
//                     </div>
//                     <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
//                       <h4 className="font-semibold text-purple-900 mb-2">Emotional Tone</h4>
//                       <p className="text-gray-700">{result.mood_analysis.emotional_tone}</p>
//                     </div>
//                     <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                       <h4 className="font-semibold text-blue-900 mb-2">Energy Level</h4>
//                       <p className="text-gray-700 capitalize">{result.mood_analysis.energy_level}</p>
//                     </div>
//                     <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                       <h4 className="font-semibold text-green-900 mb-2">Overall Impression</h4>
//                       <p className="text-gray-700">{result.mood_analysis.overall_impression}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'summary' && (
//                 <div>
//                   <div className="text-gray-700 whitespace-pre-wrap prose max-w-none">
//                     {result.summary_and_keywords || 'No summary available'}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Download, RefreshCw, AlertCircle, Brain, Type, Sparkles, Volume2, VolumeX, Loader, Languages, FileImage } from 'lucide-react';
import jsPDF from 'jspdf';

const API_URL = 'http://localhost:8000';

// PDF.js setup - using CDN
const loadPdfJs = () => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export default function HandwritingProcessor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState(false);
  const [activeTab, setActiveTab] = useState('extracted');
  const [processingMode, setProcessingMode] = useState('enhanced');
  
  // TTS States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [availableVoices, setAvailableVoices] = useState(null);
  const [showTtsPanel, setShowTtsPanel] = useState(false);
  
  // PDF States
  const [pdfPages, setPdfPages] = useState([]);
  const [selectedPdfPage, setSelectedPdfPage] = useState(0);
  const [isPdfFile, setIsPdfFile] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  
  const audioRef = useRef(null);

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
    fetchAvailableVoices();
    const interval = setInterval(checkApiHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      setApiHealth(response.ok);
    } catch (err) {
      setApiHealth(false);
    }
  };

  // Fetch available TTS voices
  const fetchAvailableVoices = async () => {
    try {
      const response = await fetch(`${API_URL}/tts/voices`);
      if (response.ok) {
        const data = await response.json();
        setAvailableVoices(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch voices:', err);
    }
  };

  // Text-to-Speech function
  const speakText = async (text, language = 'auto') => {
    if (!text) {
      alert('No text available to speak');
      return;
    }

    setTtsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/tts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: language
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Create and play new audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        setError('Audio playback failed');
      };

      await audio.play();
    } catch (err) {
      setError(`TTS Error: ${err.message}`);
      setIsSpeaking(false);
    } finally {
      setTtsLoading(false);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  // Get text based on active tab
  const getCurrentTabText = () => {
    if (!result) return '';
    
    switch (activeTab) {
      case 'extracted':
        return result.extracted_text || '';
      case 'reconstruction':
        return result.context_reconstruction?.reconstructed_text || '';
      case 'corrected':
        return result.corrected_text || '';
      case 'translated':
        return result.fully_translated_text || '';
      case 'summary':
        return result.summary_and_keywords || '';
      default:
        return result.fully_translated_text || '';
    }
  };

  // Handle PDF file processing
  const handlePdfFile = async (pdfFile) => {
    setPdfLoading(true);
    setError(null);
    
    try {
      const pdfjsLib = await loadPdfJs();
      
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          
          const pages = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({ canvasContext: context, viewport }).promise;
            pages.push({
              pageNumber: i,
              imageUrl: canvas.toDataURL('image/png')
            });
          }
          
          setPdfPages(pages);
          setSelectedPdfPage(0);
          if (pages.length > 0) {
            setPreview(pages[0].imageUrl);
          }
          setPdfLoading(false);
        } catch (err) {
          setError(`Failed to process PDF: ${err.message}`);
          setIsPdfFile(false);
          setPdfLoading(false);
        }
      };
      
      fileReader.onerror = () => {
        setError('Failed to read PDF file');
        setIsPdfFile(false);
        setPdfLoading(false);
      };
      
      fileReader.readAsArrayBuffer(pdfFile);
    } catch (err) {
      setError(`Failed to load PDF library: ${err.message}`);
      setIsPdfFile(false);
      setPdfLoading(false);
    }
  };

  const handlePdfPageChange = (pageIndex) => {
    setSelectedPdfPage(pageIndex);
    setPreview(pdfPages[pageIndex].imageUrl);
    setResult(null); // Clear previous results when changing pages
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
      
      // Check if it's a PDF
      if (selectedFile.type === 'application/pdf') {
        setIsPdfFile(true);
        handlePdfFile(selectedFile);
      } else {
        setIsPdfFile(false);
        setPdfPages([]);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.startsWith('image/') || droppedFile.type === 'application/pdf')) {
      setFile(droppedFile);
      setError(null);
      setResult(null);
      
      if (droppedFile.type === 'application/pdf') {
        setIsPdfFile(true);
        handlePdfFile(droppedFile);
      } else {
        setIsPdfFile(false);
        setPdfPages([]);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(droppedFile);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const processImage = async () => {
    if (!file) {
      setError('Please select an image or PDF first');
      return;
    }

    if (!apiHealth) {
      setError('Backend API is not available. Please start the server.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    
    // For PDF files, convert the selected page to a blob
    if (isPdfFile && pdfPages.length > 0) {
      const response = await fetch(pdfPages[selectedPdfPage].imageUrl);
      const blob = await response.blob();
      formData.append('file', blob, `page_${selectedPdfPage + 1}.png`);
    } else {
      formData.append('file', file);
    }

    try {
      const endpoint = processingMode === 'enhanced' ? '/process-enhanced' : '/process';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setResult(data.data);
        setActiveTab('extracted');
      } else {
        throw new Error(data.message || 'Processing failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setActiveTab('extracted');
    setIsPdfFile(false);
    setPdfPages([]);
    setSelectedPdfPage(0);
    stopSpeaking();
    setShowTtsPanel(false);
  };

  const downloadReport = () => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    const addText = (text, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }
      
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach(line => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
      yPosition += 5;
    };

    addText('HANDWRITTEN DOCUMENT ANALYSIS REPORT', 16, true);
    yPosition += 5;

    if (isPdfFile) {
      addText(`Source: PDF Document (Page ${selectedPdfPage + 1})`, 10);
      yPosition += 3;
    }

    if (result.text_type) {
      addText('DOCUMENT TYPE:', 14, true);
      addText(result.text_type);
      yPosition += 5;
    }

    addText('EXTRACTED TEXT:', 14, true);
    addText(result.extracted_text || 'N/A');
    yPosition += 5;

    if (result.context_reconstruction) {
      addText('CONTEXT RECONSTRUCTION:', 14, true);
      addText(result.context_reconstruction.reconstructed_text || 'N/A');
      addText(`Note: ${result.context_reconstruction.comment || 'N/A'}`, 10);
      yPosition += 5;
    }

    addText('CORRECTED TEXT:', 14, true);
    addText(result.corrected_text || 'N/A');
    yPosition += 5;

    addText('TRANSLATED TEXT:', 14, true);
    addText(result.fully_translated_text || 'N/A');
    yPosition += 5;

    if (result.mood_analysis) {
      addText('MOOD ANALYSIS:', 14, true);
      addText(`Mood: ${result.mood_analysis.mood || 'N/A'}`);
      addText(`Emotional Tone: ${result.mood_analysis.emotional_tone || 'N/A'}`);
      addText(`Energy Level: ${result.mood_analysis.energy_level || 'N/A'}`);
      addText(`Overall Impression: ${result.mood_analysis.overall_impression || 'N/A'}`);
      yPosition += 5;
    }

    addText('AI-GENERATED ANALYSIS:', 14, true);
    addText(result.summary_and_keywords || 'N/A');
    yPosition += 5;

    doc.save('handwriting_analysis_report.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Handwriting Document Processor
              </h1>
              <p className="text-gray-600 mt-1">Upload handwritten documents or PDFs for OCR, translation, and intelligent analysis</p>
            </div>
            <div className="flex items-center gap-2">
              {apiHealth ? (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">API Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        {!result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* File Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Image or PDF</h2>
              
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop your image or PDF here, or click to browse
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports PNG, JPG, JPEG, PDF
                  </p>
                </label>
              </div>

              {pdfLoading && (
                <div className="mt-6 flex items-center justify-center gap-3 text-blue-600">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Loading PDF pages...</span>
                </div>
              )}

              {preview && !pdfLoading && (
                <div className="mt-6">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-contain rounded-lg border border-gray-200"
                  />
                  
                  {/* PDF Page Selector */}
                  {isPdfFile && pdfPages.length > 1 && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileImage className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">
                            PDF Pages ({pdfPages.length} total)
                          </span>
                        </div>
                        <span className="text-sm text-blue-700">
                          Page {selectedPdfPage + 1} selected
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                        {pdfPages.map((page, index) => (
                          <button
                            key={index}
                            onClick={() => handlePdfPageChange(index)}
                            className={`relative p-2 rounded border-2 transition-all ${
                              selectedPdfPage === index
                                ? 'border-blue-600 bg-blue-100'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <img
                              src={page.imageUrl}
                              alt={`Page ${page.pageNumber}`}
                              className="w-full h-20 object-contain"
                            />
                            <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                              {page.pageNumber}
                            </span>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        💡 Click on a page to select it for processing
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <p><strong>File:</strong> {file.name}</p>
                    <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                    {isPdfFile && (
                      <p><strong>Type:</strong> PDF Document ({pdfPages.length} page{pdfPages.length !== 1 ? 's' : ''})</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Info & Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Processing Mode</h2>
              
              {/* Mode Selection */}
              <div className="mb-6 space-y-3">
                <button
                  onClick={() => setProcessingMode('basic')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    processingMode === 'basic'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FileText className={`w-6 h-6 ${processingMode === 'basic' ? 'text-blue-600' : 'text-violet-400'}`} />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">Basic Processing</h3>
                      <p className="text-sm text-gray-600">OCR, translation, correction & summary</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setProcessingMode('enhanced')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    processingMode === 'enhanced'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-violet-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className={`w-6 h-6 ${processingMode === 'enhanced' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">Enhanced Processing</h3>
                      <p className="text-sm text-gray-600">All features + text type, mood analysis & context reconstruction</p>
                    </div>
                  </div>
                </button>
              </div>

              <h3 className="text-lg font-semibold mb-3 text-gray-800">Features</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">OCR Extraction</h4>
                    <p className="text-sm text-gray-600">Extract text from handwritten documents</p>
                  </div>
                </div>

                {processingMode === 'enhanced' && (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Type className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Text Type Detection</h4>
                        <p className="text-sm text-gray-600">Identify handwritten vs typed text</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Context Reconstruction</h4>
                        <p className="text-sm text-gray-600">Reconstruct incomplete text fragments</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-xs">TR</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Translation</h4>
                    <p className="text-sm text-gray-600">Automatic language detection and translation</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Text Enhancement</h4>
                    <p className="text-sm text-gray-600">AI-powered correction and enrichment</p>
                  </div>
                </div>

                {processingMode === 'enhanced' && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Mood Analysis</h4>
                      <p className="text-sm text-gray-600">Analyze emotional state from handwriting</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-xs">AI</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Summary & Keywords</h4>
                    <p className="text-sm text-gray-600">Generate intelligent summaries and extract keywords</p>
                  </div>
                </div>
              </div>

              <button
                onClick={processImage}
                disabled={!file || loading || !apiHealth || pdfLoading}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  processingMode === 'enhanced'
                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-300'
                    : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300'
                } disabled:cursor-not-allowed text-white`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {processingMode === 'enhanced' ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                    {processingMode === 'enhanced' ? 'Process with AI Enhancements' : 'Process Document'}
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Processing Results</h2>
                {isPdfFile && (
                  <p className="text-sm text-gray-600 mt-1">Results for page {selectedPdfPage + 1} of {pdfPages.length}</p>
                )}
              </div>
              <div className="flex gap-3">
                {/* TTS Toggle Button */}
                <button
                  onClick={() => setShowTtsPanel(!showTtsPanel)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  {showTtsPanel ? 'Hide' : 'Show'} Text-to-Speech
                </button>
                
                <button
                  onClick={downloadReport}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Report
                </button>
                <button
                  onClick={reset}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Process Another
                </button>
              </div>
            </div>

            {/* TTS Control Panel */}
            {showTtsPanel && (
              <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Text-to-Speech Controls</h3>
                      <p className="text-sm text-gray-600">Listen to the processed text in multiple languages</p>
                    </div>
                  </div>
                  
                  {isSpeaking && (
                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Playing</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Language Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Languages className="w-4 h-4 inline mr-1" />
                      Select Voice Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white"
                      disabled={isSpeaking || ttsLoading}
                    >
                      <option value="auto">Auto-Detect Language</option>
                      <option value="english">English</option>
                      <option value="hindi">Hindi (हिंदी)</option>
                      <option value="marathi">Marathi (मराठी)</option>
                      <option value="german">German (Deutsch)</option>
                      <option value="french">French (Français)</option>
                      <option value="spanish">Spanish (Español)</option>
                    </select>
                  </div>

                  {/* Current Tab Info */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Text Section
                    </label>
                    <div className="px-4 py-2 bg-white border-2 border-indigo-200 rounded-lg">
                      <span className="capitalize font-medium text-gray-800">
                        {activeTab === 'reconstruction' ? 'Reconstructed Text' : `${activeTab} Text`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!isSpeaking ? (
                    <button
                      onClick={() => speakText(getCurrentTabText(), selectedLanguage)}
                      disabled={ttsLoading || !getCurrentTabText()}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {ttsLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Generating Audio...
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-5 h-5" />
                          Speak Current Tab
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={stopSpeaking}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <VolumeX className="w-5 h-5" />
                      Stop Speaking
                    </button>
                  )}

                  {/* Quick Speak Buttons */}
                  <button
                    onClick={() => speakText(result.fully_translated_text, selectedLanguage)}
                    disabled={ttsLoading || isSpeaking || !result.fully_translated_text}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Volume2 className="w-5 h-5" />
                    Speak Translated
                  </button>
                </div>

                {availableVoices && (
                  <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {availableVoices.supported_languages.length} languages available
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{result.statistics?.word_count || 0}</p>
                <p className="text-gray-600 mt-1">Words</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{result.statistics?.character_count || 0}</p>
                <p className="text-gray-600 mt-1">Characters</p>
              </div>
              {result.text_type && (
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-indigo-600">{result.text_type}</p>
                  <p className="text-gray-600 mt-1">Text Type</p>
                </div>
              )}
              {result.mood_analysis && (
                <div className="bg-rose-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-rose-600 capitalize">{result.mood_analysis.energy_level}</p>
                  <p className="text-gray-600 mt-1">Energy</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('extracted')}
                  className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                    activeTab === 'extracted'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Extracted Text
                </button>
                {result.context_reconstruction && (
                  <button
                    onClick={() => setActiveTab('reconstruction')}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                      activeTab === 'reconstruction'
                        ? 'border-pink-600 text-pink-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Reconstructed
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('corrected')}
                  className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                    activeTab === 'corrected'
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Corrected
                </button>
                <button
                  onClick={() => setActiveTab('translated')}
                  className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                    activeTab === 'translated'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Translated
                </button>
                {result.mood_analysis && (
                  <button
                    onClick={() => setActiveTab('mood')}
                    className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                      activeTab === 'mood'
                        ? 'border-rose-600 text-rose-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Mood Analysis
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                    activeTab === 'summary'
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Summary
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-50 rounded-lg p-6 min-h-64">
              {/* Inline TTS Button for Each Tab */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {activeTab === 'extracted' && 'Extracted Text (Raw OCR)'}
                  {activeTab === 'reconstruction' && 'Context Reconstruction'}
                  {activeTab === 'corrected' && 'Corrected & Enriched Text'}
                  {activeTab === 'translated' && 'Fully Translated Text (English)'}
                  {activeTab === 'mood' && 'Handwriting Mood Analysis'}
                  {activeTab === 'summary' && 'AI-Generated Analysis'}
                </h3>
                
                {activeTab !== 'mood' && (
                  <button
                    onClick={() => speakText(getCurrentTabText(), selectedLanguage)}
                    disabled={ttsLoading || isSpeaking || !getCurrentTabText()}
                    className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    {ttsLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    Listen
                  </button>
                )}
              </div>

              {activeTab === 'extracted' && (
                <div>
                  <p className="text-gray-700 whitespace-pre-wrap">{result.extracted_text || 'No text extracted'}</p>
                </div>
              )}

              {activeTab === 'reconstruction' && result.context_reconstruction && (
                <div>
                  <div className="mb-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                    <p className="text-sm text-pink-800">
                      <strong>Analysis:</strong> {result.context_reconstruction.comment}
                    </p>
                    {result.context_reconstruction.reconstruction_performed && (
                      <p className="text-xs text-pink-600 mt-2">✓ Text was reconstructed for better context</p>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{result.context_reconstruction.reconstructed_text}</p>
                </div>
              )}

              {activeTab === 'corrected' && (
                <div>
                  <p className="text-gray-700 whitespace-pre-wrap">{result.corrected_text || 'No correction available'}</p>
                </div>
              )}

              {activeTab === 'translated' && (
                <div>
                  <p className="text-gray-700 whitespace-pre-wrap">{result.fully_translated_text || 'No translation available'}</p>
                </div>
              )}

              {activeTab === 'mood' && result.mood_analysis && (
                <div>
                  <div className="space-y-4">
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                      <h4 className="font-semibold text-rose-900 mb-2">Mood</h4>
                      <p className="text-gray-700">{result.mood_analysis.mood}</p>
                    </div>
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Emotional Tone</h4>
                      <p className="text-gray-700">{result.mood_analysis.emotional_tone}</p>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Energy Level</h4>
                      <p className="text-gray-700 capitalize">{result.mood_analysis.energy_level}</p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Overall Impression</h4>
                      <p className="text-gray-700">{result.mood_analysis.overall_impression}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'summary' && (
                <div>
                  <div className="text-gray-700 whitespace-pre-wrap prose max-w-none">
                    {result.summary_and_keywords || 'No summary available'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}