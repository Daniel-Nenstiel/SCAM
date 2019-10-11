import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { RequestService } from '../../services/request/request.service'
import { WorkerService } from 'src/app/services/worker/worker.service';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { RequestData } from 'src/app/models/request-data.model';
import { User } from 'src/app/models/user.model';
import { Page } from 'src/app/models/page.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  alertType: string;
  alertMessage: string;

  loginType: string;
  loginMessage: string;

  conTest;

  activeColumns;
  activeRows;

  inactiveColumns;
  inactiveRows;

  getButtonData;
  getAllButtonData;
  postButtonData;

  page: Page

  public hide = true;

  constructor(
    private request: RequestService,
    private worker: WorkerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initActiveTable();
    // this.initInactiveTable();
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
        this.alertType = 'success';
        this.alertMessage = 'Connection made';
      },
      error: (err)=> {
        this.alertType = 'danger';
        this.alertMessage = 'Connection denied'
      }
    })
  }

  initActiveTable() {
    this.page = new Page(true);
    this.activeColumns = this.initActiveColumns();
    this.activeRows = this.initActiveRows();
  }

  setPage(event) {
    console.log(event);
  }

  initInactiveTable() {
    this.inactiveColumns = this.initInactiveColumns();
    this.inactiveRows = this.initInactiveRows();
  }

  initActiveColumns() {
    return [
      {name: 'ID', prop: '_id.$oid'},
      {name: 'Username', prop: 'username'},
      {name: 'Password', prop: 'password'},
      {name: 'Date Created', prop: 'date-created'},
      {name: 'Arbitrary Num', prop: 'arbitrary-num'},
      {name: 'Status', prop: 'status'},
    ]
  }

  initInactiveColumns() {
    return [
      {name: 'ID', prop: '_id.$oid'},
      {name: 'Username', prop: 'username'},
      {name: 'Password', prop: 'password'},
      {name: 'Date Created', prop: 'date-created'},
      {name: 'Arbitrary Num', prop: 'arbitrary-num'},
      {name: 'Status', prop: 'status'},
    ]
  }

  initActiveRows() {
    this.activeRows = [];
    console.log(this.page)
    this.request.readUsers(this.page.limit, this.page.offset).subscribe(users => {
      this.page.count = users[0].length
      users[0].forEach(user => {
        if( user.hasOwnProperty('date-created') && user['date-created'].hasOwnProperty('$date') ){
          user['date-created'] = new Date(user['date-created']['$date']);
        }        
      });
      this.activeRows = users[0];
    })
  }

  initInactiveRows() {
    this.inactiveRows = [];
    let req = new RequestData();
    req.table = {'g':'users'}
    req.params = new Map([
      ['status/0', null]
    ])
    this.request.readSomething(req).subscribe(users => {
      users[0].forEach(user => {
        if(user.hasOwnProperty('date-created') && user['date-created'].hasOwnProperty('$date')){
          user['date-created'] = new Date(user['date-created']['$date']);
        }        
      });
      this.inactiveRows = users[0];
    })
  }

  updateTables() {
    this.initActiveTable();
    this.initInactiveTable();
  }

  getButton() {
    let req = new RequestData();
    req.table = {'g':'users'}
    req.params = new Map([
      ['status/0', null]
    ])
    req.query = {'offset': 0}
    this.request.readSomething(req).subscribe( something => {
      console.log(something);
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

  updateFirst() {
    let updateRow = JSON.parse(JSON.stringify(this.activeRows[0]));
    updateRow['date-created'] = (new Date(updateRow['date-created'])).valueOf();
    updateRow['arbitrary-num']++

    let req = new RequestData();
    req.table = ({'g':'users'});
    req.body = updateRow;
    req.params = new Map([[updateRow['_id']['$oid'], null]])

    this.request.updateSomething(req).subscribe({
      next: response => {
        console.log(response);
        this.initActiveTable();
      }
    })
  }

  testLogin(username, password){
    this.request.login(username, password).subscribe({
      next:  response => {
        if(response.hasOwnProperty('success')) {
          this.loginMessage = response.success
          this.loginType = 'success';
        }
        else{
          this.loginMessage = response.denied
          this.loginType = 'warning';
        }

        console.log(response);
      },
      error: err=> {
        this.loginMessage = "Something went wrong"
        this.loginType = 'danger';
      }
    });
  }
}
