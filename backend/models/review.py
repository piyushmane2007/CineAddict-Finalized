from models.db import db
from datetime import datetime

class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    movie_id = db.Column(db.Integer, nullable=False)

    rating = db.Column(db.Integer, nullable=False)

    review = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="reviews")

    def __repr__(self):
        return f"<Review {self.id}>"