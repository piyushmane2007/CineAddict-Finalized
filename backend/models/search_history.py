from datetime import datetime
from models.db import db 


class SearchHistory(db.Model):
    __tablename__ = "search_history"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )  

    search_query = db.Column(
            db.String(255),
            nullable=False
        ) 
    
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def __repr__(self):
        return f"<SearchHistory {self.search_query}>"