import { render, screen } from "@testing-library/react";
import FeedbackPage from "../Components/Feedback/FeedbackPage";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import "@testing-library/jest-dom";

jest.mock("axios");

describe("FeedbackPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("student_id", "123456");
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders FeedbackPage with proper headings", async () => {
    render(
      <Router>
        <FeedbackPage />
      </Router>
    );

    const heading = screen.getByRole("heading", { name: /Feedback/i });
    expect(heading).toBeInTheDocument();

    const noFeedbackText = await screen.findByText(/No feedback available/i);
    expect(noFeedbackText).toBeInTheDocument();
  });

  test("fetches and displays feedback for student", async () => {
    const mockFeedback = [
      {
        CooperationComment: "Great teamwork",
        ConceptualContributionComment: "Excellent ideas",
        PracticalContributionComment: "Strong execution",
        WorkEthicComment: "Very dedicated",
        GroupName: "Math Group",
      },
      {
        CooperationComment: "Good collaboration",
        ConceptualContributionComment: "Creative solutions",
        PracticalContributionComment: "Good hands-on work",
        WorkEthicComment: "Hardworking",
        GroupName: "Science Group",
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockFeedback });

    render(
      <Router>
        <FeedbackPage />
      </Router>
    );

    const mathGroup = await screen.findByText(/Group: Math Group/i);
    expect(mathGroup).toBeInTheDocument();

    const scienceGroup = screen.getByText(/Group: Science Group/i);
    expect(scienceGroup).toBeInTheDocument();
  });

  test("displays error message when fetching feedback fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <Router>
        <FeedbackPage />
      </Router>
    );

    const noFeedbackText = await screen.findByText(/No feedback available/i);
    expect(noFeedbackText).toBeInTheDocument();

    expect(console.error).toHaveBeenCalledWith(
      "Error fetching feedback:",
      expect.any(Error)
    );
  });

  test("displays no feedback message when student has no feedback", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <Router>
        <FeedbackPage />
      </Router>
    );

    const noFeedbackText = await screen.findByText(/No feedback available/i);
    expect(noFeedbackText).toBeInTheDocument();
  });
});
