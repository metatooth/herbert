import fetch from "node-fetch";
import md5 from "md5";

export class Wyze {
  keyid: string;
  apikey: string;
  access_token: string;
  refresh_token: string;
  user_id: string;
  
  constructor(options: {}) {
    this.keyid = options["keyid"];
    this.apikey = options["apikey"];
  }

  async login(email: string, password: string) {
    const body = {
      email: email,
      password: md5(md5(md5(password)))
    };

    const options = {
      method: "POST",
      headers: {
        "Host": "auth-prod.api.wyze.com",
        "Keyid": this.keyid,
        "Apikey": this.apikey,
        "Content-Type": "application/json",
        "Content-Length": `${JSON.stringify(body).length}`
      },
      body: JSON.stringify(body)
    };
    
    const response = await fetch("https://auth-prod.api.wyze.com/api/user/login", options);
    const data = await response.json();

    this.access_token = data["access_token"];
    this.refresh_token = data["refresh_token"];
    this.user_id = data["user_id"];

    return;
  }

  async update_refresh_token() {
    const body = {
      "app_ver": "wyze_developer_api",
      "app_version": "wyze_developer_api",
      "phone_id": "wyze_developer_api",
      "refresh_token": this.refresh_token,
      "sc": "wyze_developer_api",
      "sv": "wyze_developer_api",
      "ts": `${Math.floor(+new Date() / 1000)}`
    };
    
    const options = {
      method: "POST",
      headers: {
        "Host": "api.wyzecam.com",
        "Content-Type": "application/json",
        "Content-Length": `${JSON.stringify(body).length}`
      },
      body: JSON.stringify(body)
    };
    
    const response = await fetch(
      "https://api.wyzecam.com/app/user/refresh_token", options
    );
    const data = await response.json();
    
    this.access_token = data["access_token"];
    this.refresh_token = data["refresh_token"];
  }

  async get_object_list() {
    const body = {
      "access_token": this.access_token,
      "ts": `${Math.floor(+new Date() / 1000)}`
    };

    const options = {
      method: "POST",
      headers: {
        "Host": "api.wyzecam.com",
        "Content-Type": "application/json",
        "Content-Length": `${JSON.stringify(body).length}`
      },
      body: body
    };
    
    const response = await fetch(
      "https://api.wyzecam.com/app/v2/home_page/get_object_list", options
    );
    const data = await response.json();
    
    return data;
  }
}
 
