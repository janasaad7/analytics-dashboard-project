import {Injectable, signal} from '@angular/core';
import usersData from '../../../../public/assets/data/users-data.json';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users = signal(usersData.users);
}
