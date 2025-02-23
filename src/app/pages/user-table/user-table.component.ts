import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { UserModel } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { GenericResponse } from '../../models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';


@Component({
  selector: 'app-user-table',
  imports: [TableModule,
    TagModule, 
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    InputNumberModule],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent implements OnInit {
  isOpenDialogModal: boolean = false;
  submitted: boolean = false;
  isFormNotComplete: boolean = true;
  user!: UserModel;
  users!: UserModel[];
  modalType: string = 'create';
  constructor(
    private usersService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.loadUsers()
  }

  private loadUsers(){
    this.usersService.getUsers().subscribe({
      next: (users: UserModel[]) => {
        console.log(users);
        this.users = users
      },
      error: (error: any) => {
        console.log(error);
        this.users = [];
      }
    });
  }

  public openDialog(){
    this.isOpenDialogModal = true
    this.submitted = false;
    this.user = {} as UserModel;
    this.modalType = 'create'
  }

  public saveUser(user: UserModel){
    this.submitted = true;
    if(this.modalType === 'create'){
      this.createUser(user);
    }
    if(this.modalType === 'edit'){
      this.editUser(user)
    }
    this.hideDialog();
  }

  openEditUser(user: UserModel){
    this.isOpenDialogModal = true;
    this.modalType = 'edit';
    this.user = {...user};
  }

  deleteUser(user:UserModel){
    this.confirmationService.confirm({
      message: `¿Seguro que deseas borrar el usuario: ${user.nombres}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.usersService.deleteUser(user.idusuario).subscribe({
          next:(resp: GenericResponse) =>{
            if(resp.statusCode === 200){
              const newUsers = this.users.filter((u: UserModel ) => u.idusuario !== user.idusuario);
              this.users = newUsers;
              this.messageService.add({
                severity: 'success',
                summary: '¡Exitoso!',
                detail: 'El usuario ha sido eliminado',
                life: 3000
              });
            }
          },
          error: (error: any) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: '¡Error!',
              detail: 'El usuario no pudo ser eliminado',
              life: 3000
            });
          }
        })
      }
    })
  }

  private createUser(user: UserModel){
    this.usersService.createUser(user).subscribe({
      next: (resp: GenericResponse) => {
        if(resp.statusCode === 201){
          this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: '¡Exitoso!',
            detail: 'El usuario ha sido agregado',
            life: 3000
          });
        }
      },
      error: (error: any) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: '¡Error!',
          detail: 'El usuario no se pudo agregar',
          life: 3000
        });
      }
    });
  }

  private editUser(user: UserModel){
    this.usersService.editUser(user).subscribe({
      next: (resp: GenericResponse) => {
        if(resp.statusCode === 200){
          this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: '¡Exitoso!',
            detail: 'El usuario ha sido editado',
            life: 3000
          });
        }
      },
      error: (error: any) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: '¡Error!',
          detail: 'El usuario no se pudo editar',
          life: 3000
        });
      }
    });
  }

  hideDialog(){
    this.isOpenDialogModal = false;
    this.submitted = false;
  }

  filterGlobal(dt: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (dt && inputElement) {
        dt.filterGlobal(inputElement.value, 'contains');
    }
  }
}
