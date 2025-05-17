
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecordingTimer from '../RecordingTimer';
import { act } from 'react-dom/test-utils';

describe('RecordingTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('displays initial time as 0:00', () => {
    render(<RecordingTimer isRecording={false} isPaused={false} />);
    
    expect(screen.getByRole('timer')).toHaveTextContent('0:00');
  });

  it('does not increment when recording is false', () => {
    render(<RecordingTimer isRecording={false} isPaused={false} />);
    
    act(() => {
      vi.advanceTimersByTime(3000); // 3 seconds
    });
    
    expect(screen.getByRole('timer')).toHaveTextContent('0:00');
  });

  it('increments time when recording is active and not paused', () => {
    render(<RecordingTimer isRecording={true} isPaused={false} />);
    
    act(() => {
      vi.advanceTimersByTime(1000); // 1 second
    });
    
    expect(screen.getByRole('timer')).toHaveTextContent('0:01');
    
    act(() => {
      vi.advanceTimersByTime(59000); // 59 more seconds
    });
    
    expect(screen.getByRole('timer')).toHaveTextContent('1:00');
  });

  it('stops incrementing when recording is paused', () => {
    const { rerender } = render(<RecordingTimer isRecording={true} isPaused={false} />);
    
    act(() => {
      vi.advanceTimersByTime(5000); // 5 seconds
    });
    
    expect(screen.getByRole('timer')).toHaveTextContent('0:05');
    
    // Pause the recording
    rerender(<RecordingTimer isRecording={true} isPaused={true} />);
    
    act(() => {
      vi.advanceTimersByTime(5000); // 5 more seconds but paused
    });
    
    // Should still show 0:05, not 0:10
    expect(screen.getByRole('timer')).toHaveTextContent('0:05');
    expect(screen.getByText(/\(Paused\)/i)).toBeInTheDocument();
  });

  it('resumes incrementing when unpaused', () => {
    const { rerender } = render(<RecordingTimer isRecording={true} isPaused={false} />);
    
    act(() => {
      vi.advanceTimersByTime(5000); // 5 seconds
    });
    
    // Pause the recording
    rerender(<RecordingTimer isRecording={true} isPaused={true} />);
    
    act(() => {
      vi.advanceTimersByTime(3000); // 3 seconds while paused
    });
    
    // Resume the recording
    rerender(<RecordingTimer isRecording={true} isPaused={false} />);
    
    act(() => {
      vi.advanceTimersByTime(5000); // 5 more seconds
    });
    
    // Should show 0:10 (5 initial seconds + 5 after resuming)
    expect(screen.getByRole('timer')).toHaveTextContent('0:10');
  });

  it('resets the time when recording becomes false', () => {
    const { rerender } = render(<RecordingTimer isRecording={true} isPaused={false} />);
    
    act(() => {
      vi.advanceTimersByTime(10000); // 10 seconds
    });
    
    expect(screen.getByRole('timer')).toHaveTextContent('0:10');
    
    // Stop the recording
    rerender(<RecordingTimer isRecording={false} isPaused={false} />);
    
    // Should reset to 0:00
    expect(screen.getByRole('timer')).toHaveTextContent('0:00');
  });

  it('formats time correctly as minutes and seconds', () => {
    render(<RecordingTimer isRecording={true} isPaused={false} />);
    
    // Advance to 1 minute and 5 seconds
    act(() => {
      vi.advanceTimersByTime(65000);
    });
    
    expect(screen.getByRole('timer')).toHaveTextContent('1:05');
    
    // Advance to 10 minutes and 1 second
    act(() => {
      vi.advanceTimersByTime(535000); // 8 minutes 55 seconds more
    });
    
    expect(screen.getByRole('timer')).toHaveTextContent('10:01');
  });
});
