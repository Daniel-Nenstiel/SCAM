import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap';

import {
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule
} from '@angular/material';

import {
    ReactiveFormsModule
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        MatTabsModule,
        ReactiveFormsModule,
        AlertModule.forRoot()
    ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,

        MatButtonModule,
        AlertModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        MatTabsModule,
        ReactiveFormsModule
    ]
})

export class CustomMaterialModule {
}