
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.css']
})
export class DialogboxComponent {

constructor (
   public dialogRef: MatDialogRef<DialogboxComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
) {}

onNoClick() : void {
  this.dialogRef.close(false);
}

onYesClick() : void {
  this.dialogRef.close(true)
}
 


}
