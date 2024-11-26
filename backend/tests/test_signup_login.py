import pytest
from backend.app import app
from backend.db import conn

student_id = '99999999'
teacher_username = 'teacher_user'
password = 'password123'


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_student_signup(client):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Students WHERE StudentID = ?", (student_id,))
    conn.commit()
    cursor.close()

    response = client.post('/studentSignup', json={
        'studentID': student_id,
        'name': 'Test Student',
        'password': password
    })
    assert response.status_code == 200


def test_teacher_signup(client):
    response = client.post('/teacherSignup', json={
        'name': 'Test Teacher',
        'username': teacher_username,
        'password': password
    })
    assert response.status_code == 200
    assert response.json['message'] == 'Signup successful'


def test_student_login(client):
    response = client.get('/studentLogin', query_string={
        'studentID': student_id,
        'password': password
    })

    cursor = conn.cursor()
    cursor.execute("DELETE FROM Students WHERE StudentID = ?", (student_id,))
    conn.commit()
    cursor.close()

    assert response.status_code == 200
    assert response.json['message'] == 'Login successful'


def test_teacher_login(client):
    response = client.get('/teacherLogin', query_string={
        'username': teacher_username,
        'password': password
    })

    cursor = conn.cursor()
    cursor.execute("DELETE FROM Teachers WHERE Username = ?", (teacher_username,))
    conn.commit()
    cursor.close()

    assert response.status_code == 200
    assert response.json['message'] == 'Login successful'
