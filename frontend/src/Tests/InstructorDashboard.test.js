import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import Dashboard from '../Components/DashboardInstructor/DashboardInstructor';
import LongSummary from '../Components/DashboardInstructor/LongSummary';
import ShortSummary from '../Components/DashboardInstructor/ShortSummary';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Instructor Dashboard and Summaries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('teacher_id', '12345');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders the dashboard with groups', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { GroupName: 'Group A' },
        { GroupName: 'Group B' },
        { GroupName: 'Group A' },
      ],
    });

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    expect(await screen.findByText(/Teams with Ratings/i)).toBeInTheDocument();
    expect(await screen.findByText('Group A')).toBeInTheDocument();
    expect(await screen.findByText('Group B')).toBeInTheDocument();
    expect(screen.getAllByText(/Summary of Results/i)).toHaveLength(2);
    expect(screen.getAllByText(/Detailed Results/i)).toHaveLength(2);
  });

  test('renders "No groups found" when there are no groups', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    expect(await screen.findByText('No groups found')).toBeInTheDocument();
  });

  test('handles button navigation for group summary', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ GroupName: 'Group A' }],
    });

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    expect(await screen.findByText('Group A')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Summary of Results'));

    expect(mockNavigate).toHaveBeenCalledWith('/shortsummary', {
      state: { groupName: 'Group A' },
    });
  });

  test('handles button navigation for group details', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ GroupName: 'Group B' }],
    });

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    expect(await screen.findByText('Group B')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Detailed Results'));

    expect(mockNavigate).toHaveBeenCalledWith('/longsummary', {
      state: { groupName: 'Group B' },
    });
  });

  test('handles error when fetching groups fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to load student ratings'));

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    expect(await screen.findByText('Failed to load student ratings')).toBeInTheDocument();
  });

  test('renders the long summary view for a group', async () => {
    const mockRatings = [
      {
        GroupName: 'Group A',
        RateeID: '123',
        RateeName: 'Student A',
        RaterID: '456',
        RaterName: 'Student B',
        CooperationRating: 4,
        ConceptualContributionRating: 3,
        PracticalContributionRating: 5,
        WorkEthicRating: 4,
        Comment: 'Great teamwork!',
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockRatings });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/longsummary', state: { groupName: 'Group A' } }]}>
        <LongSummary />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Detailed View of Group A/i)).toBeInTheDocument();
    expect(await screen.findByText('Student A')).toBeInTheDocument();

    const studentBElements = await screen.findAllByText('Student B');
    expect(studentBElements).toHaveLength(2);

    const table = screen.getByRole('table');
    const tableRow = within(table).getByText('Student B');
    expect(tableRow).toBeInTheDocument();

    const commentsSection = screen.getByText('Great teamwork!');
    expect(commentsSection).toBeInTheDocument();
  });

  test('shows error message in long summary when fetching ratings fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to load student ratings'));

    render(
      <MemoryRouter initialEntries={[{ pathname: '/longsummary', state: { groupName: 'Group A' } }]}>
        <LongSummary />
      </MemoryRouter>
    );

    expect(await screen.findByText('Failed to load student ratings')).toBeInTheDocument();
  });

  test('renders the short summary view for a group with correct averages', async () => {
    const mockRatings = [
      {
        GroupName: 'Group A',
        RateeID: '123',
        RateeName: 'Student A',
        RaterID: '456',
        CooperationRating: 4,
        ConceptualContributionRating: 3,
        PracticalContributionRating: 5,
        WorkEthicRating: 4,
      },
      {
        GroupName: 'Group A',
        RateeID: '123',
        RateeName: 'Student A',
        RaterID: '789',
        CooperationRating: 3,
        ConceptualContributionRating: 4,
        PracticalContributionRating: 5,
        WorkEthicRating: 3,
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockRatings });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/shortsummary', state: { groupName: 'Group A' } }]}>
        <ShortSummary />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Student Ratings/i)).toBeInTheDocument();
    expect(await screen.findByText('Student A')).toBeInTheDocument();

    const cooperationElements = await screen.findAllByText('3.50');
    expect(cooperationElements).toHaveLength(3);

    const practicalElement = await screen.findByText('5.00');
    expect(practicalElement).toBeInTheDocument();

    const overallAverageElement = await screen.findByText('3.88');
    expect(overallAverageElement).toBeInTheDocument();
  });

  test('shows error message in short summary when fetching ratings fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to load student ratings'));

    render(
      <MemoryRouter initialEntries={[{ pathname: '/shortsummary', state: { groupName: 'Group A' } }]}>
        <ShortSummary />
      </MemoryRouter>
    );

    expect(await screen.findByText('Failed to load student ratings')).toBeInTheDocument();
  });
});
