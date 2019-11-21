import { NgModule } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
    declarations: [],
    imports: [
        CKEditorModule
    ],
    exports: [
        CKEditorModule
    ]
  })
  export class EditorModule { }