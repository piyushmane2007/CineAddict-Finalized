from models.db import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)

    watchlist = db.relationship(
    "Watchlist",
    backref="user",
    lazy=True,
    cascade="all, delete-orphan"
) 
    favorites = db.relationship(
    "Favorite",
    backref="user",
    lazy=True,
    cascade="all, delete-orphan"
) 
    search_history = db.relationship(
    "SearchHistory",
    backref="user",
    lazy=True,
    cascade="all, delete-orphan"
)
    recently_viewed = db.relationship(
    "Recently_Viewed",
    backref="user",
    lazy=True,
    cascade="all, delete-orphan"
)

    def __repr__(self):
        return f"<User {self.username}>" 
    
    



