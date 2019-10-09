import { Injectable, ViewContainerRef, ElementRef, Inject } from '@angular/core';

declare var Confetti: any;
declare var confettis;
declare var p5;

@Injectable()
export class confettiAnimationService {

	public view: ElementRef;
	public parentView: HTMLElement;


	constructor() {
	}

	setView(view: ElementRef) {
		this.view = view;
		this.parentView = this.view.nativeElement as HTMLElement;
	}

	startAnimation(){

		let elm = this.parentView;
		let	confetti = new Confetti({
			elm : elm,
			duration: 6000
		});

		confetti.start();

	}

}

