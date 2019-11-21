import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

import { environment } from '../environments/environment';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { PostsModule } from './posts/posts.module';
import { PostService } from './posts/post.service';
import localeEsAr from '@angular/common/locales/es-AR';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

registerLocaleData(localeEsAr, 'es-Ar');

const routes: Routes = [
  { path: '', redirectTo: '/blog', pathMatch: 'full'},
  { path: '', loadChildren: './posts/posts.module#PostsModule'}
]


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    CoreModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    PostsModule,
    FormsModule,
    CKEditorModule
  ],
  providers: [PostService, { provide: LOCALE_ID, useValue: 'es-Ar' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
