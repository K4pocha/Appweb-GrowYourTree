import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage {
  transport: string = '';
  electricity: number = 0;
  renewable: boolean = false;
  meat: number = 0;
  resultMessage: string = '';

  constructor() {}

  validaNumericos(event: KeyboardEvent) {
    const charCode = event.key;
    // Verificar si el carácter ingresado es un número
    if (!isNaN(Number(charCode))) {
      return true;
    }
    return false;
  }

  calculateEmissions() {
    const transport = this.transport;
    const electricity = this.electricity;
    const renewable = this.renewable;
    const meat = this.meat;
    let emissions = 0;

    // Cálculo basado en el transporte
    switch (transport) {
      case 'auto':
        emissions += 5.6 * 52;
        break;
      case 'moto':
        emissions += 3.1 * 52;
        break;
      case 'bicicleta':
        emissions += 0; // Sin emisiones
        break;
      case 'publico':
        emissions += 1.8 * 52;
        break;
    }

    // Cálculo basado en el consumo eléctrico
    emissions += renewable ? (electricity * 0.3) : (electricity * 0.7);

    // Cálculo basado en el consumo de carne
    emissions += meat * 2.4 * 52;

    // Mostrar el resultado
    this.resultMessage = `Tus emisiones anuales estimadas de CO2 son ${emissions.toFixed(2)} kg CO2e.`;
  }
}
