#!/bin/bash
# Start both frontend and backend servers

# Start backend (Flask)
cd backend
# You may need to activate your virtual environment here, e.g.:
# source venv/bin/activate
export FLASK_APP=app.py
(flask run &)
cd ..

# Start frontend (React)
cd frontend
npm start
