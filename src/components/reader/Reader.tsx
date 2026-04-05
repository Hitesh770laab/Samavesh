"use client";

import { Blob } from 'fetch-blob';
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";

// Initialize PDF.js worker
if (typeof window !== "undefined") {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;
}

export default function Reader() {
  const [text, setText] = React.useState("");
  const [speaking, setSpeaking] = React.useState(false);
  const [ocrText, setOcrText] = React.useState("");
  const [status, setStatus] = React.useState<string>("");
  const [speakingOcr, setSpeakingOcr] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [isListeningOcr, setIsListeningOcr] = React.useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  const onPdfChange = async (file?: File) => {
    if (!file) return;
    setStatus("Processing PDF...");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      let ocrFullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((it: any) => (it.str ?? ""));
        fullText += strings.join(" ") + "\n";

        // Render page to canvas for OCR
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        // Convert canvas to blob for Tesseract
        const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
        const { data } = await Tesseract.recognize(blob, "eng");
        ocrFullText += (data.text || "") + "\n";
      }
      setText(fullText.trim());
      setOcrText(ocrFullText.trim());
      setStatus("PDF Processed successfully (text + OCR)");
    } catch (e) {
      console.error(e);
      setStatus("Failed to read PDF file ");
    }
  };

  const onImageChange = async (file?: File) => {
    if (!file) return;
    setStatus("Running OCR...");
    try {
      const { data } = await Tesseract.recognize(file, "eng");
      setOcrText(data.text || "");
      setStatus("OCR complete successfully");
    } catch (e) {
      console.error(e);
      setStatus("Failed to run OCR");
    }
  };

  const [speechSupported, setSpeechSupported] = React.useState(false);

  React.useEffect(() => {
    const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    setSpeechSupported(isSpeechSupported);

    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const isRecognitionSupported = !!SpeechRecognition;
    setSpeechRecognitionSupported(isRecognitionSupported);

    if (isRecognitionSupported) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;

        if (event.results[current].isFinal) {
          if (isListening) {
            setText(prev => prev + transcript + ' ');
          } else if (isListeningOcr) {
            setOcrText(prev => prev + transcript + ' ');
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setStatus(`Speech recognition error: ${event.error}. Please try again.`);
        setIsListening(false);
        setIsListeningOcr(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening || isListeningOcr) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, isListeningOcr]);

  const speak = () => {
    if (!text || !speechSupported) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-IN";
      utter.onend = () => setSpeaking(false);
      utter.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeaking(false);
        setStatus('Failed to speak text. Please check if speech is enabled in your browser.');
      };
      window.speechSynthesis.speak(utter);
      setSpeaking(true);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setStatus('Failed to initialize speech. Please check your browser settings.');
      setSpeaking(false);
    }
  };

  const stop = () => {
    if (!speechSupported) return;
    try {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const speakOcr = () => {
    if (!ocrText || !speechSupported) return;
    try {
      const utter = new SpeechSynthesisUtterance(ocrText);
      utter.lang = "en-IN";
      utter.onend = () => setSpeakingOcr(false);
      utter.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeakingOcr(false);
        setStatus('Failed to speak OCR text. Please check if speech is enabled in your browser.');
      };
      window.speechSynthesis.speak(utter);
      setSpeakingOcr(true);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setStatus('Failed to initialize speech. Please check your browser settings.');
      setSpeakingOcr(false);
    }
  };

  const stopOcr = () => {
    if (!speechSupported) return;
    try {
      window.speechSynthesis.cancel();
      setSpeakingOcr(false);
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const toggleListening = (target: 'text' | 'ocr') => {
    if (!speechRecognitionSupported || !recognitionRef.current) return;

    try {
      if (target === 'text') {
        if (isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
        } else {
          setIsListeningOcr(false); // Stop OCR listening if active
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
            setIsListening(true);
          }, 100);
        }
      } else {
        if (isListeningOcr) {
          recognitionRef.current.stop();
          setIsListeningOcr(false);
        } else {
          setIsListening(false); // Stop text listening if active
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
            setIsListeningOcr(true);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      setStatus('Failed to toggle speech recognition. Please check your browser settings.');
      setIsListening(false);
      setIsListeningOcr(false);
    }
  };

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-8 space-y-6" aria-labelledby="reader-heading">
      <h1 id="reader-heading" className="text-2xl font-semibold">Reader & OCR</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload study materials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="pdf-input" className="text-sm">Upload PDF</label>
              <Input id="pdf-input" type="file" accept="application/pdf" onChange={(e) => onPdfChange(e.target.files?.[0] || undefined)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="img-input" className="text-sm">Upload image for OCR</label>
              <Input id="img-input" type="file" accept="image/*" onChange={(e) => onImageChange(e.target.files?.[0] || undefined)} />
            </div>
          </div>
          {status && <p className="text-sm text-muted-foreground" aria-live="polite">{status}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PDF text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            {!speaking ? (
              <Button
                onClick={speak}
                aria-label="Start reading text"
                disabled={!speechSupported}
                title={!speechSupported ? "Speech synthesis is not supported in your browser" : undefined}
              >
                Read aloud
              </Button>
            ) : (
              <Button onClick={stop} variant="destructive" aria-label="Stop reading text">Stop</Button>
            )}
            <Button variant="outline" onClick={() => setText("")}>Clear</Button>
            {speechRecognitionSupported && (
              <Button
                onClick={() => toggleListening('text')}
                variant={isListening ? "destructive" : "outline"}
                aria-label={isListening ? "Stop dictation" : "Start dictation"}
              >
                {isListening ? "Stop Dictation" : "Start Dictation"}
              </Button>
            )}
          </div>
          {!speechSupported && (
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              Speech synthesis is not supported in your browser. Please try using a modern browser like Chrome or Edge.
            </p>
          )}
          {!speechRecognitionSupported && (
            <p className="text-sm text-yellow-600 dark:text-yellow-500">
              Speech recognition is not supported in your browser. Please try using Chrome or Edge.
            </p>
          )}
          {isListening && (
            <p className="text-sm text-green-600 dark:text-green-500">
              Listening... Speak to add text
            </p>
          )}
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[30vh]" aria-label="Extracted PDF text" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OCR result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            {!speakingOcr ? (
              <Button
                onClick={speakOcr}
                aria-label="Read OCR text aloud"
                disabled={!speechSupported}
                title={!speechSupported ? "Speech synthesis is not supported in your browser" : undefined}
              >
                Read aloud
              </Button>
            ) : (
              <Button onClick={stopOcr} variant="destructive" aria-label="Stop reading OCR text">Stop</Button>
            )}
            <Button variant="outline" onClick={() => setOcrText("")}>Clear</Button>
            {speechRecognitionSupported && (
              <Button
                onClick={() => toggleListening('ocr')}
                variant={isListeningOcr ? "destructive" : "outline"}
                aria-label={isListeningOcr ? "Stop dictation" : "Start dictation"}
              >
                {isListeningOcr ? "Stop Dictation" : "Start Dictation"}
              </Button>
            )}
          </div>
          {isListeningOcr && (
            <p className="text-sm text-green-600 dark:text-green-500">
              Listening... Speak to add text
            </p>
          )}
          <Textarea value={ocrText} onChange={(e) => setOcrText(e.target.value)} className="min-h-[30vh]" aria-label="OCR text" />
        </CardContent>
      </Card>
    </main>
  );
}
