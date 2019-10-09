import { Injectable } from '@angular/core';
import { serverUrl, localUrl } from '../../app/config/environment';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class AuthProvider {
  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({headers: this.headers});
  api = serverUrl;

  constructor(public http: Http) {
  }

  registerWithPhone(phone, password) {
    return this.http.post(this.api + 'registerWithPhone', {phone: phone, password: password}, this.options);
  }

  confirmPhoneCode(phone, code) {
    return this.http.post(this.api + 'confirmPhoneCode', {phone: phone, code: code}, this.options);
  }

  loginWithPhone(phone, password) {
    return this.http.post(this.api + 'loginWithPhone', {phone: phone, password: password}, this.options);
  }
}
