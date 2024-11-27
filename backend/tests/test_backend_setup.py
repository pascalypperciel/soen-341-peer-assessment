from backend.app import app


def test_backend_initialization():
    assert app is not None
