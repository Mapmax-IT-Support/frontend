import { showError } from '../Actions/user-actions'
import { API } from '../Constants'


export async function registerUser(data) {

    var formBody = {
        'first': data.first.value,
        'last': data.last.value,
        'username': data.username.value.toLowerCase(),
        'email': data.email.value.toLowerCase(),
        'password': data.password.value
    };
    
    return fetch(API + 'users/register',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(formBody)
    })
        .then(response => response.json())
        .catch(error => {
            showError()
            console.error('Register User Error:', error)
        })
}

export async function editUser(data, uid) {

    var formBody = {
        'first': data.first.value,
        'last': data.last.value,
        'username': data.username.value.toLowerCase(),
        'email': data.email.value.toLowerCase(),
        'uid': uid
    };

    return fetch(API + 'users/edit',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(formBody)
    })
        .then(response => response.json())
        .catch(error => {
            showError()
            console.error('Register User Error:', error)
        })
}


export async function loginUser(email, password) {

    var formBody = {
        'email': email.toLowerCase(),
        'password': password
    };
    
    return fetch(API + 'users/login',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(formBody)
    })
        .then(response => response.json())
        .catch(error => {
            showError()
            console.error('Register User Error:', error)
        })
}

export async function setRecentSearches(uid, locations) {

    var formBody = {
        'uid': uid,
        'locations': locations
    };
    
    return fetch(API + 'users/recents',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(formBody)
    })
        .then(response => response.json())
        .catch(error => {
            showError()
            console.error('Register User Error:', error)
        })
}

export async function getUserInfo(uid) {

    var formBody = {
        'uid': uid
    };
    
    return fetch(API + 'users/info',
    {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(formBody)
    })
        .then(response => response.json())
        .catch(error => {
            showError()
            console.error('Register User Error:', error)
        })
}


export async function uploadProfilePic(formData) {
    
    return fetch(API + 'users/profile/upload',
    {
        method : 'POST',
        body : formData
    })
        .then(response => response.json())
        .catch(error => {
            console.error('upload profile photo error:', error)
        })
}

