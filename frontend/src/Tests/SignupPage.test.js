import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '../Components/SignupLogin/SignupLogin';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

global.fetch = jest.fn();

describe('Signup and Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Teacher Signup Test
  test('Teacher Signup Test', async () => {
    render(
      <Router>
        <SignupPage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Professor/i));

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'teacher_user' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    axios.post.mockResolvedValueOnce({ status: 200 });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/teacherSignup', {
        username: 'teacher_user',
        name: 'John Doe',
        password: 'password123',
      });
    });
  });

  // Student Signup Test
  test('Student Signup Test', async () => {
    render(
      <Router>
        <SignupPage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Student/i));

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Student ID/i), {
      target: { value: '99999999' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    axios.post.mockResolvedValueOnce({ status: 200 });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/studentSignup', {
        studentID: '99999999',
        name: 'Jane Doe',
        password: 'password123',
      });
    });
  });

  // Teacher Login Test
  test('Teacher Login Test', async () => {
    render(
      <Router>
        <SignupPage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Login/i));
    fireEvent.click(screen.getByText(/Professor/i));

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'teacher_user' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ teacher_id: '12345' }),
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/teacherLogin?username=teacher_user&password=password123',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });

  // Student Login Test
  test('Student Login Test', async () => {
    render(
      <Router>
        <SignupPage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Login/i));
    fireEvent.click(screen.getByText(/Student/i));

    fireEvent.change(screen.getByLabelText(/Student ID/i), {
      target: { value: '99999999' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ student_id: '67890' }),
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/studentLogin?studentID=99999999&password=password123',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });
});
