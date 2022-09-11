import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthServices from "../service/AuthServices";
import axios from "axios";
import {API_URL} from "../http";
import {AuthResponse} from "../models/response/authResponse";
import UserService from "../service/UserService";

export default class Store{
    user = {} as IUser;
    users = [] as IUser[];
    isAuth = false;
    isLoading = false;
    constructor() {
        makeAutoObservable(this);
    }
    setAuth(bool:boolean){
        this.isAuth = bool;
    }
    setUser(user:IUser){
        this.user = user;
    }
    setUsers(userData:IUser[]){
        this.users = userData;
    }
    setLoading(bool:boolean){
       this.isLoading = bool;
    }
    async login(email:string, password:string){
        try {
            const response = await AuthServices.login(email,password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }catch (e:any) {
            console.log(e.response?.data?.message);
        }
    }
    async registration(email:string, password:string){
        try {
            const response = await AuthServices.registration(email,password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }catch (e:any) {
            console.log(e.response?.data?.message);
        }
    }
    async logout(){
        try {
            const response = await AuthServices.logout();
            localStorage.removeItem('token')
            this.setAuth(false);
            this.setUser({} as IUser);
        }catch (e:any) {
            console.log(e.response?.data?.message);
        }
    }
    async checkAuth(){
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`,{withCredentials:true});
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }catch (e:any) {
            console.log(e.response?.data?.message);
        }finally {
            this.setLoading(false);
        }
    }
    async getUsers(){
        try {
            const {data} = await UserService.fetchUsers();
            this.setUsers(data);
        }catch (e){
            console.log(e);
        }
    }
    
}