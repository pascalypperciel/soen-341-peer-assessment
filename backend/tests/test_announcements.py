import pytest
from backend.app import app

teacher_id = 12345
student_id = 67890
course_id = 2
announcement_text = "Exam on Friday"
announcement_id = 123


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_create_announcement(client):
    data = {
        "courseID": course_id,
        "announcement": announcement_text
    }
    response = client.post('/Create_Announcement', json=data)
    assert response.status_code == 200

    response_data = response.get_json()
    assert response_data['message'] == "Announcement Successfully added"


def test_create_announcement_missing_data(client):
    data = {
        "courseID": course_id
    }
    response = client.post('/Create_Announcement', json=data)
    assert response.status_code == 400

    response_data = response.get_json()
    assert "error" in response_data
    assert response_data['error'] == "Missing required fields"


def test_get_announcements_teachers(client):
    response = client.get('/get_Announcements_Teachers', query_string={'Teacher_id': teacher_id})
    assert response.status_code == 200

    data = response.get_json()
    assert 'announcements' in data
    assert isinstance(data['announcements'], list)
    if data['announcements']:
        announcement = data['announcements'][0]
        assert 'Announcement' in announcement
        assert 'CourseID' in announcement
        assert 'AnnouncementID' in announcement
        assert 'CourseName' in announcement
        assert 'Timestamp' in announcement


def test_get_announcements_teachers_nonexistent_teacher(client):
    nonexistent_teacher_id = 99999
    response = client.get('/get_Announcements_Teachers', query_string={'Teacher_id': nonexistent_teacher_id})
    assert response.status_code == 200

    data = response.get_json()
    assert 'announcements' in data
    assert isinstance(data['announcements'], list)
    assert data['announcements'] == []


def test_get_announcements_students(client):
    response = client.get('/get_Announcements_Students', query_string={'student_id': student_id})
    assert response.status_code == 200

    data = response.get_json()
    assert 'announcements' in data
    assert isinstance(data['announcements'], list)
    if data['announcements']:
        announcement = data['announcements'][0]
        assert 'Announcement' in announcement
        assert 'CourseID' in announcement
        assert 'CourseName' in announcement
        assert 'Timestamp' in announcement


def test_get_announcements_students_nonexistent_student(client):
    nonexistent_student_id = 99999
    response = client.get('/get_Announcements_Students', query_string={'student_id': nonexistent_student_id})
    assert response.status_code == 200

    data = response.get_json()
    assert 'announcements' in data
    assert isinstance(data['announcements'], list)
    assert data['announcements'] == []


def test_update_announcement(client):
    data = {
        "courseID": course_id,
        "announcement": "Updated exam date: next Friday",
        "announcementID": announcement_id
    }
    response = client.put('/Update_Announcement', json=data)
    assert response.status_code == 200

    response_data = response.get_json()
    assert response_data['message'] == "Announcement Successfully updated"


def test_update_announcement_missing_data(client):
    data = {
        "courseID": course_id,
        "announcementID": announcement_id
    }
    response = client.put('/Update_Announcement', json=data)
    assert response.status_code == 400

    response_data = response.get_json()
    assert "error" in response_data
    assert response_data['error'] == "Missing required fields"
