from datetime import timedelta
import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:1391@localhost:5432/consultas_api')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'uma_chave_secreta_muito_segura'
    JWT_SECRET_KEY = 'outra_chave_secreta_muito_segura'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=10)
