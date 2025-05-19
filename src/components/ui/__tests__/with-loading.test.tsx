
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WithLoading } from '../with-loading';

describe('WithLoading', () => {
  it('renders loading state when isLoading is true', () => {
    render(
      <WithLoading isLoading={true} data={null}>
        {() => <div>Content</div>}
      </WithLoading>
    );
    
    expect(screen.getByText('Loading page content...')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
  
  it('renders loading state when data is null', () => {
    render(
      <WithLoading isLoading={false} data={null}>
        {() => <div>Content</div>}
      </WithLoading>
    );
    
    expect(screen.getByText('Loading page content...')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
  
  it('renders children with data when not loading and data is present', () => {
    const testData = { name: 'Test' };
    
    render(
      <WithLoading isLoading={false} data={testData}>
        {(data) => <div>Hello, {data.name}</div>}
      </WithLoading>
    );
    
    expect(screen.queryByText('Loading page content...')).not.toBeInTheDocument();
    expect(screen.getByText('Hello, Test')).toBeInTheDocument();
  });
  
  it('renders with custom loading message', () => {
    render(
      <WithLoading isLoading={true} data={null} loadingMessage="Custom loading message">
        {() => <div>Content</div>}
      </WithLoading>
    );
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });
});
