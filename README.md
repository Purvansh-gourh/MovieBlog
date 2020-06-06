# MovieBlog
__________________________________________________________________
This is a movieBlog website which has following features :-

## Review Related
1. Add a movie or series review.
2. Add a comment on a review.
3. Like/Dislike a review.
4. Delete review.
5. Delete comment on review.

6. Can search a movie online and add review details from it<br>
   API used :- omdb to get movie details and get imdb id of movie
               to find detailed information

## User Related
1. Authentication mechanism
   - username and password based
   - Google authentication
   - Facebook authentication
2. Dashboard functions
   - Displays graphical visualization of likes on your reviews
     in bar and pie chart format
   - Links to your all reviews at one place
   - Edit profile settings
   - Delete account option
   - Link your Google and Facebook account to single account<br>
     Status of account linked displayed with option to link
   - Displays profile details
  
## Installations required
1.  Node.js (https://nodejs.org/en/download/)
2.  mongoDB (https://www.mongodb.com/download-center/community?tck=docs_server)
3.  npm (inside node.js to install packages)<br>
    (installation guide : https://www.guru99.com/download-install-node-js.html)
    
4.  using npm install necessary packages mentioned in package.json

## Configure file settings
1. create a configure.js file in configure directory with following structure

<pre>
 module.exports = {
    adminmail: {
        service: 'email service here eg-gmail',
        auth: {
            user: 'your email here',
            pass: 'your password here'
        }
    },
    authorization: {
        google: {
            clientID: 'your clientID here',
            clientSecret: 'your clientSecret here',
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        facebook: {
            clientID: 'your clientID here',
            clientSecret: 'your clientSecret here',
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'name', 'picture.type(large)', 'email']
        }
    }
 }
 </pre>

