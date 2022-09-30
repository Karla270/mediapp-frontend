import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, Observable } from 'rxjs';
import { SingService } from '../../../service/sign.service';
import { Sign } from '../../../model/sign';
import { PatientService } from '../../../service/patient.service';
import { Patient } from '../../../model/patient';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { PatientDialogComponent } from '../patient-dialog/patient-dialog.component';

@Component({
  selector: 'app-sign-edit',
  templateUrl: './sign-edit.component.html',
  styleUrls: ['./sign-edit.component.css']
})
export class SignEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;
  maxDate: Date = new Date();
  patients$: Observable<Patient[]>;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private singService: SingService,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
    this.getPatients();

    this.form = new FormGroup({
      'idSign': new FormControl(0),
      'idPatient': new FormControl('', [Validators.required]),
      'signDate': new FormControl(this.maxDate, [Validators.required]),
      'temperature': new FormControl('', [Validators.required]),
      'pulse': new FormControl('', [Validators.required]),
      'rate': new FormControl('', [Validators.required])
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })

  }

  initForm() {
    if (this.isEdit) {

      this.singService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          'idSign': new FormControl(data.idSign),
          'idPatient': new FormControl(data.patient.idPatient, [Validators.required]),
          'signDate': new FormControl(data.signDate, [Validators.required]),
          'temperature': new FormControl(data.temperature, [Validators.required]),
          'pulse': new FormControl(data.pulse, [Validators.required]),
          'rate': new FormControl(data.rate, [Validators.required]),
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }

    let sign = new Sign();
    sign.idSign = this.form.value['idSign'];
    sign.signDate = moment(this.form.value['signDate']).format('YYYY-MM-DDTHH:mm:ss');
    sign.temperature = this.form.value['temperature'];
    sign.pulse = this.form.value['pulse'];
    sign.rate = this.form.value['rate'];

    let patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];

    sign.patient = patient;

    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN
      this.singService.update(sign).subscribe(() => {
        this.singService.listPageable(0, 3).subscribe(data => {
          this.singService.signChange.next(data);
          this.singService.setMessageChange('UPDATED!')
        });
      });
    } else {
      //INSERT
      //PRACTICA IDEAL
      this.singService.save(sign).pipe(switchMap(() => {
        return this.singService.listPageable(0, 3);
      }))
        .subscribe(data => {
          this.singService.signChange.next(data);
          this.singService.setMessageChange("CREATED!")
        });
    }
    this.router.navigate(['/pages/sign']);
  }

  getPatients() {
    this.patients$ = this.patientService.findAll();
  }


  newPatient() {
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.getPatients();
      }
    });
  }
}
