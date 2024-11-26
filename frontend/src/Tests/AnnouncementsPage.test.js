import { render, screen, fireEvent } from "@testing-library/react";
import AnnouncementsPage from "../Components/Announcement/AnnouncementsPage";
import CreateAnnouncementModal from "../Components/Announcement/CreateAnnouncementModal";
import EditAnnouncementModal from "../Components/Announcement/EditAnnouncementModal";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import "@testing-library/jest-dom";

jest.mock("axios");
jest.mock("../Components/Announcement/CreateAnnouncementModal", () => jest.fn(() => null));
jest.mock("../Components/Announcement/EditAnnouncementModal", () => jest.fn(() => null));

describe("AnnouncementsPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("teacher_id", "123456");
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders AnnouncementsPage with proper headings", async () => {
    render(
      <Router>
        <AnnouncementsPage />
      </Router>
    );

    const heading = screen.getByRole("heading", { name: /Announcements/i });
    expect(heading).toBeInTheDocument();

    const noAnnouncementsText = await screen.findByText(/No announcements available/i);
    expect(noAnnouncementsText).toBeInTheDocument();
  });

  test("fetches and displays announcements for teacher", async () => {
    const mockAnnouncements = [
      { AnnouncementID: 1, Announcement: "Test Announcement 1", Timestamp: "2024-11-24T10:00:00Z", CourseName: "Math" },
      { AnnouncementID: 2, Announcement: "Test Announcement 2", Timestamp: "2024-11-23T10:00:00Z", CourseName: "Science" },
    ];
    axios.get.mockResolvedValueOnce({ data: { announcements: mockAnnouncements } });

    render(
      <Router>
        <AnnouncementsPage />
      </Router>
    );

    const mathCourse = await screen.findByText("Math");
    expect(mathCourse).toBeInTheDocument();

    const testAnnouncement1 = screen.getByText("Test Announcement 1");
    expect(testAnnouncement1).toBeInTheDocument();

    const scienceCourse = screen.getByText("Science");
    expect(scienceCourse).toBeInTheDocument();

    const testAnnouncement2 = screen.getByText("Test Announcement 2");
    expect(testAnnouncement2).toBeInTheDocument();
  });

  test("displays create announcement button for teachers", () => {
    render(
      <Router>
        <AnnouncementsPage />
      </Router>
    );

    const button = screen.getByRole("button", { name: /Create Announcement/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(CreateAnnouncementModal).toHaveBeenCalledWith(
      expect.objectContaining({
        show: true,
        onClose: expect.any(Function),
        onCreate: expect.any(Function),
      }),
      {}
    );
  });

  test("opens edit modal when edit button is clicked", async () => {
    const mockAnnouncements = [
      { AnnouncementID: 1, Announcement: "Test Announcement 1", Timestamp: "2024-11-24T10:00:00Z", CourseName: "Math" },
    ];
    axios.get.mockResolvedValueOnce({ data: { announcements: mockAnnouncements } });

    render(
      <Router>
        <AnnouncementsPage />
      </Router>
    );

    const editButton = await screen.findByRole("button", { name: /Edit/i });
    fireEvent.click(editButton);

    expect(EditAnnouncementModal).toHaveBeenCalledWith(
      expect.objectContaining({
        show: true,
        onClose: expect.any(Function),
        announcement: mockAnnouncements[0],
        onUpdate: expect.any(Function),
      }),
      {}
    );
  });

  test("displays error message when fetching announcements fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <Router>
        <AnnouncementsPage />
      </Router>
    );

    const noAnnouncementsText = await screen.findByText(/No announcements available/i);
    expect(noAnnouncementsText).toBeInTheDocument();

    expect(console.error).toHaveBeenCalledWith(
      "Error fetching announcements:",
      expect.any(Error)
    );
  });

  test("updates announcements when a new announcement is created", async () => {
    render(
      <Router>
        <AnnouncementsPage />
      </Router>
    );

    const newAnnouncement = {
      AnnouncementID: 3,
      Announcement: "New Announcement",
      Timestamp: "2024-11-24T12:00:00Z",
      CourseName: "History",
    };

    const modalProps = CreateAnnouncementModal.mock.calls[0][0];
    modalProps.onCreate(newAnnouncement);

    const newCourse = await screen.findByText("History");
    const newAnnouncementText = screen.getByText("New Announcement");

    expect(newCourse).toBeInTheDocument();
    expect(newAnnouncementText).toBeInTheDocument();
  });

  test("updates announcements when an announcement is edited", async () => {
    const mockAnnouncements = [
      { AnnouncementID: 1, Announcement: "Old Announcement", Timestamp: "2024-11-24T10:00:00Z", CourseName: "Math" },
    ];
    axios.get.mockResolvedValueOnce({ data: { announcements: mockAnnouncements } });

    render(
      <Router>
        <AnnouncementsPage />
      </Router>
    );

    const oldAnnouncement = await screen.findByText("Old Announcement");
    expect(oldAnnouncement).toBeInTheDocument();

    const modalProps = EditAnnouncementModal.mock.calls[0][0];
    const updatedAnnouncement = { ...mockAnnouncements[0], Announcement: "Updated Announcement" };
    modalProps.onUpdate(updatedAnnouncement);

    const updatedAnnouncementText = await screen.findByText("Updated Announcement");
    expect(updatedAnnouncementText).toBeInTheDocument();
  });
});