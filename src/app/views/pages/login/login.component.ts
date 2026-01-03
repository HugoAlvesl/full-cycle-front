import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    FormsModule,
    RouterLink
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      username: this.username,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Usuário ou senha inválidos';
        console.error('Erro no login:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
