
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecordingControls from '../../RecordingControls';

// Mock the tooltip to avoid issues with popper.js in tests
vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('RecordingControls', () => {
  const defaultProps = {
    isRecording: false,
    isPaused: false,
    isProcessing: false,
    onStartRecording: vi.fn(),
    onStopRecording: vi.fn(),
    onPauseRecording: vi.fn(),
    onResumeRecording: vi.fn(),
  };

  it('renders the start recording button when not recording', () => {
    render(<RecordingControls {...defaultProps} />);
    
    const startButton = screen.getByRole('switch', { name: /start recording/i });
    expect(startButton).toBeInTheDocument();
    expect(startButton).not.toBeDisabled();
  });

  it('calls onStartRecording when start button is clicked', () => {
    render(<RecordingControls {...defaultProps} />);
    
    const startButton = screen.getByRole('switch', { name: /start recording/i });
    fireEvent.click(startButton);
    
    expect(defaultProps.onStartRecording).toHaveBeenCalledTimes(1);
  });

  it('shows the pause button when recording is active', () => {
    render(<RecordingControls {...defaultProps} isRecording={true} />);
    
    const pauseButton = screen.getByRole('switch', { name: /pause recording/i });
    expect(pauseButton).toBeInTheDocument();
    
    const stopButton = screen.getByRole('button', { name: /stop recording/i });
    expect(stopButton).toBeInTheDocument();
  });

  it('shows the resume button when recording is paused', () => {
    render(<RecordingControls {...defaultProps} isRecording={true} isPaused={true} />);
    
    const resumeButton = screen.getByRole('switch', { name: /resume recording/i });
    expect(resumeButton).toBeInTheDocument();
  });

  it('calls onPauseRecording when pause button is clicked', () => {
    render(<RecordingControls {...defaultProps} isRecording={true} />);
    
    const pauseButton = screen.getByRole('switch', { name: /pause recording/i });
    fireEvent.click(pauseButton);
    
    expect(defaultProps.onPauseRecording).toHaveBeenCalledTimes(1);
  });

  it('calls onResumeRecording when resume button is clicked', () => {
    render(<RecordingControls {...defaultProps} isRecording={true} isPaused={true} />);
    
    const resumeButton = screen.getByRole('switch', { name: /resume recording/i });
    fireEvent.click(resumeButton);
    
    expect(defaultProps.onResumeRecording).toHaveBeenCalledTimes(1);
  });

  it('calls onStopRecording when stop button is clicked', () => {
    render(<RecordingControls {...defaultProps} isRecording={true} />);
    
    const stopButton = screen.getByText(/stop recording/i);
    fireEvent.click(stopButton);
    
    expect(defaultProps.onStopRecording).toHaveBeenCalledTimes(1);
  });

  it('shows processing indicator when isProcessing is true', () => {
    render(<RecordingControls {...defaultProps} isProcessing={true} />);
    
    expect(screen.getByText(/processing your recording/i)).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it('handles keyboard shortcuts for recording', () => {
    render(<RecordingControls {...defaultProps} />);
    
    const startButton = screen.getByRole('switch', { name: /start recording/i });
    
    // Test space key
    fireEvent.keyDown(startButton, { key: ' ' });
    expect(defaultProps.onStartRecording).toHaveBeenCalledTimes(1);
    
    // Reset mock
    defaultProps.onStartRecording.mockReset();
    
    // Test Enter key
    fireEvent.keyDown(startButton, { key: 'Enter' });
    expect(defaultProps.onStartRecording).toHaveBeenCalledTimes(1);
  });
});
