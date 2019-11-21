import { Component, OnInit, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { PostService } from '../post.service';
import { Observable } from 'rxjs';
import { AngularFireStorage} from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.css']
})
export class PostDashboardComponent implements OnInit {
  title: string;
  image: string = null;
  content: string;

  buttonText: string = "Crear Nota"

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  
  constructor(private auth: AuthService, private postService: PostService, private storage: AngularFireStorage, private router: Router) {
    
   }

  ngOnInit() {
  }
  
  createPost(){
    const data = {
      author: this.auth.authState.displayName || this.auth.authState.email,
      authorId: this.auth.currentUserId,
      content: this.content,
      image: this.image,
      published: new Date(),
      title: this.title
    };
    this.postService.create(data);
    this.router.navigate(["/blog"]);
    // this.title= "";
    // this.content = "";
    // this.buttonText = 'Se creó la Nota'
    // setTimeout(() => (this.buttonText = "Crear Nota"), 3000);
    // this.image=""; 
    
  }

  uploadImage(event){
    // console.log(event);
    const file = event.target.files[0]
    const path = `posts/${file.name}`;
    if (file.type.split('/')[0] !== 'image'){
      return alert("Solo Imagenes");
    } else {
      const task = this.storage.upload(path, file);
      this.uploadPercent = task.percentageChanges();
      const ref = this.storage.ref(path);
      // console.log('Image uploaded!');
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = ref.getDownloadURL()
          this.downloadURL.subscribe(url => (this.image = url));
        })
      )
      .subscribe();
    }
    // console.log(event.target.files);
  }

}
