from app import app, socketio

if __name__ =="__main__":
    socketio.run(app)

# Gunicorn and uWSGI are WSGI servers that can be used to serve Python web applications.
# They are often used in production environments to handle multiple requests efficiently.