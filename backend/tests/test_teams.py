import pytest
from backend.app import app
from backend.db import conn

teacher_id = '1'  # Test teacher ID
team_id = None    # To hold created team ID for deletion/edit tests

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_make_team_manually(client):
    cursor = conn.cursor()

    # Clean test data (if any)
    cursor.execute("DELETE FROM Groups WHERE Name = 'Test Team'")
    conn.commit()

    cursor.close()

    # Test manual team creation
    response = client.post('/makeTeamsManually', json={
        'team_name': 'Test Team',
        'course_name': 'Test Course',
        'student_ids': [1, 2],
        'teacher_id': teacher_id
    })

    assert response.status_code == 200
    assert response.json['message'] == 'Inserts successful'

    # Verify database for creation
    cursor = conn.cursor()
    cursor.execute("SELECT GroupID FROM Groups WHERE Name = 'Test Team'")
    group = cursor.fetchone()

    assert group is not None
    global team_id
    # Store the created team ID (for future tests)
    team_id = group[0] 

    cursor.close()



def test_display_teams_teacher(client):
    # Test fetching teams (teacher)
    response = client.get('/displayTeamsTeacher', query_string={
        'teacher_id': teacher_id
    })

    assert response.status_code == 200
    groups = response.json

    # Check if "Test Team" exists
    assert any(group['groupName'] == 'Test Team' for group in groups)



def test_edit_team(client):
    global team_id
    if not team_id:
        pytest.fail("No team ID to edit. Ensure test_make_team_manually ran successfully.")

    # editing team name and course
    response = client.put('/editTeam', json={
        'team_id': team_id,
        'course_id': 1, 
        'team_name': 'Edited Test Team',
        'course_name': 'Edited Test Course',
        'student_ids': [1, 2]
    })

    assert response.status_code == 200
    assert response.json['message'] == 'Edit successful'

    # Database check for changes
    cursor = conn.cursor()
    cursor.execute("SELECT Name FROM Groups WHERE GroupID = ?", (team_id,))
    group = cursor.fetchone()

    assert group is not None
    assert group[0] == 'Edited Test Team'

    cursor.close()



def test_delete_team(client):
    global team_id
    if not team_id:
        pytest.fail("No team ID to delete. Ensure test_make_team_manually ran successfully.")

    # delete team
    response = client.post('/deleteTeam', json={
        'team_id': team_id
    })

    assert response.status_code == 200
    assert response.json['message'] == 'Delete successful'

    # Verify deletion
    cursor = conn.cursor()
    cursor.execute("SELECT GroupID FROM Groups WHERE GroupID = ?", (team_id,))
    group = cursor.fetchone()

    assert group is None

    cursor.close()
