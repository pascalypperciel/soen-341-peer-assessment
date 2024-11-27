import pytest
from backend.app import app

teacher_id = 17  # teacher id that we know exist
nonexistent_teacher_id = -1  # teacher id that we know don't exist


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_get_student_ratings(client):
    with client.session_transaction() as session:
        session['teacher_id'] = teacher_id

    response = client.get('/getStudentRatings', query_string={'teacher_id': teacher_id})
    assert response.status_code == 200

    data = response.get_json()
    assert isinstance(data, list)
    if data:
        rating = data[0]
        assert 'RatingID' in rating
        assert 'CooperationRating' in rating
        assert 'ConceptualContributionRating' in rating
        assert 'PracticalContributionRating' in rating
        assert 'WorkEthicRating' in rating
        assert 'Comment' in rating
        assert 'CooperationComment' in rating
        assert 'ConceptualContributionComment' in rating
        assert 'PracticalContributionComment' in rating
        assert 'WorkEthicComment' in rating
        assert 'RaterID' in rating
        assert 'RateeID' in rating
        assert 'RateeName' in rating
        assert 'RaterName' in rating
        assert 'GroupID' in rating
        assert 'GroupName' in rating
    else:
        assert response.get_json() == []


def test_get_student_ratings_with_nonexistent_teacher(client):
    with client.session_transaction() as session:
        session['teacher_id'] = nonexistent_teacher_id

    response = client.get('/getStudentRatings', query_string={'teacher_id': nonexistent_teacher_id})
    assert response.status_code == 200

    data = response.get_json()
    assert isinstance(data, list)
    assert data == []
