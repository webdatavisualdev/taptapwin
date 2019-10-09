import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, NavParams, Slides, ViewController, ModalController } from 'ionic-angular';

import { NewHomeLoginForgotPasswordComponent } from '../../components/new-home-login-forgot-password/new-home-login-forgot-password';
import { NewHomeSignupPage } from '../new-home-signup/new-home-signup';
import { SplashPage } from '../splash/splash';
import { dashboardPage } from '../dashboard/dashboard';

import { ImageCacher } from '../../experiment/imageCacher';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertProvider } from '../../providers/alert/alert';

@Component({
	selector: 'page-new-home-login',
	templateUrl: 'new-home-login.html',
})
@ImageCacher([
	'NewHomeSignupPage',
	'SplashPage'
])
export class NewHomeLoginPage implements AfterViewInit {

	@ViewChild('mainSlider') mainSlider : Slides;
	@ViewChild(NewHomeLoginForgotPasswordComponent) forgotPasswordComponent : NewHomeLoginForgotPasswordComponent;

	phone = '';
	password = '';

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private view : ViewController,
		private modal : ModalController,
		private authProvider: AuthProvider,
		private alertProvider: AlertProvider,
	) {
	}

	ionViewDidLoad() {

	}

	goBack(){
		this.navCtrl.pop({animation:'backword'});
	}

	goToScreenTwo(){
		this.mainSlider.slideTo(1);
	}

	goToScreenOne(){
		this.mainSlider.slideTo(0);
		setTimeout(()=>{
			this.forgotPasswordComponent.reset();
		},500);
	}

	ngAfterViewInit(){
		this.mainSlider.onlyExternal = true;
	}

	goToSignupPage(){
		this.navCtrl.push(NewHomeSignupPage).then(()=>{
			this.view.dismiss();
		});
	}

	goToGameDashboard(){
		this.authProvider.loginWithPhone(this.phone, this.password).subscribe(res => {
			if (res.json().success) {
				let modal = this.modal.create(SplashPage,{
					prepareForExit : (()=>{
						return  (this.navCtrl.parent as NavController).setRoot(dashboardPage,{});
					}).bind(this)
				},{
					cssClass : 'splash-modal'
				});
				modal.present({
					animation : 'wp-transition'
				});
			} else {
				this.alertProvider.create(res.json().message).present();
			}
		});
	}

}
