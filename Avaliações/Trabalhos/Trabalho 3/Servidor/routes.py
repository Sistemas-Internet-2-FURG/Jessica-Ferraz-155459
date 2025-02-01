from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models import Usuario, Paciente, Medico, Consulta, db

routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/')
@jwt_required()
def index():
    current_user = get_jwt_identity()
    return jsonify(message=f"Bem-vindo, {current_user}!"), 200

@routes_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    usuario = Usuario.query.filter_by(username=username).first()
    if usuario and usuario.check_password(password):
        token = create_access_token(identity=usuario.username)
        return jsonify(access_token=token), 200
    return jsonify(message="Credenciais inválidas"), 401

@routes_bp.route('/registro', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if Usuario.query.filter_by(username=username).first():
        return jsonify(error="Nome de usuário já existe"), 400

    try:
        novo_usuario = Usuario(username=username)
        novo_usuario.set_password(password)
        db.session.add(novo_usuario)
        db.session.commit()
        return jsonify(message="Usuário registrado com sucesso!"), 201
    except Exception as e:
        return jsonify(error="Erro ao registrar o usuário", details=str(e)), 500
    
@routes_bp.route('/pacientes', methods=['GET'])
@jwt_required()
def listar_pacientes():
    pacientes = Paciente.query.all()

    lista_pacientes = []
    for paciente in pacientes:
        lista_pacientes.append({
            'id': paciente.id,
            'nome': paciente.nome,
        })

    return jsonify(pacientes=lista_pacientes), 200

@routes_bp.route('/medicos', methods=['GET'])
@jwt_required()
def listar_medicos():
    medicos = Medico.query.all()
    
    lista_medicos = []
    for medico in medicos:
        lista_medicos.append({
            'id': medico.id,
            'nome': medico.nome,
        })

    return jsonify(medicos=lista_medicos), 200

@routes_bp.route('/consultas', methods=['GET'])
@jwt_required()
def listar_consultas():
    consultas = Consulta.query.all()

    lista_consultas = []
    for consulta in consultas:
        lista_consultas.append({
            'id': consulta.id,
            'data': consulta.data.strftime('%d/%m/%Y %H:%M'),
            'paciente': consulta.paciente.nome,
            'medico': consulta.medico.nome
        })

    return jsonify(consultas=lista_consultas), 200

@routes_bp.route('/pacientes', methods=['POST'])
@jwt_required()
def adicionar_paciente():
    data = request.json
    nome = data.get('nome')
    data_nascimento = data.get('data_nascimento')
    endereco = data.get('endereco')
    telefone = data.get('telefone')

    if not nome or not data_nascimento or not endereco or not telefone:
        return jsonify(error="Todos os campos são obrigatórios!"), 400

    try:
        novo_paciente = Paciente(nome=nome, data_nascimento=datetime.strptime(data_nascimento, '%Y-%m-%d').date(), endereco=endereco, telefone=telefone)
        db.session.add(novo_paciente)
        db.session.commit()
        return jsonify(message="Paciente adicionado com sucesso!", id=novo_paciente.id), 201
    except Exception as e:
        return jsonify(error="Erro ao adicionar paciente!"), 500


@routes_bp.route('/medicos', methods=['POST'])
@jwt_required()
def adicionar_medico():
    data = request.json
    nome = data.get('nome')
    especialidade = data.get('especialidade')
    crm = data.get('crm')

    if not nome or not especialidade or not crm:
        return jsonify(error="Todos os campos são obrigatórios!"), 400

    try:
        novo_medico = Medico(nome=nome, especialidade=especialidade, crm=crm)
        db.session.add(novo_medico)
        db.session.commit()
        return jsonify(message="Médico adicionado com sucesso!", id=novo_medico.id), 201
    except Exception as e:
        return jsonify(error="Erro ao adicionar médico"), 500

@routes_bp.route('/consultas', methods=['POST'])
@jwt_required()
def adicionar_consulta():
    data = request.json
    paciente_id = data.get('paciente_id')
    medico_id = data.get('medico_id')
    data_consulta = data.get('data')
    motivo = data.get('motivo')

    if not paciente_id or not medico_id or not data_consulta or not motivo:
        return jsonify(error="Todos os campos são obrigatórios!"), 400

    paciente = Paciente.query.get(paciente_id)
    medico = Medico.query.get(medico_id)

    if not paciente:
        return jsonify(error="Paciente não encontrado."), 404
    if not medico:
        return jsonify(error="Médico não encontrado."), 404

    try:
        nova_consulta = Consulta(paciente_id=paciente_id, medico_id=medico_id, data=data_consulta, motivo=motivo)
        db.session.add(nova_consulta)
        db.session.commit()
        return jsonify(message="Consulta adicionada com sucesso!", id=nova_consulta.id), 201
    except Exception as e:
        return jsonify(error="Erro ao adicionar consulta", details=str(e)), 500

@routes_bp.route('/consultas/<int:id>', methods=['GET'])
@jwt_required()
def detalhes_consulta(id):
    
    consulta = Consulta.query.get(id)

    if not consulta:
        return jsonify(error="Consulta não encontrada."), 404

    consulta_data = {
        'id': consulta.id,
        'paciente': {
            'id': consulta.paciente.id,
            'nome': consulta.paciente.nome,
            'data_nascimento': consulta.paciente.data_nascimento.strftime('%Y-%m-%d'),
            'endereco': consulta.paciente.endereco,
            'telefone': consulta.paciente.telefone
        },
        'medico': {
            'id': consulta.medico.id,
            'nome': consulta.medico.nome,
            'especialidade': consulta.medico.especialidade,
            'crm': consulta.medico.crm
        },
        'data': consulta.data.strftime('%d/%m/%Y %H:%M'),
        'motivo': consulta.motivo
    }

    return jsonify(consulta=consulta_data), 200

@routes_bp.route('/medicos/<int:id>', methods=['GET'])
@jwt_required()
def detalhes_medico(id):
    
    medico = Medico.query.get(id)

    if not medico:
        return jsonify(error="Médico não encontrado."), 404

    medico_data = {
        'id': medico.id,
        'nome': medico.nome,
        'especialidade': medico.especialidade,
        'crm': medico.crm
    }

    return jsonify(medico=medico_data), 200

@routes_bp.route('/pacientes/<int:id>', methods=['GET'])
@jwt_required()
def detalhes_paciente(id):
    
    paciente = Paciente.query.get(id)

    if not paciente:
        return jsonify(error="Paciente não encontrado."), 404

    paciente_data = {
        'id': paciente.id,
        'nome': paciente.nome,
        'data_nascimento': paciente.data_nascimento.strftime('%d/%m/%Y'),
        'endereco': paciente.endereco,
        'telefone': paciente.telefone
    }

    return jsonify(paciente=paciente_data), 200

@routes_bp.route('/consultas/<int:id>', methods=['DELETE'])
@jwt_required()
def deletar_consulta(id):
    
    consulta = Consulta.query.get(id)

    if not consulta:
        return jsonify(error="Consulta não encontrada."), 404

    try:
        db.session.delete(consulta)
        db.session.commit()
        return jsonify(message="Consulta deletada com sucesso!"), 200
    except Exception as e:
        return jsonify(error="Erro ao deletar consulta"), 500

@routes_bp.route('/medicos/<int:id>', methods=['DELETE'])
@jwt_required()
def deletar_medico(id):
    
    medico = Medico.query.get(id)

    if not medico:
        return jsonify(error="Médico não encontrado."), 404
    
    Consulta.query.filter_by(medico_id=id).delete()

    try:
        db.session.delete(medico)
        db.session.commit()
        return jsonify(message="Médico deletado com sucesso!"), 200
    except Exception as e:
        return jsonify(error="Erro ao deletar médico"), 500

@routes_bp.route('/pacientes/<int:id>', methods=['DELETE'])
@jwt_required()
def deletar_paciente(id):
    
    paciente = Paciente.query.get(id)

    if not paciente:
        return jsonify(error="Paciente não encontrado."), 404
    
    Consulta.query.filter_by(paciente_id=id).delete()

    try:
        db.session.delete(paciente)
        db.session.commit()
        return jsonify(message="Paciente deletado com sucesso!"), 200
    except Exception as e:
        return jsonify(error="Erro ao deletar paciente"), 500
    
@routes_bp.route('/pacientes/<int:id>', methods=['PUT'])
@jwt_required()
def editar_paciente(id):
    paciente = Paciente.query.get(id)
    
    if not paciente:
        return jsonify(error="Paciente não encontrado."), 404

    data = request.json
    paciente.nome = data.get('nome', paciente.nome)
    data_nascimento = data.get('data_nascimento', paciente.data_nascimento)
    paciente.data_nascimento = datetime.strptime(data_nascimento, '%Y-%m-%d').date()
    paciente.endereco = data.get('endereco', paciente.endereco)
    paciente.telefone = data.get('telefone', paciente.telefone)

    try:
        db.session.commit()
        return jsonify(message="Paciente atualizado com sucesso!"), 200
    except Exception as e:
        return jsonify(error="Erro ao atualizar paciente", details=str(e)), 500

@routes_bp.route('/medicos/<int:id>', methods=['PUT'])
@jwt_required()
def editar_medico(id):
    medico = Medico.query.get(id)
    
    if not medico:
        return jsonify(error="Médico não encontrado."), 404

    data = request.json
    medico.nome = data.get('nome', medico.nome)
    medico.especialidade = data.get('especialidade', medico.especialidade)
    medico.crm = data.get('crm', medico.crm)

    try:
        db.session.commit()
        return jsonify(message="Médico atualizado com sucesso!"), 200
    except Exception as e:
        return jsonify(error="Erro ao atualizar médico", details=str(e)), 500

@routes_bp.route('/consultas/<int:id>', methods=['PUT'])
@jwt_required()
def editar_consulta(id):
    consulta = Consulta.query.get(id)
    
    if not consulta:
        return jsonify(error="Consulta não encontrada."), 404

    data = request.json
    consulta.paciente_id = data.get('paciente_id', consulta.paciente_id)
    consulta.medico_id = data.get('medico_id', consulta.medico_id)
    consulta.data = data.get('data', consulta.data.strftime('%Y-%m-%d %H:%M'))
    consulta.motivo = data.get('motivo', consulta.motivo)

    try:
        db.session.commit()
        return jsonify(message="Consulta atualizada com sucesso!"), 200
    except Exception as e:
        return jsonify(error="Erro ao atualizar consulta", details=str(e)), 500