import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Sign Up button', () => {
  render(<App />);
  const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
  expect(signUpButton).toBeInTheDocument();
});
