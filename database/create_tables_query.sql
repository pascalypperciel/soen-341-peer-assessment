CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE Teachers (
    TeacherID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    Username VARCHAR(100) NOT NULL,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE Courses (
    CourseID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    TeacherID INT,
    FOREIGN KEY (TeacherID) REFERENCES Teachers(TeacherID)
);

CREATE TABLE Groups (
    GroupID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    CourseID INT,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

CREATE TABLE Ratings (
    RatingID INT PRIMARY KEY IDENTITY(1,1),
    CooperationRating INT NOT NULL,
    ConceptualContributionRating INT NOT NULL,
    PracticalContributionRating INT NOT NULL,
    WorkEthicRating INT NOT NULL,
    RaterID INT,
    RateeID INT,
    GroupID INT,
    FOREIGN KEY (RaterID) REFERENCES Students(StudentID),
    FOREIGN KEY (RateeID) REFERENCES Students(StudentID),
    FOREIGN KEY (GroupID) REFERENCES Groups(GroupID),
    Comment VARCHAR(MAX),
    CooperationComment VARCHAR(MAX),
    ConceptualContributionComment VARCHAR(MAX),
    PracticalContributionComment VARCHAR(MAX),
    WorkEthicComment VARCHAR(MAX),
);

CREATE TABLE StudentGroup (
    StudentGroupID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT,
    GroupID INT,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (GroupID) REFERENCES Groups(GroupID)
);

CREATE TABLE Announcement (
    AnnouncementID INT PRIMARY KEY IDENTITY(1,1),
    Announcement VARCHAR(MAX) NOT NULL,
    CourseID INT,
    Timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);
