import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';

import { DefaultAvatarListPage } from '../default-avatar-list/default-avatar-list';

import { NewHomeSignupInformationComponent } from '../../components/new-home-signup-information/new-home-signup-information';
import { NewHomeVerificationComponent } from '../../components/new-home-verification/new-home-verification';
import { dashboardPage } from '../../pages/dashboard/dashboard';
import { ImageCacher } from '../../experiment/imageCacher';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertProvider } from '../../providers/alert/alert';

@Component({
	selector: 'page-new-home-signup',
	templateUrl: 'new-home-signup.html',
})
@ImageCacher([
	'DefaultAvatarListPage',
	'SplashPage',
	'GameHomePage'
])
export class NewHomeSignupPage implements AfterViewInit {


	@ViewChild('signupSlider') slider : Slides;
	@ViewChild('paginationContainer') paginationSlider : ElementRef;
	@ViewChild(NewHomeSignupInformationComponent) signupInformationComponent : NewHomeSignupInformationComponent;
	@ViewChild(NewHomeVerificationComponent) verificationComponent : NewHomeVerificationComponent;

	private buttonText  : string = 'Next';
	private currentSlide = 1;
	private buttonClickEventHandler : Function = ()=>{};
	private disableButton = true;
	private mobileNumber : string = '';
	private password: string = '';
	private code: string = '';

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public authProvider: AuthProvider,
		private alertProvider: AlertProvider,
	){
		this.buttonClickEventHandler = this.submitBasicInformation;	
	}

	ngAfterViewInit(){
		this.slider.onlyExternal = true;
		this.slider.ionSlideWillChange.subscribe((e)=>{

			if(this.slider.getActiveIndex() == 2 || this.slider.getActiveIndex() == 3){
				this.currentSlide = 4;	
				return;	
			}

			this.currentSlide = this.slider.getActiveIndex() + 1;
		});
	}

	goBack(){
		this.navCtrl.pop({animation:'backward'});
	}

	submitBasicInformation(){
		this.buttonText = 'Skip';
		this.buttonClickEventHandler = this.skipFacebookSignup;
		this.slider.slideTo(1);
	}

	skipFacebookSignup(){
		this.buttonText = 'Next';
		this.buttonClickEventHandler = this.goToAvatarSelectionSlide;
		if(this.signupInformationComponent){
			this.makeButtonInactive();
			this.signupInformationComponent.skipFacebookLogin();
		}
	}

	goToAvatarSelectionSlide(){
		this.authProvider.registerWithPhone(this.mobileNumber, this.password).subscribe((res: any) => {
			if (res.json().success) {
				this.currentSlide = 3;
				this.makeButtonInactive();
				this.buttonText = 'Next';
				this.buttonClickEventHandler = this.goToVerificationScreen;
				if(this.signupInformationComponent){
					this.signupInformationComponent.goToAvatarSelection();
				}
			} else {
				// this.alertProvider.create('Failed').present();
			}
		});
	}

	signUpWithFacebook(){
		this.buttonText = 'Next';
		this.openDefaultAvatarListPage();
	}

	goToVerificationScreen(){
		this.makeButtonInactive();
		this.buttonText = 'Submit';
		this.slider.slideTo(2);
		this.buttonClickEventHandler = this.verificationCompleted;
	}

	goToReferralSlide(){
		this.buttonText = 'Submit';
		this.slider.slideTo(3);
		this.buttonClickEventHandler = this.openGamePage;
	}

	private verificationCompleted(){
		this.authProvider.confirmPhoneCode(this.mobileNumber, this.code).subscribe(res => {
			if (res.json().success) {
				this.verificationComponent.setCompletedState();
			} else {
				this.alertProvider.create('Failed').present();
			}
		});
	}

	private openDefaultAvatarListPage(){
		this.makeButtonInactive();
		this.navCtrl.push(DefaultAvatarListPage,{
			setAvatarImage : this.setAvatarImage.bind(this)
		}).then(()=>{
			this.goToAvatarSelectionSlide();
		});
	}

	setAvatarImage(imageUrl){
		this.signupInformationComponent.setDefaultAvatarImage(imageUrl);
	}

	private makeButtonInactive(){
		this.disableButton = true;
	}

	private makeButtonActive(){
		this.disableButton = false;
	}

	private onMobileChange($event){
		this.mobileNumber = $event;
	}

	private onPasswordChange($event){
		this.password = $event;
	}

	private openGamePage(){
		this.navCtrl.parent.setRoot(dashboardPage);
	}

	private verificationCodeChanged($event) {
		this.code = $event;
		if ($event) {
			this.makeButtonActive();
		} else {
			this.makeButtonInactive();
		}
	}

}
