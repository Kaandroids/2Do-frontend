import {Injectable, signal} from '@angular/core';


@Injectable({providedIn: 'root'})
export class VoiceRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  isRecording = signal<boolean>(false);

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) this.audioChunks.push(event.data);
      }

      this.mediaRecorder.start();
      this.isRecording.set(true);
    } catch (error) {
      console.log('Microphone access denied:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<File> {
    return new Promise((resolve, reject) => {
      if (this.mediaRecorder) {
        this.mediaRecorder.onstop = (event) => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp4' });
          const audioFile = new File([audioBlob], 'voice-task.wav', {type: 'audio/wav'});
          this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
          this.isRecording.set(false);
          resolve(audioFile);
        }
        this.mediaRecorder.stop();
      }
    });
  }

  async playLastRecording(file: File): Promise<void> {
    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

    await audio.play();
  }

  abortRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
    this.isRecording.set(false);
    this.audioChunks = [];
  }

}
