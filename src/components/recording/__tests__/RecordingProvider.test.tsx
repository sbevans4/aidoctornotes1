
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecordingProvider from '../RecordingProvider';
import { useAuth } from '@/contexts/AuthContext';

// Mock the dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({}),
    }),
  },
}));

describe('RecordingProvider', () => {
  // Mock MediaRecorder
  const mockMediaRecorder = {
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    ondataavailable: null as any,
    onstop: null as any,
    state: 'inactive',
  };

  const mockStream = {
    getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
  };

  beforeEach(() => {
    // Mock the getUserMedia
    Object.defineProperty(global.navigator, 'mediaDevices', {
      writable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream),
      }
    });

    // Mock MediaRecorder
    global.MediaRecorder = vi.fn().mockImplementation(() => mockMediaRecorder) as any;
    
    // Mock useAuth
    (useAuth as any).mockReturnValue({ user: { id: 'test-user-id' } });
    
    // Mock window.URL.createObjectURL
    global.URL.createObjectURL = vi.fn();
    
    // Setup mock timer to avoid real timers in tests
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders children correctly', () => {
    const onAudioProcessed = vi.fn();
    
    render(
      <RecordingProvider onAudioProcessed={onAudioProcessed}>
        <div data-testid="child-element">Test Child</div>
      </RecordingProvider>
    );
    
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
  
  it('provides recording context to function children', () => {
    const onAudioProcessed = vi.fn();
    
    render(
      <RecordingProvider onAudioProcessed={onAudioProcessed}>
        {(context) => (
          <div data-testid="function-child">
            <button 
              data-testid="start-button" 
              onClick={context.startRecording}
            >
              Start
            </button>
            <span data-testid="is-recording">{context.isRecording.toString()}</span>
          </div>
        )}
      </RecordingProvider>
    );
    
    expect(screen.getByTestId('function-child')).toBeInTheDocument();
    expect(screen.getByTestId('is-recording').textContent).toBe('false');
    
    // Click the start button
    fireEvent.click(screen.getByTestId('start-button'));
    
    // Check that getUserMedia was called
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
  });

  it('starts recording when startRecording is called', async () => {
    const onAudioProcessed = vi.fn();
    
    render(
      <RecordingProvider onAudioProcessed={onAudioProcessed}>
        {(context) => (
          <button data-testid="start-button" onClick={context.startRecording}>
            Start
          </button>
        )}
      </RecordingProvider>
    );
    
    fireEvent.click(screen.getByTestId('start-button'));
    
    await waitFor(() => {
      expect(global.MediaRecorder).toHaveBeenCalled();
      expect(mockMediaRecorder.start).toHaveBeenCalled();
    });
  });

  it('stops recording when stopRecording is called', async () => {
    const onAudioProcessed = vi.fn();
    const audioChunks = [new Blob(['test audio data'], { type: 'audio/webm' })];
    
    render(
      <RecordingProvider onAudioProcessed={onAudioProcessed}>
        {(context) => (
          <>
            <button data-testid="start-button" onClick={context.startRecording}>
              Start
            </button>
            <button data-testid="stop-button" onClick={context.stopRecording}>
              Stop
            </button>
          </>
        )}
      </RecordingProvider>
    );
    
    // Start recording
    fireEvent.click(screen.getByTestId('start-button'));
    
    await waitFor(() => {
      expect(mockMediaRecorder.start).toHaveBeenCalled();
    });
    
    // Simulate data available
    if (mockMediaRecorder.ondataavailable) {
      mockMediaRecorder.ondataavailable({ data: audioChunks[0] });
    }
    
    // Stop recording
    fireEvent.click(screen.getByTestId('stop-button'));
    
    await waitFor(() => {
      expect(mockMediaRecorder.stop).toHaveBeenCalled();
    });
    
    // Simulate the stop event
    if (mockMediaRecorder.onstop) {
      mockMediaRecorder.onstop({});
    }
    
    // Check onAudioProcessed was called with a Blob
    await waitFor(() => {
      expect(onAudioProcessed).toHaveBeenCalledWith(expect.any(Blob));
    });
  });
});
