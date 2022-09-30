import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { Sign } from '../../model/sign';
import { SingService } from '../../service/sign.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  displayedColumns: string[] = ['id', 'patient', 'signDate', 'temperature', 'actions'];
  dataSource: MatTableDataSource<Sign>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private singService: SingService
  ) { }

  ngOnInit(): void {
    this.singService.signChange.subscribe(data => {
      this.createTable(data);
    });

    this.singService.getMessageChange().subscribe(data => {
      this.snackBar.open(data, 'INFO', { duration: 2000, verticalPosition: "top", horizontalPosition: "right" });
    });

    this.singService.listPageable(0, 3).subscribe(data => {
      this.createTable(data);
    });

  }

  applyFilter(e: any) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }
  delete(idSign: number) {
    this.singService.delete(idSign).pipe(switchMap(() => {
      return this.singService.listPageable(0, 3);
    }))
      .subscribe(data => {
        this.singService.signChange.next(data);
        this.singService.setMessageChange('DELETED!');
      })
      ;
  }

  createTable(signs: any) {
    this.dataSource = new MatTableDataSource(signs.content);
    this.totalElements = signs.totalElements;
    this.dataSource.filterPredicate = (data, filter) => {
      return (data.patient.lastName).toLowerCase().includes(filter) || (data.patient.firstName).toLowerCase().includes(filter);
    }
  }

  showMore(e: any) {
    this.singService.listPageable(e.pageIndex, e.pageSize).subscribe(data => this.createTable(data));
  }

  checkChildren(): boolean {
    return this.route.children.length != 0;
  }
}
