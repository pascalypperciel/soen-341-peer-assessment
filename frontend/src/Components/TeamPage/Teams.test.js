import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Teams from './Teams';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('Teams Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('teacher_id', '12345'); // Mocking teacher login
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders team list correctly', async () => {
    const mockTeamsData = [
      {
        groupId: '1',
        groupName: 'Team A',
        courseName: 'Math 101',
        students: [{ name: 'Alice', studentId: '1001' }]
      },
      {
        groupId: '2',
        groupName: 'Team B',
        courseName: 'Science 101',
        students: [{ name: 'Bob', studentId: '1002' }]
      }
    ];

    axios.get.mockResolvedValueOnce({ data: mockTeamsData });

    render(
      <Router>
        <Teams />
      </Router>
    );

    await waitFor(() => {
      mockTeamsData.forEach((team) => {
        expect(screen.getByText(team.groupName)).toBeInTheDocument();
        expect(screen.getByText(team.courseName)).toBeInTheDocument();
        team.students.forEach((student) => {
          expect(screen.getByText(`${student.name} (ID: ${student.studentId})`)).toBeInTheDocument();
        });
      });
    });
  });

  it('allows a teacher to edit a team', async () => {
    const mockTeam = {
      groupId: '1',
      groupName: 'Team A',
      courseName: 'Math 101',
      students: [{ name: 'Alice', studentId: '1001' }]
    };

    axios.get.mockResolvedValueOnce({ data: [mockTeam] });
    axios.put.mockResolvedValueOnce({ status: 200 });

    render(
      <Router>
        <Teams />
      </Router>
    );

    await waitFor(() => screen.getByText(mockTeam.groupName));

    fireEvent.click(screen.getByText('Edit'));

    const nameInput = screen.getByLabelText(/Group Name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Team A' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Updated Team A')).toBeInTheDocument();
    });
  });

  it('displays an error if team editing fails', async () => {
    const mockTeam = {
      groupId: '1',
      groupName: 'Team A',
      courseName: 'Math 101',
      students: [{ name: 'Alice', studentId: '1001' }]
    };

    axios.get.mockResolvedValueOnce({ data: [mockTeam] });
    axios.put.mockRejectedValueOnce({ response: { data: { error: 'Failed to edit the team' } } });

    render(
      <Router>
        <Teams />
      </Router>
    );

    await waitFor(() => screen.getByText(mockTeam.groupName));

    fireEvent.click(screen.getByText('Edit'));

    const nameInput = screen.getByLabelText(/Group Name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Team A' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Failed to edit the team')).toBeInTheDocument();
    });
  });

  it('allows a teacher to delete a team', async () => {
    const mockTeam = {
      groupId: '1',
      groupName: 'Team A',
      courseName: 'Math 101',
      students: [{ name: 'Alice', studentId: '1001' }]
    };

    axios.get.mockResolvedValueOnce({ data: [mockTeam] });
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(
      <Router>
        <Teams />
      </Router>
    );

    await waitFor(() => screen.getByText(mockTeam.groupName));

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.queryByText(mockTeam.groupName)).not.toBeInTheDocument();
    });
  });

  it('displays the Add Team modal when the button is clicked', async () => {
    render(
      <Router>
        <Teams />
      </Router>
    );

    fireEvent.click(screen.getByText('Add New Team'));

    await waitFor(() => {
      expect(screen.getByText('Add New Team')).toBeInTheDocument();
    });
  });
});
