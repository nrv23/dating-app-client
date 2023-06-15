import { Component, Input, OnInit } from '@angular/core';
import { IMember } from 'src/app/interfaces/IMember';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member: IMember | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
