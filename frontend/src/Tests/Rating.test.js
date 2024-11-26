import { render, screen, fireEvent } from "@testing-library/react";
import RatingPage from "../Components/Rating/RatingPage";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import "@testing-library/jest-dom";

jest.mock("axios");

describe("RatingPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("student_id", "99999999");
  });

  afterEach(() => {
    localStorage.removeItem("student_id");
  });

  test("renders RatingPage with necessary fields", () => {
    render(
      <Router>
        <RatingPage />
      </Router>
    );

    expect(screen.getByRole("heading", { name: /Cooperation/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Conceptual Contribution/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Practical Contribution/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Work Ethic/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit Ratings/i })).toBeInTheDocument();
  });

  test("fetches groups and displays options in dropdown", async () => {
    const mockGroups = [
      { GroupID: 1, GroupName: "Team A" },
      { GroupID: 2, GroupName: "Team B" },
    ];
    axios.get.mockResolvedValueOnce({ data: mockGroups });

    render(
      <Router>
        <RatingPage />
      </Router>
    );

    expect(axios.get).toHaveBeenCalledWith("http://localhost:5000/getStudentGroups?student_id=99999999");

    fireEvent.mouseDown(screen.getByLabelText("Teams"));
    
    expect(await screen.findByRole("option", { name: "Team A" })).toBeInTheDocument();
    expect(await screen.findByRole("option", { name: "Team B" })).toBeInTheDocument();
  });

  test("fetches students when a group is selected", async () => {
    const mockGroups = [{ GroupID: 1, GroupName: "Team A" }];
    const mockStudents = [
      { StudentID: "77777777", Name: "Student A" },
      { StudentID: "88888888", Name: "Student B" },
    ];

    axios.get.mockResolvedValueOnce({ data: mockGroups });
    axios.get.mockResolvedValueOnce({ data: { students: mockStudents } });

    render(
      <Router>
        <RatingPage />
      </Router>
    );

    fireEvent.mouseDown(screen.getByLabelText("Teams"));
    const teamOption = await screen.findByRole("option", { name: "Team A" });
    fireEvent.click(teamOption);

    expect(await screen.findByLabelText("Student")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText("Student"));
    expect(await screen.findByRole("option", { name: "Student A" })).toBeInTheDocument();
    expect(await screen.findByRole("option", { name: "Student B" })).toBeInTheDocument();
  });

  test("submits rating data successfully", async () => {
    const mockGroups = [{ GroupID: 1, GroupName: "Team A" }];
    const mockStudents = [{ StudentID: "77777777", Name: "Student A" }];

    axios.get.mockResolvedValueOnce({ data: mockGroups });
    axios.get.mockResolvedValueOnce({ data: { students: mockStudents } });
    axios.post.mockResolvedValueOnce({ status: 201, data: { message: "Rating successfully inserted." } });

    render(
      <Router>
        <RatingPage />
      </Router>
    );

    fireEvent.mouseDown(screen.getByLabelText("Teams"));
    const teamOption = await screen.findByRole("option", { name: "Team A" });
    fireEvent.click(teamOption);

    expect(await screen.findByLabelText("Student")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText("Student"));
    const studentOption = await screen.findByRole("option", { name: "Student A" });
    fireEvent.click(studentOption);

    fireEvent.click(screen.getByLabelText("Very Satisfied", { selector: 'input[name="cooperation-rating"]' }));
    fireEvent.click(screen.getByLabelText("Very Satisfied", { selector: 'input[name="conceptual-rating"]' }));
    fireEvent.click(screen.getByLabelText("Very Satisfied", { selector: 'input[name="practical-rating"]' }));
    fireEvent.click(screen.getByLabelText("Very Satisfied", { selector: 'input[name="ethic-rating"]' }));

    fireEvent.click(screen.getByRole("button", { name: /Submit Ratings/i }));

    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));

    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/InsertStudRatings", {
      ratee_id: "77777777",
      group_id: 1,
      cooperation_rating: 5,
      conceptual_contribution_rating: 5,
      practical_contribution_rating: 5,
      work_ethic_rating: 5,
      comment: "",
      rater_id: "99999999",
      cooperation_comment: "",
      conceptual_contribution_comment: "",
      practical_contribution_comment: "",
      work_ethic_comment: "",
    });
  });
});
