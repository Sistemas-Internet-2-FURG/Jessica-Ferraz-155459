import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:1391@localhost:5432/consultas_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'uma_chave_secreta_muito_segura'
