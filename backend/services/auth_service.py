from werkzeug.security import generate_password_hash, check_password_hash
from models.db import db 
from models.user import User 

def register_user(username,email,password):
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return None 
    
    hashed_password = generate_password_hash(password) 

    new_user = User(
        username = username,
        email = email, 
        password = hashed_password
    ) 

    db.session.add(new_user)
    db.session.commit()

    return new_user 

def login_user(email,password):
    user = User.query.filter_by(email=email).first()

    if not user:
        return None 
    
    if not check_password_hash(user.password, password):
        return None 
    
    return user 
    
