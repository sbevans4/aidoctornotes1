
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WithLoading, withLoading } from '../with-loading';

interface TestComponentProps {
  name: string;
  isLoading?: boolean;
}

const TestComponent = ({ name }: TestComponentProps) => (
  <div data-testid="test-component">Hello, {name}</div>
);

const EmptyState = () => <div data-testid="empty-state">No data available</div>;

describe('WithLoading Component', () => {
  it('renders children when data is provided', () => {
    render(
      <WithLoading isLoading={false} data={{ name: 'John' }}>
        {(data) => <TestComponent name={data.name} />}
      </WithLoading>
    );
    
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.getByText('Hello, John')).toBeInTheDocument();
  });
  
  it('shows loading state when isLoading is true', () => {
    render(
      <WithLoading isLoading={true} data={null} loadingMessage="Custom loading message">
        {() => <TestComponent name="John" />}
      </WithLoading>
    );
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
  });
  
  it('renders EmptyComponent when no data and not loading', () => {
    render(
      <WithLoading isLoading={false} data={null} EmptyComponent={EmptyState}>
        {() => <TestComponent name="John" />}
      </WithLoading>
    );
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
  });
});

describe('withLoading HOC', () => {
  it('wraps component with loading overlay', () => {
    const WrappedComponent = withLoading(TestComponent, {
      loadingMessage: 'Loading component...'
    });
    
    render(<WrappedComponent name="Jane" isLoading={true} />);
    
    expect(screen.getByText('Loading component...')).toBeInTheDocument();
    expect(screen.queryByTestId('test-component')).toBeInTheDocument();
  });
  
  it('passes through props to wrapped component', () => {
    const WrappedComponent = withLoading(TestComponent);
    
    render(<WrappedComponent name="Jane" isLoading={false} />);
    
    expect(screen.getByText('Hello, Jane')).toBeInTheDocument();
  });
  
  it('uses custom prop names for loading state', () => {
    const WrappedComponent = withLoading(TestComponent, {
      loadingProp: 'loading',
      loadingMessage: 'Custom loading message'
    });
    
    render(<WrappedComponent name="Jane" loading={true} />);
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });
});
