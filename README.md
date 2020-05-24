# MovieBlog
__________________________________________________________________
This is a movieBlog website which has following features :-

## Review Related
1. Add a movie or series review.
2. Add a comment on a review.
3. Like/Dislike a review.
4. Delete review.
5. Delete comment on review.

6. Can search a movie online and add review details from it
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
   - Link your Google and Facebook account to single account
     Status of account linked displayed with option to link
   - Displays profile details
  
## Installations required
1.  Node.js (https://nodejs.org/en/download/)
2.  mongoDB (https://www.mongodb.com/download-center/community?tck=docs_server)
3.  npm (inside node.js to install packages)
    (installation guide : https://www.guru99.com/download-install-node-js.html)
    
4.  using npm install necessary packages mentioned in package.json

## Configure file settings
1. create a configure.js file in configure directory with following structure

1. module.exports = {
2.    adminmail: {
3.        service: 'email service here eg-gmail',
4.        auth: {
5.            user: 'your email here',
6.            pass: 'your password here'
7.        }
8.    },
9.    authorization: {
10.        google: {
11.            clientID: 'your clientID here',
12.            clientSecret: 'your clientSecret here',
13.            callbackURL: "http://localhost:3000/auth/google/callback"
14.        },
15.        facebook: {
16.            clientID: 'your clientID here',
17.            clientSecret: 'your clientSecret here',
18.            callbackURL: 'http://localhost:3000/auth/facebook/callback',
19.            profileFields: ['id', 'displayName', 'name', 'picture.type(large)', 'email']
20.        }
21.    }
22. }

