import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Teams from './Teams';
import axios from 'axios';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('Teams Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // render test teams page and fetch data
  test('renders the Teams page and fetches teams data for a student', async () => {
    localStorage.setItem('student_id', '99999999');

    const mockTeamsData = [
      { groupId: 1, name: 'Team Alpha', students: [] },
      { groupId: 2, name: 'Team Beta', students: [] },
    ];

    axios.get.mockResolvedValueOnce({ data: mockTeamsData });

    render(
      <Router>
        <Teams />
      </Router>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/displayTeamsStudent?student_id=99999999');
    });

    // Teams display check
      expect(screen.getByText('Team Alpha')).toBeInTheDocument();
      expect(screen.getByText('Team Beta')).toBeInTheDocument();
  });

  // Teams render check (teacher)
  test('renders the Teams page and fetches teams data for a teacher', async () => {
    localStorage.setItem('teacher_id', '12345');

    const mockTeamsData = [
      { groupId: 3, name: 'Team Gamma', students: [] },
      { groupId: 4, name: 'Team Delta', students: [] },
    ];

    axios.get.mockResolvedValueOnce({ data: mockTeamsData });

    render(
      <Router>
        <Teams />
      </Router>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/displayTeamsTeacher?teacher_id=12345');
    });

    expect(screen.getByText('Team Gamma')).toBeInTheDocument();
    expect(screen.getByText('Team Delta')).toBeInTheDocument();
  });

  // add team test
  test('adds a new team', async () => {
    localStorage.setItem('teacher_id', '12345');

    const mockTeamsData = [{ groupId: 1, name: 'Team Alpha', students: [] }];

    axios.get.mockResolvedValueOnce({ data: mockTeamsData });

    render(
      <Router>
        <Teams />
      </Router>
    );

    fireEvent.click(screen.getByText(/Add New Team/i));

    expect(screen.getByText(/Add Team/i)).toBeInTheDocument();

    // Simulate adding a new team
    const newTeam = { groupId: 5, name: 'Team Epsilon' };

    fireEvent.click(screen.getByText(/Add Team/i));

    await waitFor(() => {
      // check new team is added
      expect(screen.getByText('Team Epsilon')).toBeInTheDocument();
    });
  });

  // delete team test
  test('deletes a team', async () => {
    localStorage.setItem('teacher_id', '12345');

    const mockTeamsData = [
      { groupId: 1, name: 'Team Alpha', students: [] },
      { groupId: 2, name: 'Team Beta', students: [] },
    ];

    axios.get.mockResolvedValueOnce({ data: mockTeamsData });

    render(
      <Router>
        <Teams />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Team Alpha')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Team Beta')).toBeInTheDocument();
    });

    // Simulate deleting a team
    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => {
      // should not be in the document check
      expect(screen.queryByText('Team Beta')).not.toBeInTheDocument();
    });
  });

  // edit team test
  test('edits a team', async () => {
    localStorage.setItem('teacher_id', '12345');

    const mockTeamsData = [
      { groupId: 1, name: 'Team Alpha', students: [] },
      { groupId: 2, name: 'Team Beta', students: [] },
    ];

    axios.get.mockResolvedValueOnce({ data: mockTeamsData });

    render(
      <Router>
        <Teams />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Team Alpha')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Team Beta')).toBeInTheDocument();
    });

    // Simulate editing a team
    fireEvent.click(screen.getByText(/Edit/i));

    const editedTeam = { groupId: 1, name: 'Team Alpha Edited' };

    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      // team name update check
      expect(screen.getByText('Team Alpha Edited')).toBeInTheDocument();
    });
  });
});