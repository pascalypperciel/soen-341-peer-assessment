import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Sign Up button', () => {
  render(<App />);
  const signUpButton = screen.getByRole('link', { name: /Sign in/i });
  expect(signUpButton).toBeInTheDocument();
});
