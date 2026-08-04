from datetime import datetime 
from models.db import db


class Recently_Viewed(db.Model):
    __tablename__ = "recently_viewed"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    movie_id = db.Column(db.Integer, nullable=False)

    movie_title = db.Column(db.String(255), nullable=False)

    poster_url = db.Column(db.String(500)) 

    viewed_at = db.Column(
    db.DateTime,
    default=datetime.utcnow
)

    def __repr__(self):
        return f"<Recently_Viewed {self.movie_title}>"