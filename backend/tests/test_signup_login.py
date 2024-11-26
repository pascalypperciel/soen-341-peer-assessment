import pytest
from backend.app import app
from backend.db import conn
from werkzeug.security import generate_password_hash, check_password_hash

student_id = '99999999'
teacher_username = 'teacher_user'
password = 'password123'
teacher_id = '12345'
new_password = 'newpassword123'


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


def test_change_student_password(client):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Students (StudentID, Name, Password) VALUES (?, ?, ?)",
                   (student_id, 'Test Student', generate_password_hash(password)))
    conn.commit()
    cursor.close()

    response = client.put('/changeStudentPassword', json={
        'student_id': student_id,
        'new_password': new_password
    })
    assert response.status_code == 200
    assert response.json['message'] == 'Password updated successfully'

    cursor = conn.cursor()
    cursor.execute("SELECT Password FROM Students WHERE StudentID = ?", (student_id,))
    result = cursor.fetchone()
    cursor.close()

    assert result is not None
    assert check_password_hash(result[0], new_password)


def test_change_teacher_password(client):
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Teachers (Name, Username, Password) VALUES (?, ?, ?)",
        ('Test Teacher', teacher_username, generate_password_hash(password))
    )
    conn.commit()
    cursor.close()

    response = client.put('/changeTeacherPassword', json={
        'username': teacher_username,
        'new_password': new_password
    })
    assert response.status_code == 200
    assert response.json['message'] == 'Password updated successfully'

    cursor = conn.cursor()
    cursor.execute("SELECT Password FROM Teachers WHERE Username = ?", (teacher_username,))
    result = cursor.fetchone()
    cursor.close()

    assert result is not None
    assert check_password_hash(result[0], new_password)
