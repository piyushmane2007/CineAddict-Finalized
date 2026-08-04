from models.db import db 

class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    movie_id = db.Column(db.Integer, nullable=False)

    movie_title = db.Column(db.String(255), nullable=False)

    poster_url = db.Column(db.String(500))

    def __repr__(self):
        return f"<Favorite {self.movie_title}>"