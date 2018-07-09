# Majapahit

## Features

### Authentication

- User login, register or logout

### User

- Set or update avatar, username, name or bio
- Read user profile by username
- Search user by username or name
- Delete user account

### Follow

- Follow or unfollow user
- Read user followers or followings

### Post

- Create post image or video
- Update caption
- Feeds
- Read single post
- Read user posts
- Search posts by hashtag
- Delete post

### Comment

- Create or update comment
- Read comments by post
- Delete comment

### Like

- Like or unlike post
- Read post likes

### Activity

- Read my posts activities or users I've followed

### Notification

- Mention in caption by other user
- Mention in comment by other user
- Commented in my post
- Followed by other user
- Liked my post by other user
- Push notifications
- Read notifications

## Requirements

- Node.js
- npm
- MongoDB

## Setup

### Installation

Before running the Majapahit, ensure you have node + npm installed and run: `$ npm install`

### Config For App

- Change `mongoose: '[YOUR MongoDB URI]'` in /app/config.js

- Change `oneSignalKey: '[YOUR ONESIGNAL KEY]'` in /app/config.js

- Change `oneSignalAppID: '[YOUR ONESIGNAL APP ID]'` in /app/config.js

- Change `firebaseDatabase: 'https://[YOUR PROJECT ID].firebaseio.com/'` in /app/config.js

- Change `portConfig: '[YOUR_PORT_HERE]'` in /app/config.js

- Change `firebaseAdmin: '[FULLPATH/TO/Your Firebase Admin SDK File]'` in /app/config.js

### Config For Test

- Change `host: '[YOUR HOST]'` in /test/config.js

- Change `firebaseToken: '[FIREBASE TOKEN FROM CLIENT]'` in /test/config.js

- Change `device: '[ONESIGNAL player_id FROM CLIENT]'` in /test/config.js

- Change `firebaseTokenSecondUser: '[FIREBASE TOKEN FROM CLIENT FOR SECOND USER]'` in /test/config.js

- Change `deviceSecondUser: '[ONESIGNAL player_id FROM CLIENT FOR SECOND USER]'` in /test/config.js

## Run

Before running the Majapahit, make sure MongoDB is running

### App

`$ npm start`

### Test

`$ npm test`

## Collections

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/a44ede8234fe1c8ff52e#?env%5Blocalhost%5D=W3siZW5hYmxlZCI6dHJ1ZSwia2V5IjoiaG9zdCIsInZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDo4ODg4IiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6InRva2VuIiwidmFsdWUiOiIiLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoiZGV2aWNlIiwidmFsdWUiOiIiLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoidXNlcm5hbWUiLCJ2YWx1ZSI6IiIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJ1c2VyX2lkIiwidmFsdWUiOiIiLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoicG9zdF9pZCIsInZhbHVlIjoiIiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6ImNvbW1lbnRfaWQiLCJ2YWx1ZSI6IiIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJoYXNodGFnIiwidmFsdWUiOiIiLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoibmFtZV9vcl91c2VybmFtZSIsInZhbHVlIjoiIiwidHlwZSI6InRleHQifSx7ImVuYWJsZWQiOnRydWUsImtleSI6InR5cGUiLCJ2YWx1ZSI6IiIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJmaWxlX25hbWUiLCJ2YWx1ZSI6IiIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJsYXN0X2lkIiwidmFsdWUiOiIiLCJ0eXBlIjoidGV4dCJ9XQ==)
