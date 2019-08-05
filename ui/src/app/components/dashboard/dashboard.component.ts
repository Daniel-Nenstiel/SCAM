import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { RequestService } from '../../services/request/request.service'
import { WorkerService } from 'src/app/services/worker/worker.service';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  alertType: string;
  alertMessage: string;

  conTest;

  columns
  rows

  getButtonData;
  getAllButtonData;
  postButtonData

  constructor(
    private request: RequestService,
    private worker: WorkerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initTable();
    this.initTest();
  }

  //Tests Api connection every 5 seconds and updates the alert
  initTest() {
    this.testConnection();
    this.conTest = setInterval( () => {this.testConnection()}, 5000);
  }

  testConnection() {
    this.alertType = 'warning';
    this.alertMessage = 'Attempting connection';
    this.request.getTest().subscribe({
      next: (response)=> {
        // console.log(response);
        this.alertType = 'success';
        this.alertMessage = 'Connection made';
      },
      error: (err)=> {
        console.log(err);
        this.alertType = 'danger';
        this.alertMessage = 'Connection denied'
      }
    })
  }

  initTable() {
    this.columns = this.initColumns();
    this.rows = this.initRows();
  }

  initColumns() {
    return [
      {name: 'ID', prop: '_id.$oid'},
      {name: 'Username', prop: 'username'},
      {name: 'Password', prop: 'password'},
      {name: 'Date Created', prop: 'date-created'},
      {name: 'Arbitrary Num', prop: 'arbitrary-num'},
      {name: 'Status', prop: 'status'},

    ]
  }

  initRows() {
    return [];
  }

  postButton(){
    this.request.readSomething('g/users/status/1').subscribe( post => {
      post = this.worker.convertFromDatabase(post[0][post[0].length-1])
      post.arbitraryNum ++
      delete post._id
      
      this.request.createSomething({'g':'users'}, this.worker.convertToDatabase(post)).subscribe( response => {
        console.log(response);
      })
    });
  }

  getButton() {
    this.request.readUsersByUsername('dnenstiel1').subscribe( data => {
      console.log(data);
    })
  }

  getAllButton() {
    this.request.readUsers().subscribe(users => {
      console.log(users);
      users[0].forEach(user => {
        if(user['date-created'].hasOwnProperty('$date')){
          user['date-created'] = new Date(user['date-created']['$date']);
        }        
      });
      this.rows = users[0];
    })
  }

  onClickCreate(){
    this.dialog.open(CreateUserDialogComponent )
    .afterClosed().subscribe({
      next: () => {
        console.log('closed the dialog');
      }
    })
  }
}
