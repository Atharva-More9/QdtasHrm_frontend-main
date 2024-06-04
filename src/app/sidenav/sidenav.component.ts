import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Output() toggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  isExpanded: boolean = true;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.toggle.emit(this.isExpanded); // Emitting boolean value
  }
}
