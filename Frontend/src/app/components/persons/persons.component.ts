import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { PersonService } from 'src/app/services/person.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Person } from 'src/app/models/person.model';
import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})

export class PersonsComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  public persons;
  public idPerson: String;
  public personModel: Person;

  public dataSource;

  constructor(private personService: PersonService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.personModel = new Person('', '', '', '', '');
  }

  ngOnInit() {
    this.getPersons();
  }

  limpiarModelo() {
    this.personModel._id = null;
    this.personModel.birthDate = null;
    this.personModel.dpi = null;
    this.personModel.lastName = null;
    this.personModel.name = null;
  }

  applyFilter(filter: String) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  //Metodos del api
  getPersons() {
    this.personService.getPersons().subscribe(
      response => {

        if (response.noPersons) {
          let snackBarRef = this.snackBar.open('No se han encontrado personas en el sistema', null, { duration: 3000 });
        }

        if (response.persons) {
          this.persons = response.persons;

          this.dataSource = new MatTableDataSource(this.persons);
        }

      },
      error => {

        if (error.error) {
          let snackBarRef = this.snackBar.open('Ocurrio un error al obtener los datos', null, { duration: 3000 });
        } else {
          let snackBarRef = this.snackBar.open('Error al contactar con el servidor', null, { duration: 3000 });
        }

      }
    )
  }

  deletePerson(id) {
    this.personService.deletePerson(id).subscribe(
      response => {

        if (response.noPersona) {
          let snackBarRef = this.snackBar.open('No se ha encontrado la persona a eliminar', null, { duration: 3000 });
        }

        if (response.eliminado) {
          let snackBarRef = this.snackBar.open('El registro fue eliminado correctamente', null, { duration: 3000 });
          this.getPersons();
        }
      },

      error => {
        if (error.error) {
          let snackBarRef = this.snackBar.open('Ha ocurrido un error al eliminar el registro', null, { duration: 3000 });
        } else {
          let snackBarRef = this.snackBar.open('Error al contactar con el servidor', null, { duration: 3000 });
        }

      }
    )
  }

  getPerson(id) {
    this.personService.getPerson(id).subscribe(
      async response => {

        if (response.person) {
          this.personModel.birthDate = await response.person.birthDate;
          this.personModel.dpi = await response.person.dpi;
          this.personModel.lastName = await response.person.lastName;
          this.personModel.name = await response.person.name;
          this.personModel._id = await response.person._id
        }

        if (response.noPerson) {
          let snackBarRef = this.snackBar.open('No se ha encontrado la persona solicitada', null, { duration: 3000 });

        }
      },
      error => {

        if (error.error) {
          let snackBarRef = this.snackBar.open('Error al obtener el registro', null, { duration: 3000 });
        } else {
          let snackBarRef = this.snackBar.open('Error al contactar con el servidor', null, { duration: 3000 });
        }

      }
    )
  }

  async openModalEdit(id) {
    await this.getPerson(id);

    const dialogRef = this.dialog.open(EditPersonDialogComponent, {
      width: '40%',
      data: this.personModel
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPersons();
      this.limpiarModelo()
    });
  }

  openModalNew() {
    console.log('funciona');
    const dialogRef = this.dialog.open(NewPersonDialogComponent, {
      width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPersons();
      this.limpiarModelo()
    });

  }


  //Para la tabla
  displayedColumns: string[] = ['dpi', 'name', 'lastName', 'birthDate', 'edit', 'delete'];

  //Filtro para la tabla
}


@Component({
  selector: 'edit-dialog',
  templateUrl: './dialogs/edit-dialog.html',
  styleUrls: ['./persons.component.scss']
})
export class EditPersonDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private personService: PersonService, private snackBar: MatSnackBar) { }

  saveUpdatePerson() {
    var id = this.data._id
    this.data._id = undefined;
    this.personService.updatePerson(id, this.data).subscribe(
      response => {

        if (response.actualizadoCorrectamente) {
          let snackBarRef = this.snackBar.open('Registro almacenado correctamente', null, { duration: 3000 });
        }

        if (response.noPersona) {
          let snackBarRef = this.snackBar.open('No se ha encontrado la persona a actualizar', null, { duration: 3000 });
        }
      },

      error => {
        if (error.error) {
          let snackBarRef = this.snackBar.open('Ocurrio un error al actualizar la persona', null, { duration: 3000 });
        } else {
          let snackBarRef = this.snackBar.open('Error al contactar con el servidor', null, { duration: 3000 });
        }
      }
    )
  }

}

@Component({
  selector: 'edit-dialog',
  templateUrl: './dialogs/new-dialog.html',
  styleUrls: ['./persons.component.scss']
})
export class NewPersonDialogComponent {

  public personModel: Person;

  constructor(private personService: PersonService, private snackBar: MatSnackBar) {
    this.personModel = new Person(null, null, null, null, null);
  }

  saveNewPerson() {
    this.personService.createPerson(this.personModel).subscribe(
      response => {
        console.log(response);

        if (response.almacenadoCorrectamente) {
          let snackBarRef = this.snackBar.open('El registro fue añadido correctamente', null, { duration: 3000 });
        }

        if (response.noCampos) {
          let snackBarRef = this.snackBar.open('Debes llenar todos los campos', null, { duration: 3000 });
        }

        if (response.repetido) {
          let snackBarRef = this.snackBar.open('El DPI ingresado ya existe en la base de datos', null, { duration: 3000 });

        }

      },

      error => {

        if (error.error) {
          let snackBarRef = this.snackBar.open('Error al almacenar el registro', null, { duration: 3000 });

        } else {
          let snackBarRef = this.snackBar.open('Error al contactar con el servidor', null, { duration: 3000 });
        }


      }
    )
  }


}



export interface personData {
  _id: String;
  dpi: String
  name: String;
  lastName: String;
  birthDay: String;
}