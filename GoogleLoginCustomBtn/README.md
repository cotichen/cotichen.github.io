# google-signin-demo
Google login demo using gapi

## Installation
```javascript
var startApp = function () {
  gapi.load('auth2', function () {
    auth2 = gapi.auth2.init({
      // Change this to your Google ID
      client_id: 'YOUR_GOOGLE_ID.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
        
    });
	  attachSignin(document.getElementById('btnGoogle'));
	});
};
//报错备注
Error: idpiframe_initialization_failed while implementing OAuth 2.0
//必须要添加plugin_name
you have to add plugin_name after the scope
         window.gapi.load('client:auth2', () => {
             window.gapi.client.init({
                 clientId: '716075642837-kergfh0638hu8iq5dimpgnlc1f08s61r.apps.googleusercontent.com',
                 scope: 'email',
                 **plugin_name: 'streamy'**
             }).then(() => {
                 this.auth = window.gapi.auth2.getAuthInstance();
                 this.setState({isSignedIn: this.auth.isSignedIn.get()})
             });
         });
     }
     
The Google library you are using is going to be deprecated; instead, you can use the new Google Identity Services for Web.

Since you have generated your client ID before 29 July 2022, you can use the older Google library by setting plugin_name : 'Any Descriptive Name' along with clientId and scope:
     window.gapi.client.init({
            clientId: '716075642837-kergfh0638hu8iq5dimpgnlc1f08s61r.apps.googleusercontent.com',
            scope: 'email',
            plugin_name: 'PLUGIN'
        })
```
