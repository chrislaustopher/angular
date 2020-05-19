import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

//testing
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient) { }

  getLeaders(): Promise<Leader[]> {
  	return Promise.resolve(LEADERS);
  }

  getLeader(id: string): Promise<Leader> {
  	return Promise.resolve(LEADERS.filter((leader) => (leader.id==id))[0]);
  }

  getFeaturedLeader(): Promise<Leader> {
  	return Promise.resolve(LEADERS.filter((leader) => leader.featured)[0]);
  }
}
