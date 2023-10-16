import fetch from "node-fetch";
import md5 from "md5";

class LoginRequest {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class Wyze {
  keyid: string;
  apikey: string;
  access_token: string;
  refresh_token: string;
  user_id: string;
  sc: string = "web_developer_api";
  sv: string = "web_developer_api";
  
  constructor(options: {}) {
    this.keyid = options["keyid"];
    this.apikey = options["apikey"];
  }

  async login(email: string, password: string) {
    const body = new LoginRequest(email, md5(md5(md5(password))));

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
    
    return data;
  }

  async get_refresh_token() {
    const body = {
      "app_ver": "wyze_developer_api",
      "app_version": "wyze_developer_api",
      "phone_id": "wyze_developer_api",
      "refresh_token": "",
      "sc": this.sc,
      "sv": this.sv,
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
      "https://api.wyzecam.com/api/user/refresh_token", options
    );

    console.log(JSON.stringify(response));
    
    return response;
  }

  async get_object_list() {
    const options = {
      method: "POST",
      body: {
        "access_token": this.access_token,
        "phone_id": "web_developer_api",
        "app_ver": "web_developer_api",
        sc: this.sc,
        sv: this.sv,
        ts: Math.floor(+new Date() / 1000)
      }
    };
    
    const response = await fetch(
      "https://api.wyzecam.com:8443/app/v2/home_page/get_object_list", options
    );

    console.log(response);
    
    return response;
  }
}
 
