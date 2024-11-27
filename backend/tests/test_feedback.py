import pytest
from backend.app import app

student_id = '12345678'


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_display_ratings(client):
    with client.session_transaction() as session:
        session['student_id'] = student_id

    response = client.get('/display_ratings', query_string={'student_id': student_id})
    
    assert response.status_code == 200

    data = response.get_json()
    
    assert isinstance(data, list)
    
    if data:
        rating = data[0]
        assert 'CooperationComment' in rating
        assert 'ConceptualContributionComment' in rating
        assert 'PracticalContributionComment' in rating
        assert 'WorkEthicComment' in rating
        assert 'GroupName' in rating
