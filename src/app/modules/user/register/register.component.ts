import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsConfig } from '../../../config/forms-config'
import { UserService } from '../../../services/user.service';
import { UserModel } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import SHA512 from 'crypto-js/sha512';

declare const showMessage: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  fgValidator: FormGroup;
  firstNameMinLength = FormsConfig.FIRSTNAME_MIN_LENGTH;
  surnameMinLength = FormsConfig.SURNAME_MIN_LENGTH;
  cellphoneMinLength = FormsConfig.CELLPHONE_MIN_LENGTH;
  cellphoneMaxLength = FormsConfig.CELLPHONE_MAX_LENGTH;

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.formBuilding();
  }

  formBuilding() {
    this.fgValidator = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(this.firstNameMinLength)]],
      secondName: [''],
      surname: ['', [Validators.required, Validators.minLength(this.surnameMinLength)]],
      secondSurname: [''],
      cellphone: ['', [Validators.required, Validators.minLength(this.cellphoneMinLength), Validators.maxLength(this.cellphoneMaxLength)]],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthday: ['2020-08-10T05:03:47.800Z', [Validators.required, Validators.minLength(2)]],
      pathPhoto: ['logo.png'],
      interests: [['amistad']],
      role: [4]
    });
  }

  userRegisterFn() {
    if (this.fgValidator.invalid) {
      showMessage("Formulario invalido");
    } else {
      let model = this.getUserData();
      this.service.UserRegistering(model).subscribe(
        data => {
          showMessage("Registrado correctamente");
          this.router.navigate(['/security/login']);
        },
        error => {
          showMessage("Error al registrarse");
        }
      );
    }
  }

  getUserData(): UserModel {
    let model = new UserModel();
    model.firstName = this.fgv.firstName.value;
    model.secondName = this.fgv.secondName.value;
    model.surname = this.fgv.surname.value;
    model.secondSurname = this.fgv.secondSurname.value;
    model.cellphone = this.fgv.cellphone.value;
    model.gender = this.fgv.gender.value;
    model.email = this.fgv.email.value;
    model.password = SHA512(this.fgv.password.value).toString();
    model.birthday = this.fgv.birthday.value;
    model.pathPhoto = this.fgv.pathPhoto.value;
    model.interests = this.fgv.interests.value;
    model.role = this.fgv.role.value;
    return model;
  }

  get fgv() {
    return this.fgValidator.controls;
  }

}
