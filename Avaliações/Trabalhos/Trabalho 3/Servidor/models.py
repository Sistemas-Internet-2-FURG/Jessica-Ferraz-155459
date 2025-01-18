from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
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
            'paciente': self.paciente.to_dict(),
            'medico': self.medico.to_dict()
        }
