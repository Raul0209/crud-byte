import { Injectable } from '@angular/core';
import { url } from './global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  public url;

  constructor(private http: HttpClient) {
    this.url = url;
  }

  getPersons(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.url + `persons`, { headers });
  }

  deletePerson(id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(this.url + `person/${id}`, { headers });
  }

  getPerson(id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.url + `person/${id}`, { headers });
  }

  updatePerson(id,personModel: Person): Observable<any> {
    let params = JSON.stringify(personModel);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(this.url + `person/${id}`, personModel, { headers });
  }

  createPerson(personModel:Person): Observable<any> { 
    let params = JSON.stringify(personModel);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.url + `person`, personModel, { headers });
  }



}
