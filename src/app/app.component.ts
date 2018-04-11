import {Component} from '@angular/core';
import {Ocorrencia} from './ocorrencia.model';
import {TipoDeOcorrencia} from './tipo_de_ocorrencia.model';
import {Aluno} from './aluno.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  editando = null;
  matricula = null;
  nome_aluno = null;
  data = null;
  paiscompareceram = false;
  nomedoresponsavel = null;
  observacao = null;
  tipo = null;
  excluir_ok = false;
  editar_ok = false;
  salvar_ok = false;
  selecionado = false;
  salvar_not_ok = false;
  exibir_ok = false;
  alunoPesquisa = null;
  dataInicial = null;
  dataFinal = null;
  qtdIntervalo = 0;


  contadores = [0, 0, 0, 0];
  porcentagens = [0, 0, 0, 0];
  cont_abril = 0;
  cont_marco = 0;
  relacao_ocorrencias = 0;
  constructor(){
      this.invocar_cache();
      this.atualizarEstatisticas();
      this.obter_localStorage();
  }
    tipos = [new TipoDeOcorrencia(0, 'indisciplina em sala de aula'),
        new TipoDeOcorrencia(1, 'comportamento inadequado com colegas'),
        new TipoDeOcorrencia(2, 'baixo índice de rendimento'),
        new TipoDeOcorrencia(3, 'indicação de atenção por assunto familiar, psicológico e/ou social')
    ];

    alunos = [new Aluno(101, 'Lucas'),
        new Aluno(102, 'Karolina'),
        new Aluno(103, 'Jorge'),
        new Aluno(104, 'Lais'),
        new Aluno(105, 'Roberta')
    ];

    ocorrencias = [new Ocorrencia(this.alunos[0], '2018-03-05', 1, true, 'Ismael P. T. Júnior', 'Decepção...'  ),
        new Ocorrencia(this.alunos[1], '2018-03-10', 1, false, null, '...'),
        new Ocorrencia(this.alunos[3], '2018-03-08', 3, true, 'Damião', '...'),
        new Ocorrencia(this.alunos[2], '2018-02-04', 3, false, null, '...' ),
        new Ocorrencia(this.alunos[4], '2018-05-03', 2, true, 'Juvenal', '...')
    ];
    selecionar(status) {
    this.selecionado = status;
  }

  salvar() {
    const situacao = this.paiscompareceram;
    if (this.editando) {
      this.editando.matricula = this.matricula;
      this.editando.nome_aluno = this.nome_aluno;
      this.editando.data = this.data;
      this.editando.paiscompareceram = situacao;
      this.editando.nomedoresponsavel = this.nomedoresponsavel;
      this.editando.observacao = this.observacao;
      this.editando.tipo = this.tipo;
      this.editar_ok = true;
      this.gravar_localStorage(this.editando);
    } 
    else {
      const o = new Ocorrencia(this.matricula, this.nome_aluno, this.data, situacao,this.nomedoresponsavel, this.observacao);
      this.ocorrencias.push(o);
      this.salvar_ok = true;
      this.gravar_localStorage(o);
    }
    this.matricula = null;
    this.nome_aluno = null;
    this.data = null;
    this.paiscompareceram = false;
    this.nomedoresponsavel = null;
    this.observacao = null;
    this.tipo = null;
    this.editando = null;
  }
  pesquisaIntervalos(){
        const inicial = this.dataInicial.split('-', 3);
        const final = this.dataFinal.split('-',3);
        this.qtdIntervalo = 0;

        console.log(inicial[0])
        console.log(final[0]);

        for (var i = 0; i < this.ocorrencias.length; i++) {
            const data = this.ocorrencias[i].data.split('-',3);
            if((parseInt(data[0]) >=  parseInt(inicial[0])) && (parseInt(data[0]) <=  parseInt(final[0]))){
                if((parseInt(data[1]) >=  parseInt(inicial[1])) && (parseInt(data[1]) <=  parseInt(final[1]))){
                    if((parseInt(data[2]) >=  parseInt(inicial[2])) && (parseInt(data[2]) <=  parseInt(final[2]))){
                        this.qtdIntervalo++;
                    }
                }
            }
        }
    }
  excluir(ocorrencia) {
    this.redefinir();
    if (this.editando == ocorrencia) {
      alert('Você não pode excluir uma ocorrencia que está editando');
    } else {
      if (confirm('Tem certeza que deseja excluir a Ocorrencia ?')) {
        const i = this.ocorrencias.indexOf(ocorrencia);
        this.remover_localStorage(ocorrencia);
        this.ocorrencias.splice(i, 1);
        this.excluir_ok = true;
      }
    }
  }

  editar(ocorrencia) {
    this.redefinir();
    this.matricula = ocorrencia.matricula;
    this.nome_aluno = ocorrencia.nome_aluno;
    this.data = ocorrencia.data;
    this.paiscompareceram = ocorrencia.paiscompareceram;
    this.nomedoresponsavel = ocorrencia.nomedoresponsavel;
    this.observacao = ocorrencia.observacao;
    this.tipo = ocorrencia.tipo;
    this.editando = ocorrencia;
  }

  cancelar() {
    this.redefinir();
  }

  redefinir() {
    this.matricula = null;
    this.nome_aluno = null;
    this.data = null;
    this.paiscompareceram = false;
    this.nomedoresponsavel = null;
    this.observacao = null;
    this.tipo = null;
    this.editando = null;
    this.excluir_ok = false;
    this.salvar_ok = false;
    this.editar_ok = false;
  }
    verificarAluno(matricula) {
        for(let a of this.alunos) {
            if(a.matricula == matricula) {
                this.alunoPesquisa = a;
                this.salvar_not_ok = false;
                return true;
            }
        }
        this.salvar_not_ok = true;
        return false;
    }
    atualizarEstatisticas() {
        this.contadores = [0, 0, 0, 0];
        this.cont_abril = 0;
        this.cont_marco = 0;
        for (var i = 0; i < this.ocorrencias.length; i++) {
            this.contadores[this.ocorrencias[i].tipo]++;
            if (this.ocorrencias[i].data.indexOf("-04-") != -1) {
                this.cont_abril++;
            }
            if (this.ocorrencias[i].data.indexOf('-03-') != -1) {
                this.cont_marco++;
            }
        }
        if (this.cont_marco != 0) {
            this.relacao_ocorrencias = (this.cont_abril - this.cont_marco)/this.cont_marco * 100;
        }
        for (var i = 0; i < 4; i++) {
            this.porcentagens[i] = this.contadores[i] / this.ocorrencias.length * 100;
        }
    }
    exibir_estatisticas() {
        if (this.exibir_ok) {
            this.exibir_ok = false;
        }
        else {
            this.exibir_ok = true;
        }
    }
    gravar_localStorage(ocorrencia){
        localStorage.setItem((ocorrencia.matricula).toString(), JSON.stringify(ocorrencia));
    }

    obter_localStorage(){
        for(const i in localStorage){
            const d = JSON.parse(localStorage.getItem(i));
            if(d != undefined){
                this.ocorrencias.push(d);
            }

        }
    }

    remover_localStorage(ocorrencia){
        localStorage.removeItem((ocorrencia.matricula).toString());
    }
    invocar_cache() {
        for(const i in localStorage) {
            const o = JSON.parse(localStorage.getItem(i));
            if(o != undefined){
                this.ocorrencias.push(o);
            }
        }
    }

}
