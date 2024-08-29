from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

# Inicialização da aplicação Flask
app = Flask(__name__)
app.config.from_object('config.Config')  # Configuração do banco de dados e outras configurações



# Inicialização do banco de dados e do mecanismo de migração
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    data_nascimento = db.Column(db.Date, nullable=False)
    endereco = db.Column(db.String(200), nullable=False)
    telefone = db.Column(db.String(15), nullable=False)

class Medico(db.Model):
    __tablename__ = 'medicos'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    especialidade = db.Column(db.String(100), nullable=False)
    crm = db.Column(db.String(20), nullable=False)

class Consulta(db.Model):
    __tablename__ = 'consultas'
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    medico_id = db.Column(db.Integer, db.ForeignKey('medicos.id'), nullable=False)
    data = db.Column(db.DateTime, nullable=False)
    motivo = db.Column(db.String(200), nullable=False)
    
    paciente = db.relationship('Paciente', backref='consultas')
    medico = db.relationship('Medico', backref='consultas')


@app.route('/')
def index():
    return render_template('index.html')

# Rotas para Pacientes
@app.route('/pacientes')
def lista_pacientes():
    pacientes = Paciente.query.all()
    return render_template('lista_pacientes.html', pacientes=pacientes)

@app.route('/pacientes/novo', methods=['GET', 'POST'])
def novo_paciente():
    if request.method == 'POST':
        nome = request.form['nome']
        data_nascimento = request.form['data_nascimento']
        endereco = request.form['endereco']
        telefone = request.form['telefone']

        novo_paciente = Paciente(nome=nome, data_nascimento=datetime.strptime(data_nascimento, '%Y-%m-%d').date(), endereco=endereco, telefone=telefone)
        db.session.add(novo_paciente)
        db.session.commit()

        flash('Paciente criado com sucesso!')
        return redirect(url_for('lista_pacientes'))

    return render_template('novo_paciente.html')

@app.route('/pacientes/editar/<int:id>', methods=['GET', 'POST'])
def editar_paciente(id):
    paciente = Paciente.query.get_or_404(id)

    if request.method == 'POST':
        paciente.nome = request.form['nome']
        paciente.data_nascimento = datetime.strptime(request.form['data_nascimento'], '%Y-%m-%d').date()
        paciente.endereco = request.form['endereco']
        paciente.telefone = request.form['telefone']

        db.session.commit()

        flash('Paciente atualizado com sucesso!')
        return redirect(url_for('lista_pacientes'))

    return render_template('editar_paciente.html', paciente=paciente)

@app.route('/pacientes/<int:id>')
def detalhes_paciente(id):
    paciente = Paciente.query.get_or_404(id)
    return render_template('detalhes_paciente.html', paciente=paciente)

@app.route('/pacientes/deletar/<int:id>', methods=['POST'])
def deletar_paciente(id):
    paciente = Paciente.query.get_or_404(id)
    # Exclui as consultas associadas
    Consulta.query.filter_by(paciente_id=id).delete()
    # Exclui o paciente
    db.session.delete(paciente)
    db.session.commit()
    flash('Paciente deletado com sucesso!')
    return redirect(url_for('lista_pacientes'))



@app.route('/medicos/<int:id>')
def detalhes_medico(id):
    medico = Medico.query.get_or_404(id)
    return render_template('detalhes_medico.html', medico=medico)

@app.route('/consultas/<int:id>')
def detalhes_consulta(id):
    consulta = Consulta.query.get_or_404(id)
    return render_template('detalhes_consulta.html', consulta=consulta)



# Rotas para Médicos
@app.route('/medicos')
def lista_medicos():
    medicos = Medico.query.all()
    return render_template('lista_medicos.html', medicos=medicos)

@app.route('/medicos/novo', methods=['GET', 'POST'])
def novo_medico():
    if request.method == 'POST':
        nome = request.form['nome']
        especialidade = request.form['especialidade']
        crm = request.form['crm']

        novo_medico = Medico(nome=nome, especialidade=especialidade, crm=crm)
        db.session.add(novo_medico)
        db.session.commit()

        flash('Médico criado com sucesso!')
        return redirect(url_for('lista_medicos'))

    return render_template('novo_medico.html')

@app.route('/medicos/editar/<int:id>', methods=['GET', 'POST'])
def editar_medico(id):
    medico = Medico.query.get_or_404(id)

    if request.method == 'POST':
        medico.nome = request.form['nome']
        medico.especialidade = request.form['especialidade']
        medico.crm = request.form['crm']

        db.session.commit()

        flash('Médico atualizado com sucesso!')
        return redirect(url_for('lista_medicos'))

    return render_template('editar_medico.html', medico=medico)

@app.route('/medicos/deletar/<int:id>', methods=['POST'])
def deletar_medico(id):
    medico = Medico.query.get_or_404(id)
    Consulta.query.filter_by(medico_id=id).delete()
    db.session.delete(medico)
    db.session.commit()
    flash('Médico deletado com sucesso!')
    return redirect(url_for('lista_medicos'))

# Rotas para Consultas
@app.route('/consultas')
def lista_consultas():
    consultas = Consulta.query.all()
    return render_template('lista_consultas.html', consultas=consultas)

@app.route('/consultas/novo', methods=['GET', 'POST'])
def nova_consulta():
    if request.method == 'POST':
        paciente_id = request.form['paciente_id']
        medico_id = request.form['medico_id']
        data = request.form['data']
        motivo = request.form['motivo']

        nova_consulta = Consulta(paciente_id=paciente_id, medico_id=medico_id, data=datetime.strptime(data, '%Y-%m-%dT%H:%M'), motivo=motivo)
        db.session.add(nova_consulta)
        db.session.commit()

        flash('Consulta criada com sucesso!')
        return redirect(url_for('lista_consultas'))

    pacientes = Paciente.query.all()
    medicos = Medico.query.all()
    return render_template('nova_consulta.html', pacientes=pacientes, medicos=medicos)

@app.route('/consultas/editar/<int:id>', methods=['GET', 'POST'])
def editar_consulta(id):
    consulta = Consulta.query.get_or_404(id)

    if request.method == 'POST':
        consulta.paciente_id = request.form['paciente_id']
        consulta.medico_id = request.form['medico_id']
        consulta.data = datetime.strptime(request.form['data'], '%Y-%m-%dT%H:%M')
        consulta.motivo = request.form['motivo']

        db.session.commit()

        flash('Consulta atualizada com sucesso!')
        return redirect(url_for('lista_consultas'))

    pacientes = Paciente.query.all()
    medicos = Medico.query.all()
    return render_template('editar_consulta.html', consulta=consulta, pacientes=pacientes, medicos=medicos)

@app.route('/consultas/deletar/<int:id>', methods=['POST'])
def deletar_consulta(id):
    consulta = Consulta.query.get_or_404(id)
    db.session.delete(consulta)
    db.session.commit()
    flash('Consulta deletada com sucesso!')
    return redirect(url_for('lista_consultas'))

# Inicializa o servidor Flask
if __name__ == '__main__':
    app.run(debug=True)
