import { AfterViewInit, OnDestroy, Component, OnInit, ViewChild, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';
import { AuthService } from 'src/app/core/auth.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit{
	public configuration;
	public documentId!: string;
	public ready = new EventEmitter<CKEditor5.Editor>();
	public current: User;

	@ViewChild( 'sidebar', { static: true } ) private sidebarContainer?: ElementRef<HTMLDivElement>;
	@ViewChild( 'presenceList', { static: true } ) private presenceListContainer?: ElementRef<HTMLDivElement>;

	private sidebar = document.createElement( 'div' );
	private presenceList = document.createElement( 'div' );
	public tokenUrl: string = 'https://43485.cke-cs.com/token/dev/PpfX6fh9ALGk4bxqP0dJ0UTtv6UAg8jeqQvpHYyRK9tpTXGrMJTTLePSRCon';
	
	public get editorConfig() {
		return {
			cloudServices: {
				tokenUrl: this.tokenUrl,
				uploadUrl: 'https://43485.cke-cs.com/easyimage/upload/',
				webSocketUrl: '43485.cke-cs.com/ws',
				documentId: this.route.snapshot.paramMap.get('id')
			},
			sidebar: {
				container: this.sidebar,
			},
			presenceList: {
				container: this.presenceList,
			}
		};
	}

	post: Post;
	editing: boolean = false;
	public Editor = ClassicEditor;
	public editor?: CKEditor5.Editor;
	// public data;
	public data1 = this.getInitialData();
	private boundRefreshDisplayMode = this.refreshDisplayMode.bind( this );
	private boundCheckPendingActions = this.checkPendingActions.bind( this );

	

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    public auth: AuthService,
	private router: Router,
	
  ) { }

  
  ngOnInit() {
	// console.log(this.post);
	this.getPost();
	console.log(this.post);
	// console.log(this);
	if ( !this.sidebarContainer || !this.presenceListContainer ) {
		throw new Error( 'Div containers for sidebar or presence list were not found' );
	}

	this.sidebarContainer.nativeElement.appendChild( this.sidebar );
	this.presenceListContainer.nativeElement.appendChild( this.presenceList );
	this.current = {
		id: this.auth.currentUserId,
		name: this.auth.authState.displayName,
		avatar: this.auth.authState.photoURL
	}
	// console.log(this.post);
	this.selectUser(this.current);

  }
  public selectUser( user: User ) {
	// this.selectedUser = user.id;
	// this.isWarning = false;
	// console.log(user.id);
	const keys = Object.keys( user ) as ( keyof User )[];
	// console.log(keys);

	this.tokenUrl = `${ getRawTokenUrl( this.tokenUrl ) }?` + keys
		.filter( key => user[ key ] )
		.map( key => {
			// if ( key === 'role' ) {
			// 	return `${ key }=${ user[ key ] }`;
			// }

			return `user.${ key }=${ user[ key ] }`;
		} )
		.join( '&' );
	// console.log(this.config.tokenUrl);
	}

	public ngOnDestroy() {
		window.removeEventListener( 'resize', this.boundRefreshDisplayMode );
		window.removeEventListener( 'beforeunload', this.boundCheckPendingActions );
	}
  
	private onReady( editor: CKEditor5.Editor ) {
		this.editor = editor;
		this.ready.emit( editor );

		// Prevent closing the tab when any action is pending.
		window.addEventListener( 'beforeunload', this.boundCheckPendingActions );

		// Switch between inline and sidebar annotations according to the window size.
		window.addEventListener( 'resize', this.boundRefreshDisplayMode );
		this.refreshDisplayMode();
	}

	private checkPendingActions( domEvt ) {
		if ( this.editor.plugins.get( 'PendingActions' ).hasAny ) {
			domEvt.preventDefault();
			domEvt.returnValue = true;
		}
	}

	private refreshDisplayMode() {
		const annotations = this.editor.plugins.get( 'Annotations' );
		const sidebarElement = this.sidebarContainer.nativeElement;

		if ( window.innerWidth < 1070 ) {
			sidebarElement.classList.remove( 'narrow' );
			sidebarElement.classList.add( 'hidden' );
			annotations.switchTo( 'inline' );
		}
		else if ( window.innerWidth < 1300 ) {
			sidebarElement.classList.remove( 'hidden' );
			sidebarElement.classList.add( 'narrow' );
			annotations.switchTo( 'narrowSidebar' );
		}
		else {
			sidebarElement.classList.remove( 'hidden', 'narrow' );
			annotations.switchTo( 'wideSidebar' );
		}
	}

  getPost(){
	const id = this.route.snapshot.paramMap.get('id')
	// console.log(id);
	return this.postService.getPostData(id).subscribe(data => this.post = data);
	
  }

  // updatePost(){
  //   const formData = {
  //     title: this.post.title,
  //     content: this.post.content
  //   }
  //   const id = this.route.snapshot.paramMap.get('id');
  //   this.postService.update(id, formData);
  //   this.editing = false;
  // }

  // delete(){
  //   const id = this.route.snapshot.paramMap.get('id');
  //   this.postService.delete(id);
  //   this.router.navigate(["/blog"]);
  // }
  private getInitialData() {
		return `
	<h2>Bilingual Personality Disorder</h2>

	<figure class="image image-style-side">
		<img src="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg">
		<figcaption>
			One language, one person.
		</figcaption>
	</figure>

	<p>
		This may be the first time you hear about this made-up disorder but it actually isn’t so far from the truth. Even the studies
		that were conducted almost half a century show that <strong>the language you speak has more effects on you then you realise</strong>.
	</p>
	<p>
		One of the very first experiments conducted on this topic dates back to 1964.
		<a href="https://www.researchgate.net/publication/9440038_Language_and_TAT_content_in_bilinguals">In the experiment</a>
		designed by linguist Ervin-Tripp who is an expert in psycholinguistic and sociolinguistic studies, adults who are bilingual
		in English in French were showed series of pictures and were asked to create 3-minute stories. In the end participants emphasized
		drastically different dynamics for stories in English and French.
	</p>
	<p>
		Another ground-breaking experiment which included bilingual Japanese women married to American men in San Francisco were asked
		to complete sentences. The goal of the experiment was to investigate whether or not human feelings and thoughts are expressed
		differently in <strong>different language mindsets</strong>.
	</p>
	<p>Here is a sample from the the experiment:</p>

	<table>
		<thead>
			<tr>
				<th></th>
				<th>English</th>
				<th>Japanese</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Real friends should</td>
				<td>Be very frank</td>
				<td>Help each other</td>
			</tr>
			<tr>
				<td>I will probably become</td>
				<td>A teacher</td>
				<td>A housewife</td>
			</tr>
			<tr>
				<td>When there is a conflict with family</td>
				<td>I do what I want</td>
				<td>It's a time of great unhappiness</td>
			</tr>
		</tbody>
	</table>

	<p>
		More recent <a href="https://books.google.pl/books?id=1LMhWGHGkRUC">studies</a> show, the language a person speaks affects
		their cognition, behaviour, emotions and hence <strong>their personality</strong>. This shouldn’t come as a surprise
		<a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since wealready know</a> that different regions
		of the brain become more active depending on the person’s activity at hand. Since structure, information and especially
		<strong>the culture</strong> of languages varies substantially and the language a person speaks is an essential element of daily life.
	</p>
`;
	}

}
interface User {
	id: string;
	name?: string;
	avatar?: string;
	// role?: string;
}


function getRawTokenUrl( url: string ) {
	if ( isCloudServicesTokenEndpoint( url ) ) {
		return url.split( '?' )[ 0 ];
	}

	return url;
}

function isCloudServicesTokenEndpoint( tokenUrl: string ) {
	return /cke-cs[\w-]*\.com\/token\/dev/.test( tokenUrl );
}