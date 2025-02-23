import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { env } from '../env/envs';

interface GetUsersResponse {
  getUsers: UserModel[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apollo: Apollo,
    private http: HttpClient) { }


    getUsers():Observable<UserModel[]>{
      return this.apollo.watchQuery<GetUsersResponse>({
        query: gql`
          query {
            getUsers {
              idusuario
              nombres
              apellidopaterno
              apellidomaterno
              direccion
              telefono
            }
          }`,
          fetchPolicy:'network-only'
      }).valueChanges.pipe(
        map(({data}) => data.getUsers)
      );
    }

    refetchUsers(){

    }

    createUser(user: UserModel){
      return this.http.post<any>(`${env.apiUrlDev}/users`, user);
    }

    editUser(user: UserModel){
      return this.http.put<any>(`${env.apiUrlDev}/users`, user);
    }

    deleteUser(userId: number){
      return this.http.delete<any>(`${env.apiUrlDev}/users/${userId}`);
    }
}
