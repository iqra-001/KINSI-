from app import create_app, db

def setup_app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
    return app

def test_signup_and_login():
    app = setup_app()
    client = app.test_client()

    r = client.post('/api/auth/signup', json={'username':'u1','email':'u1@example.com','password':'P@ssword1'})
    assert r.status_code in (200,201)

    r = client.post('/api/auth/login', json={'email':'u1@example.com','password':'P@ssword1'})
    assert r.status_code == 200
    assert r.get_json().get('success') is True
