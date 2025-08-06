
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LearnerInfo } from '../types';
import { WhatsAppIcon, MagicWandIcon } from './icons';
import { GoogleGenAI } from '@google/genai';

const FoundItemScreen: React.FC = () => {
  const { data } = useParams<{ data: string }>();
  const [learnerInfo, setLearnerInfo] = useState<LearnerInfo | null>(null);
  const [error, setError] = useState<string>('');

  const [context, setContext] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (data) {
      try {
        const decodedString = atob(decodeURIComponent(data));
        const parsedInfo = JSON.parse(decodedString);
        if (parsedInfo.name && parsedInfo.grade && parsedInfo.className && parsedInfo.parentPhone && parsedInfo.school) {
          setLearnerInfo(parsedInfo);
        } else {
          // Attempt to handle older tags that might be missing school info from the QR
          const users = JSON.parse(localStorage.getItem('users') || '{}');
          let ownerSchool = 'School not specified';
          // This is a long shot and may not work if the finder is not the owner, but it's a fallback
          for (const phone in users) {
             const userTags = users[phone].tags || [];
             if (userTags.some((tag: LearnerInfo) => tag.tagId === parsedInfo.tagId)) {
                ownerSchool = users[phone].school;
                break;
             }
          }
          if (parsedInfo.name && parsedInfo.grade && parsedInfo.className && parsedInfo.parentPhone) {
            setLearnerInfo({ ...parsedInfo, school: parsedInfo.school || ownerSchool });
          } else {
            throw new Error('Invalid data format.');
          }
        }
      } catch (err) {
        setError('The QR code is invalid or corrupted. Please try again.');
        console.error("Failed to decode or parse QR data:", err);
      }
    } else {
       setError('No QR code data found.');
    }
  }, [data]);
  
  const handleGenerateMessage = async () => {
    if (!learnerInfo) return;
    if (!context) {
      setAiError('Please provide some context about where you found the item.');
      return;
    }
    setIsLoading(true);
    setAiError('');
    setGeneratedMessage('');
  
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a helpful assistant. Someone has found a lost item belonging to a child named ${learnerInfo.name} from ${learnerInfo.school}. The finder has provided the following context: "${context}". Please craft a short, friendly, and clear WhatsApp message to the child's parent. The message should state that the item has been found, mention the context, and ask how to return it. Start the message with "Hi," and do not add any salutations at the end.`;
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });
  
      const text = response.text;
      if (text) {
          setGeneratedMessage(text);
      } else {
          throw new Error('No message was generated.');
      }
  
    } catch (error) {
      console.error("Gemini API error:", error);
      setAiError('Sorry, we couldn\'t generate a message right now. Please try again or use the default message.');
    } finally {
      setIsLoading(false);
    }
  };


  if (error) {
    return (
      <div className="w-full max-w-md bg-red-100 text-red-800 p-8 rounded-xl shadow-lg text-center animate-fade-in">
        <h2 className="text-2xl font-bold">Error</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!learnerInfo) {
    return (
       <div className="text-center p-8">
         <p className="text-gray-600">Loading item details...</p>
       </div>
    );
  }

  const defaultMessage = `Hi, I've found an item that belongs to ${learnerInfo.name} from ${learnerInfo.school} (Grade ${learnerInfo.grade} ${learnerInfo.className}). Please let me know how I can return it.`;
  const messageToSend = generatedMessage || defaultMessage;
  
  const formatPhoneNumberForWhatsApp = (phone: string) => {
    let digits = phone.replace(/\D/g, '');
    // Handle South African local numbers starting with 0
    if (digits.length === 10 && digits.startsWith('0')) {
        return `27${digits.substring(1)}`;
    }
    // It's either already in international format (e.g., +27... becomes 27...) or another format we pass through.
    return digits;
  };
  
  const cleanPhone = formatPhoneNumberForWhatsApp(learnerInfo.parentPhone);
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageToSend)}`;

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Item Found!</h2>
      <p className="text-gray-600 mt-2">Thank you for scanning! You've found an item belonging to:</p>
      
      <div className="my-8 p-6 bg-blue-50 border-y-4 border-blue-500 rounded-lg">
        <p className="text-3xl font-bold text-blue-900">{learnerInfo.name}</p>
        <p className="text-xl font-semibold text-blue-800 mt-2">{learnerInfo.school}</p>
        <p className="text-lg text-blue-700 mt-2">Grade {learnerInfo.grade} | Class {learnerInfo.className}</p>
      </div>

      <p className="text-sm text-gray-500 mb-4">You can notify the parent directly and securely via WhatsApp. No personal contact details are shared with you.</p>

      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 text-left">Get help writing your message</h3>
          <p className="text-sm text-gray-600 mt-1 text-left">Add context (e.g., "on the playground") and let AI craft a friendly message for you.</p>
          
          <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., I found this on the school bus."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              rows={2}
              disabled={isLoading}
          />
          <button
              onClick={handleGenerateMessage}
              disabled={isLoading || !context}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
              {isLoading ? (
                  <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                  </>
              ) : (
                  <>
                      <MagicWandIcon className="h-5 w-5" />
                      Generate AI Message
                  </>
              )}
          </button>
          {aiError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md">{aiError}</p>}
          {generatedMessage && (
              <div className="mt-4 text-left p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">Suggestion:</p>
                  <blockquote className="mt-2 text-gray-800 italic">
                      {generatedMessage}
                  </blockquote>
              </div>
          )}
      </div>

      <div className="mt-8">
        <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
            <WhatsAppIcon className="h-6 w-6" />
            {generatedMessage ? 'Send Enhanced Message' : 'Notify Parent via WhatsApp'}
        </a>
      </div>
    </div>
  );
};

export default FoundItemScreen;