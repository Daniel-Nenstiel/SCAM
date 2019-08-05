import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap';

import {
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatIconModule,
    MatButtonModule
} from '@angular/material';

import {
    ReactiveFormsModule
} from '@angular/forms';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        AlertModule.forRoot()
    ],
    exports: [
        MatButtonModule,
        AlertModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        ReactiveFormsModule
    ]
})

export class CustomMaterialModule {
}