from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, decode_token, get_jwt_identity, jwt_required
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:1391@localhost:5432/consultas_api')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'uma_chave_secreta_muito_segura'

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)

app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

CORS(app)


class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255))

    def set_password(self, password):
        """Criptografa a senha e a armazena no banco"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifica se a senha fornecida corresponde à armazenada"""
        return check_password_hash(self.password_hash, password)

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    data_nascimento = db.Column(db.Date, nullable=False)
    endereco = db.Column(db.String(200), nullable=False)
    telefone = db.Column(db.String(15), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'data_nascimento': self.data_nascimento.isoformat(),
            'endereco': self.endereco,
            'telefone': self.telefone
        }

class Medico(db.Model):
    __tablename__ = 'medicos'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    especialidade = db.Column(db.String(100), nullable=False)
    crm = db.Column(db.String(20), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'especialidade': self.especialidade,
            'crm': self.crm
        }

class Consulta(db.Model):
    __tablename__ = 'consultas'
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    medico_id = db.Column(db.Integer, db.ForeignKey('medicos.id'), nullable=False)
    data = db.Column(db.DateTime, nullable=False)
    motivo = db.Column(db.String(200), nullable=False)
    paciente = db.relationship('Paciente', backref='consultas')
    medico = db.relationship('Medico', backref='consultas')
    
    def to_dict(self):
        return {
            'id': self.id,
            'paciente_id': self.paciente_id,
            'medico_id': self.medico_id,
            'data': self.data.isoformat(),
            'motivo': self.motivo,
            'paciente': self.paciente,
            'medico': self.medico
        }


@app.route('/')
@jwt_required()
def index():
    current_user = get_jwt_identity()
    return jsonify(message=f"Bem-vindo, {current_user}!"), 200

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    usuario = Usuario.query.filter_by(username=username).first()
    if usuario and usuario.check_password(password):
        token = create_access_token(identity=usuario.username) #username apenas
        decode_token(encoded_token=token)
        return jsonify(access_token=token), 200
    return jsonify(message="Credenciais inválidas"), 401

@app.route('/registro', methods=['POST'])
def register():
    data = request.json
    # Verifica se o nome de usuário já existe
    usuario_existente = Usuario.query.filter_by(username=data['username']).first()
    
    if usuario_existente:
        return jsonify({"error": "Nome de usuário já existe"}), 400
    
    try:
        # Cria o novo usuário
        novo_usuario = Usuario(username=data['username'])
        novo_usuario.set_password(data['password'])  # Criptografa a senha
        db.session.add(novo_usuario)
        db.session.commit()
        
        return jsonify({"message": "Usuário registrado com sucesso!"}), 201
    except Exception as e:
        return jsonify({"error": "Erro ao registrar o usuário", "details": str(e)}), 500

