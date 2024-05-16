import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { EnderecoService } from '../services/endereco.service';
import { Endereco } from '../models/endereço';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class FormularioComponent implements OnInit {
  formulario: FormGroup = new FormGroup({});
  cep: string = '';

  constructor(
    private formBuilder: FormBuilder, // Injeta o serviço FormBuilder para construir o formulário
    private enderecoService: EnderecoService // Injeta o serviço EnderecoService para buscar dados de endereço
  ) { }

  ngOnInit(): void {
    // Inicializa o formulário com os campos e suas validações
    this.formulario = this.formBuilder.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]], // Campo nome completo com validação de obrigatório e mínimo de 3 caracteres
      dataNascimento: ['', Validators.required], // Campo data de nascimento obrigatório
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]], // Campo CPF obrigatório com validação de 11 dígitos
      email: ['', [Validators.required, Validators.email]], // Campo email obrigatório com validação de formato de email
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]], // Campo telefone obrigatório com validação de 10 ou 11 dígitos
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Campo CEP obrigatório com validação de 8 dígitos
      rua: ['', Validators.required], // Campo rua obrigatório
      numero: ['', Validators.required], // Campo número obrigatório
      complemento: [''], // Campo complemento opcional
      bairro: ['', Validators.required], // Campo bairro obrigatório
      cidade: ['', Validators.required], // Campo cidade obrigatório
      estado: ['', Validators.required] // Campo estado obrigatório
    });
  }

  submitForm() {
    if (this.formulario.valid) {
      console.log(this.formulario.value); // Se o formulário for válido, exibe os valores no console
    } else {
      console.log("Formulário inválido"); // Se o formulário for inválido, exibe mensagem no console
    }
  }

  buscarEndereco() {
    const formulario = this.formulario;
    if (formulario) {
      const controleCep = formulario.get('cep');
      if (controleCep) {
        this.cep = controleCep.value; // Obtém o valor do campo CEP
        this.enderecoService.getEndereco(this.cep) // Chama o serviço para buscar o endereço pelo CEP
          .then((endereco: Endereco) => {
            // Preenche os campos do formulário com os dados do endereço retornado
            this.formulario.patchValue({
              rua: endereco.logradouro,
              bairro: endereco.bairro,
              cidade: endereco.cidade,
              estado: endereco.uf
            });
          })
          .catch((error) => {
            console.error('Erro ao buscar endereço:', error); // Exibe erro no console se a busca falhar
          });
      } else {
        console.error('Controle CEP não encontrado no formulário.'); // Exibe erro no console se o controle CEP não for encontrado
      }
    } else {
      console.error('Formulário não encontrado.'); // Exibe erro no console se o formulário não for encontrado
    }
  }

  validateAllFormFields(formGroup: FormGroup) {         
    // Função recursiva para marcar todos os campos do formulário como tocados
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });       
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);            
      }
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      // Lógica de envio do formulário
      console.log('Formulário enviado com sucesso!');
      // Limpar o formulário após o envio
      this.formulario.reset();
    } else {
      // Marcar todos os campos como tocados para mostrar possíveis erros
      Object.keys(this.formulario.controls).forEach(field => {
        const control = this.formulario.get(field);
        if (control) { // Verifica se control não é nulo
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }
}
