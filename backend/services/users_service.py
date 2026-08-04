from models.db import db
from models.user import User 

def create_user(username,email,password):
    new_user = User(
        username = username, 
        email = email,
        password = password,
    ) 

    db.session.add(new_user)
    db.session.commit() 

    return new_user 

def get_all_users():
    return User.query.all() 

def get_user_by_id(user_id):
    return User.query.get(user_id)  

def update_user(user_id, username, email):
    user = User.query.get(user_id)

    if not user:
        return None

    user.username = username
    user.email = email

    db.session.commit()

    return user 

def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return False

    db.session.delete(user)
    db.session.commit()

    return True