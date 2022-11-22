import { Component } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-route',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  validateForm!: UntypedFormGroup;
  checkoutForm = this.formBuilder.group({
    email: '',
    password: ''
  });
  constructor(
    private formBuilder: FormBuilder
  ){
    document.body.style.backgroundColor="#121212";
  }

  onSubmit(){

  }
}
