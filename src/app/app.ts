/**
 * @fileoverview Componente principal da aplicação
 * @author AI Assistant
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Componente raiz da aplicação
 * @class App
 * @description Componente principal que serve como ponto de entrada da aplicação
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /**
   * Título da aplicação
   * @type {string}
   * @protected
   */
  protected title = 'Gerenciador de Itens - TagMe Desafio';
}
