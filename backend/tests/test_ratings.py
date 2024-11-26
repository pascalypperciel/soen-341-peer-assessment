import pytest
from backend.app import app

# Variables to tweak used in tests
student_id = '12345678'
group_id = 1
rater_id = '12345678'
ratee_id = '1'


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_get_student_groups(client):
    with client.session_transaction() as session:
        session['student_id'] = student_id

    response = client.get('/getStudentGroups', query_string={'student_id': student_id})
    assert response.status_code == 200

    data = response.get_json()
    assert isinstance(data, list)
    if data:
        group = data[0]
        assert 'GroupID' in group
        assert 'GroupName' in group
        assert 'CourseID' in group
        assert 'CourseName' in group


def test_get_student_ratees(client):
    with client.session_transaction() as session:
        session['student_id'] = student_id

    response = client.get(f'/getStudentRatees/{group_id}', query_string={'student_id': student_id})
    assert response.status_code == 200

    data = response.get_json()
    assert 'students' in data
    assert isinstance(data['students'], list)
    if data['students']:
        student = data['students'][0]
        assert 'StudentID' in student
        assert 'Name' in student


def test_insert_stud_ratings(client):
    rating_data = {
        'rater_id': rater_id,
        'ratee_id': ratee_id,
        'group_id': group_id,
        'cooperation_rating': 4,
        'conceptual_contribution_rating': 5,
        'practical_contribution_rating': 4,
        'work_ethic_rating': 5,
        'comment': 'Good teamwork',
        'cooperation_comment': 'Worked well with others',
        'conceptual_contribution_comment': 'Strong ideas',
        'practical_contribution_comment': 'Effective implementation',
        'work_ethic_comment': 'Dedicated'
    }

    response = client.post('/InsertStudRatings', json=rating_data)
    assert response.status_code == 201
    assert response.get_json()['message'] == 'Rating successfully inserted.'
