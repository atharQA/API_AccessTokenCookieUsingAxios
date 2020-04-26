var axios = require("axios");
const https = require('https');
require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

// // axios.defaults.withCredentials = true
// axios.defaults.validateStatus = (status) => {
//     return status;
// };

var instance = axios.create({
    validateStatus: function (status) {
        return status;
    }
});

var apiHelper = function () {

    //@author: Athar Gulfam
    this.generateAccessToken = async (hostUrl, username, password, client_id, client_secret)=> {
        try {
            var post_data = {
                "grant_type": "client_credentials",
                "username": username,
                "password": password,
                "client_id": client_id,
                "client_secret": client_secret
            }

            //// DO NOT DO THIS IF SHARING PRIVATE DATA WITH SERVICE
            //https://stackoverflow.com/questions/51363855/how-to-configure-axios-to-use-ssl-certificate
            const agent = new https.Agent({
                rejectUnauthorized: false
            });

            const response = await axios({
                method: 'post',
                // verify: false,
                url: hostUrl + ":443/auth/oauth/v0/token",
                // withCredentials: true,
                httpsAgent: agent,
                data: Object.keys(post_data).map(function (key) { return encodeURIComponent(key) + '=' + encodeURIComponent(post_data[key]) }).join('&'),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });
            console.log('response.data.access_token = ', response.data.access_token)
            return response.data.access_token;

        } catch (error) {
            console.log('token error is coming===============================:');
            console.log('token error:', error);

        }
    }

    //@author: Athar Gulfam
    this.postRequest = async (url, access_token, payload) => {
        try {
            var post_data = payload;

            var headers = {
                'Authorization': "Bearer " + access_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            const response = await axios({
                method: 'post',
                url: url,
                data: post_data,
                headers: headers
            });
            // console.log('AAAAA:', await response.data)

            return await response;

        } catch (error) {
            console.log('Failed to execute' & url + ' Found Error as :', error);
        }
    }


    //@author: Athar Gulfam
    this.getRequest = async function (url, access_token) {
        try {
            var headers = {
                'Authorization': "Bearer " + access_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            const response = await axios({
                method: 'get',
                url: url,
                headers: headers,
            });

            return await response;

        } catch (error) {
            console.log('Failed to execute ' + url & ' Found Error as ', error);
        }
    }

    this.getCookie = async function (url, access_token) {
        try {
            var headers = {
                'Authorization': "Bearer " + access_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            const response = await axios({
                method: 'get',
                url: url,
                // withCredentials: true,
                headers: headers,
            });

            // console.log('RES COKKIE', response.cookies)
            // console.log('RES HEADERS', response.headers)

            const cookie = response.headers["set-cookie"][0];
            // console.log('cookie 111::', cookie)

            console.log('cookie 222::', cookie.split(';')[0])

            let requestHeaderCookie = cookie.split(';')[0];
            return await requestHeaderCookie;

        } catch (error) {
            console.log('Failed to execute ' + url & ' Found Error as ', error);
        }
    }

}

module.exports = new apiHelper();