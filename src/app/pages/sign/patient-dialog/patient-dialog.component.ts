import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PatientService } from '../../../service/patient.service';
import { Patient } from '../../../model/patient';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css']
})
export class PatientDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PatientDialogComponent>,
    private patientService: PatientService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idPatient': new FormControl(0),
      'firstName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'lastName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'dni': new FormControl('', [Validators.required, Validators.maxLength(8)]),
      'address': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'phone': new FormControl('', [Validators.required, Validators.minLength(9)]),
      'email': new FormControl('', [Validators.required, Validators.email])
    });

  }

  operate() {
   
    if (this.form.invalid) { return; }

    let patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    this.patientService.save(patient).pipe(switchMap(() => {
      return this.patientService.findAll();
    }))
      .subscribe(data => {
        this.patientService.patientChange.next(data);
        this.snackBar.open('CREATED!', 'INFO', { duration: 2000 });
      });
    this.dialogRef.close(1);
  }

  get f() {
    return this.form.controls;
  }

  close(option?: number) {
    this.dialogRef.close(option);
  }

}
