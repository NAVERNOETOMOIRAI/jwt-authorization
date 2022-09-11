import React, {FC, useContext, useLayoutEffect, useState, useEffect} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";


const App:FC = () => {
    const {store} = useContext(Context)
    useLayoutEffect(() => {
        if(localStorage.getItem('token')){
            store.checkAuth();
        }
    },[])

    if(store.isLoading){
        return <div>Загрузка...</div>
    }
    if(!store.isAuth){
        return (<LoginForm/>)
    }
  return (
    <div className="App">
        <h1>{`Пользователь авторизован ${store.user.email}`}</h1>
        <button onClick={() => store.logout()}>Выйти</button>
        <button onClick={() => store.getUsers()}>Получить юзеров</button>
        {store.users.map((item:IUser) => {
            return(<div key={item.email}>{item.email}</div>)
        })}
    </div>
  );
}

export default observer(App);
